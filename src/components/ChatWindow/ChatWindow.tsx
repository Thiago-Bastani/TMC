import type { Contact } from '../../types/chat'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../contexts/AuthContext'
import TitleBar from './TitleBar'
import ContactHeader from './ContactHeader'
import MessageArea from './MessageArea'
import EmojiToolbar from './EmojiToolbar'
import InputArea from './InputArea'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  contact: Contact | null
}

export default function ChatWindow({ contact }: ChatWindowProps) {
  const { user } = useAuth()
  const { messages, isLoading, sendError, clearSendError, sendMessage, sendMedia } = useMessages(contact)

  const handleSend = async (text: string) => {
    try {
      await sendMessage(text)
    } catch {
      // error is shown via sendError state
    }
  }

  const handleSendMedia = async (file: File) => {
    try {
      await sendMedia(file)
    } catch {
      // error is shown via sendError state
    }
  }

  if (!contact) {
    return (
      <div className={styles.window} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TitleBar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
          Selecione um amigo na lista à esquerda para começar a conversar.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.window}>
      <TitleBar contactUsername={contact.username} />
      <ContactHeader contact={contact} />
      <MessageArea messages={messages} myId={user!.id} isLoading={isLoading} />
      {sendError && (
        <div
          style={{
            background: '#ffe0e0',
            border: '1px solid #cc0000',
            color: '#cc0000',
            fontSize: '10px',
            padding: '4px 8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{sendError}</span>
          <button
            onClick={clearSendError}
            style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontSize: '10px', padding: '0 4px' }}
          >
            ✕
          </button>
        </div>
      )}
      <EmojiToolbar />
      <InputArea onSend={handleSend} onSendMedia={handleSendMedia} />
    </div>
  )
}
