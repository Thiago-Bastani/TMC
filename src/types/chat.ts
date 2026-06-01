export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string | null
  media_url: string | null
  media_type: 'image' | 'audio' | 'gif' | null
  created_at: string
  sender?: {
    id: number
    username: string
    prof_pic: string | null
  }
}

export interface Contact {
  id: number
  username: string
  prof_pic: string | null
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
