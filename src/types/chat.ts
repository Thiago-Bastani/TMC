export interface Message {
  id: string
  sender: 'me' | 'them'
  senderName: string
  senderColor: string
  text: string
  timestamp: Date
}

export interface Contact {
  id: string
  displayName: string
  personalMessage: string
  avatarUrl: string | null
  status: 'online' | 'away' | 'busy' | 'offline'
}

declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
    }
  }
}
