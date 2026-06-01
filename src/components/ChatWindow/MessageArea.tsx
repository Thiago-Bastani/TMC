import { useEffect, useRef } from 'react'
import type { Message } from '../../types/chat'
import MessageBubble from './MessageBubble'
import styles from './MessageArea.module.css'

interface MessageAreaProps {
  messages: Message[]
  myId: number
  isLoading?: boolean
}

export default function MessageArea({ messages, myId, isLoading }: MessageAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={styles.area}>
      {isLoading && (
        <div style={{ textAlign: 'center', color: '#666', fontSize: '10px', padding: '8px' }}>
          Carregando mensagens...
        </div>
      )}
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} myId={myId} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
