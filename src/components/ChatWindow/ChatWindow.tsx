import type { Contact } from '../../types/chat'
import { useMessages } from '../../hooks/useMessages'
import TitleBar from './TitleBar'
import ContactHeader from './ContactHeader'
import MessageArea from './MessageArea'
import EmojiToolbar from './EmojiToolbar'
import InputArea from './InputArea'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  contact: Contact
}

export default function ChatWindow({ contact }: ChatWindowProps) {
  const { messages, sendMessage } = useMessages()

  return (
    <div className={styles.window}>
      <TitleBar contactName={contact.displayName} />
      <ContactHeader contact={contact} />
      <MessageArea messages={messages} />
      <EmojiToolbar />
      <InputArea onSend={sendMessage} />
    </div>
  )
}
