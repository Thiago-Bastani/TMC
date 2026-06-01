import ChatWindow from './components/ChatWindow/ChatWindow'
import type { Contact } from './types/chat'

const MOCK_CONTACT: Contact = {
  id: '1',
  displayName: 'João Silva',
  personalMessage: 'ouvindo linkin park 🎵',
  avatarUrl: null,
  status: 'online',
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ChatWindow contact={MOCK_CONTACT} />
    </div>
  )
}
