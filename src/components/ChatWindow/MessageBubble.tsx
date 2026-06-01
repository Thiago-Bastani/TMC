import type { Message } from '../../types/chat'
import styles from './MessageBubble.module.css'

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

interface MessageBubbleProps {
  message: Message
  myId: number
}

export default function MessageBubble({ message, myId }: MessageBubbleProps) {
  const isMe = message.sender_id === myId
  const senderName = message.sender?.username ?? (isMe ? 'Eu' : '...')
  const senderColor = isMe ? '#0000CC' : '#CC0000'

  return (
    <div className={styles.message}>
      <div className={styles.senderLine} style={{ color: senderColor }}>
        <span className={styles.timestamp}>{formatTime(message.created_at)}</span>
        {senderName} diz:
      </div>
      {message.content && <div className={styles.text}>{message.content}</div>}
      {message.media_url && message.media_type === 'image' && (
        <img
          className={styles.mediaImage}
          src={message.media_url}
          alt="imagem"
          style={{ maxWidth: '100%', maxHeight: 200, display: 'block', marginTop: 4, borderRadius: 2 }}
        />
      )}
      {message.media_url && message.media_type === 'gif' && (
        <img
          className={styles.mediaImage}
          src={message.media_url}
          alt="gif"
          style={{ maxWidth: '100%', maxHeight: 200, display: 'block', marginTop: 4, borderRadius: 2 }}
        />
      )}
      {message.media_url && message.media_type === 'audio' && (
        <audio controls src={message.media_url} style={{ marginTop: 4, width: '100%' }} />
      )}
    </div>
  )
}
