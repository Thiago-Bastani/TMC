import { useState, useCallback } from 'react'
import type { Message } from '../types/chat'

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'them',
    senderName: 'João Silva',
    senderColor: '#CC0000',
    text: 'oi!! tudo bem?',
    timestamp: new Date(Date.now() - 8 * 60000),
  },
  {
    id: '2',
    sender: 'me',
    senderName: 'Eu',
    senderColor: '#0000CC',
    text: 'oi!! tudo sim e vc?',
    timestamp: new Date(Date.now() - 7 * 60000),
  },
  {
    id: '3',
    sender: 'them',
    senderName: 'João Silva',
    senderColor: '#CC0000',
    text: 'tô bem tbm haha... viu aquela música nova?',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '4',
    sender: 'me',
    senderName: 'Eu',
    senderColor: '#0000CC',
    text: 'qual? me manda o link aí',
    timestamp: new Date(Date.now() - 3 * 60000),
  },
]

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      senderName: 'Eu',
      senderColor: '#0000CC',
      text: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, msg])
  }, [])

  return { messages, sendMessage }
}
