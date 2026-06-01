import { useState, useEffect, useCallback, useRef } from 'react'
import type { Message } from '../types/chat'
import type { Contact } from '../types/chat'
import { getConversation, sendMessage as apiSendMessage, sendMediaMessage } from '../services/messages'
import { supabase } from '../services/realtime'
import { useAuth } from '../contexts/AuthContext'
import { ApiError } from '../services/api'

export function useMessages(contact: Contact | null) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Load history when contact changes
  useEffect(() => {
    if (!contact) {
      setMessages([])
      return
    }
    setIsLoading(true)
    setSendError(null)
    setMessages([])
    getConversation(contact.username)
      .then(data => setMessages(data))
      .catch(() => setMessages([]))
      .finally(() => setIsLoading(false))
  }, [contact])

  // Realtime: subscribe to new messages in this conversation
  useEffect(() => {
    if (!contact || !user) return

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = supabase
      .channel(`messages:${Math.min(user.id, contact.id)}_${Math.max(user.id, contact.id)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const msg = payload.new as Message
          if (msg.sender_id === contact.id) {
            setMessages(prev => [...prev, msg])
          }
        },
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [contact, user])

  const sendMessage = useCallback(async (text: string) => {
    if (!contact || !text.trim()) return
    setSendError(null)
    try {
      const msg = await apiSendMessage(contact.id, text.trim())
      setMessages(prev => [...prev, msg])
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setSendError('Vocês não são amigos. Adicione-o como amigo antes de enviar mensagens.')
      } else {
        setSendError(err instanceof Error ? err.message : 'Erro ao enviar mensagem.')
      }
      throw err
    }
  }, [contact])

  const sendMedia = useCallback(async (file: File) => {
    if (!contact) return
    setSendError(null)
    try {
      const msg = await sendMediaMessage(contact.id, file)
      setMessages(prev => [...prev, msg])
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setSendError('Vocês não são amigos. Adicione-o como amigo antes de enviar arquivos.')
      } else {
        setSendError(err instanceof Error ? err.message : 'Erro ao enviar arquivo.')
      }
      throw err
    }
  }, [contact])

  const clearSendError = useCallback(() => setSendError(null), [])

  return { messages, isLoading, sendError, clearSendError, sendMessage, sendMedia }
}
