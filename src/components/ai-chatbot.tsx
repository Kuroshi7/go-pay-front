"use client"
import React, { useState, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

const AI_QUESTION = 'qual o total das faturas geradas?';

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'olá sou seu assistente de IA, pergunte sobre suas faturas' }
  ]);
  const [input, setInput] = useState('');
  const { apiKey } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setLoading(true);
    let botReply = '';
    if (!apiKey) {
      botReply = 'API key não encontrada. Faça login para usar o bot.';
    } else {
      try {
        const res = await fetch('/api/ai-chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: input, apiKey })
        });
        const data = await res.json();
        botReply = data.answer || 'Erro ao gerar resposta.';
      } catch (err) {
        botReply = 'Erro ao buscar as faturas.';
      }
    }
    setMessages(msgs => [...msgs, { sender: 'bot', text: botReply }]);
    setInput('');
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
      {!open && (
        <button onClick={() => setOpen(true)} style={{ borderRadius: '50%', width: 50, height: 50, background: '#0070f3', color: '#fff', border: 'none', fontSize: 24 }}>🤖</button>
      )}
      {open && (
        <div style={{ width: 320, height: 400, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right', marginBottom: 8 }}>
                <span style={{ background: msg.sender === 'bot' ? '#eee' : '#0070f3', color: msg.sender === 'bot' ? '#333' : '#fff', borderRadius: 8, padding: '6px 12px', display: 'inline-block', wordBreak: 'break-word', maxWidth: 260 }}>{msg.text}</span>
              </div>
            ))}
            {loading && <div style={{ textAlign: 'left', color: '#888' }}>Pensando...</div>}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? handleSend() : null}
              style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8, minWidth: 0, color: '#222', background: '#fff' }}
              placeholder='Digite sua pergunta...'
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} style={{ borderRadius: 8, background: '#0070f3', color: '#fff', border: 'none', padding: '0 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>Enviar</button>
            <button onClick={() => setOpen(false)} style={{ borderRadius: 8, background: '#eee', color: '#333', border: 'none', padding: '0 8px', fontWeight: 700, whiteSpace: 'nowrap' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
