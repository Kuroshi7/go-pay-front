"use client"
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AIChatBot from '@/components/ai-chatbot';

export default function GlobalChatBot() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <AIChatBot />;
}
