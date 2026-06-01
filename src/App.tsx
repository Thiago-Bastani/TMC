import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginScreen from './components/Auth/LoginScreen'
import RegisterScreen from './components/Auth/RegisterScreen'
import Sidebar from './components/Sidebar/Sidebar'
import ChatWindow from './components/ChatWindow/ChatWindow'
import type { Contact } from './types/chat'

type AuthView = 'login' | 'register'

function AppInner() {
  const { user } = useAuth()
  const [authView, setAuthView] = useState<AuthView>('login')
  const [activeContact, setActiveContact] = useState<Contact | null>(null)

  if (!user) {
    if (authView === 'register') {
      return <RegisterScreen onGoLogin={() => setAuthView('login')} />
    }
    return <LoginScreen onGoRegister={() => setAuthView('register')} />
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activeContact={activeContact} onSelectContact={setActiveContact} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatWindow contact={activeContact} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

