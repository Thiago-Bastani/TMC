import { request } from './api'
import type { Message } from '../types/chat'

export async function getConversation(username: string, cursor?: number): Promise<Message[]> {
  const query = cursor ? `?cursor=${cursor}` : ''
  return request<Message[]>(`/messages/${encodeURIComponent(username)}${query}`)
}

export async function sendMessage(receiverId: number, content: string): Promise<Message> {
  return request<Message>('/messages', {
    method: 'POST',
    body: { receiver_id: receiverId, content },
  })
}

export async function sendMediaMessage(receiverId: number, file: File): Promise<Message> {
  const form = new FormData()
  form.append('receiver_id', String(receiverId))
  form.append('file', file)
  return request<Message>('/messages', {
    method: 'POST',
    body: form,
  })
}
