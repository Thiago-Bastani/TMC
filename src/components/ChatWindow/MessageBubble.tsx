import type { Message } from '../../types/chat'
import styles from './MessageBubble.module.css'

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={styles.message}>
      <div className={styles.senderLine} style={{ color: message.senderColor }}>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
        {message.senderName} diz:
      </div>
      <div className={styles.text}>{message.text}</div>
    </div>
  )
}
