
import { apiService } from '@/services/api';
import type { NextApiRequest, NextApiResponse } from 'next';

// TOOLS
async function toolTotal(apiKey: string) {
  const invoices: Array<{ amount: number }> = await apiService.getInvoices(apiKey);
  const total = invoices.reduce((sum: number, inv: { amount: number }) => sum + inv.amount, 0);
  return { total };
}

async function toolResumo(apiKey: string) {
  const invoices: Array<{ amount: number; status: string }> = await apiService.getInvoices(apiKey);
  const statusCount = { pendente: 0, aprovada: 0, rejeitada: 0 };
  let soma = 0;
  invoices.forEach(inv => {
    soma += inv.amount;
    if (inv.status === 'pending') statusCount.pendente++;
    if (inv.status === 'approved') statusCount.aprovada++;
    if (inv.status === 'rejected') statusCount.rejeitada++;
  });
  const media = invoices.length ? soma / invoices.length : 0;
  return {
    total: soma,
    media,
    pendentes: statusCount.pendente,
    aprovadas: statusCount.aprovada,
    rejeitadas: statusCount.rejeitada,
    quantidade: invoices.length
  };
}

// AGENT: Decide qual tool usar e monta o prompt
function agent(question: string) {
  function normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const normalized = normalize(question);
  const totalFaturaRegex = /(total|valor|quanto|soma).*fatura|fatura.*(total|valor|quanto|soma)/;
  const resumoFaturaRegex = /(resumo|status|situacao|media|pendente|aprovada|rejeitada).*fatura|fatura.*(resumo|status|situacao|media|pendente|aprovada|rejeitada)/;
  if (totalFaturaRegex.test(normalized)) {
    return 'total';
  } else if (resumoFaturaRegex.test(normalized)) {
    return 'resumo';
  } else {
    return '';
  }
}

// EXECUTOR: Faz o fetch para Hugging Face
async function executor(tool: string, question: string, apiKey: string) {
  let prompt = '';
  if (tool === 'total') {
    const { total } = await toolTotal(apiKey);
    prompt = `Você é um assistente que só responde ao total das faturas geradas. O valor total das faturas é R$ ${total.toFixed(2)}. Pergunta do usuário: ${question}`;
  } else if (tool === 'resumo') {
    const resumo = await toolResumo(apiKey);
    prompt = `Você é um assistente que só responde ao resumo das faturas. Resumo: Total de faturas: ${resumo.quantidade}, pendentes: ${resumo.pendentes}, aprovadas: ${resumo.aprovadas}, rejeitadas: ${resumo.rejeitadas}, soma total: R$ ${resumo.total.toFixed(2)}, média por fatura: R$ ${resumo.media.toFixed(2)}. Pergunta do usuário: ${question}`;
  } else {
    return 'desculpe nao consigo entender tudo completamente neste momento, ainda estou em treinamento';
  }
  return await callHuggingFace(prompt);
}

// Função central para chamar Hugging Face
async function callHuggingFace(prompt: string) {
  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'swiss-ai/Apertus-8B-Instruct-2509:publicai'
    })
  });
  let answer = 'Erro ao gerar resposta.';
  try {
    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      answer = data.choices[0].message.content;
    }
  } catch {
    answer = `Erro: status ${response.status}`;
  }
  return answer;
}

// HANDLER API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Método não permitido' });
      return;
    }
    const { question, apiKey } = req.body;
    if (!question || !apiKey) {
      res.status(400).json({ error: 'Pergunta ou apiKey ausente.' });
      return;
    }
    const tool = agent(question);
    const answer = await executor(tool, question, apiKey);
    res.status(200).json({ answer });
  } catch (err) {
    console.error('[AI-CHATBOT] Erro interno:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
}
