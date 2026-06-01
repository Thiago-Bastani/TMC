import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import styles from './InputArea.module.css'

interface InputAreaProps {
  onSend: (text: string) => void
}

export default function InputArea({ onSend }: InputAreaProps) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim()) {
      onSend(text)
      setText('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.inputArea}>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma mensagem..."
        autoFocus
      />
      <button className={styles.sendBtn} onClick={handleSend}>
        <span className={styles.sendIcon}>✉</span>
        <span>Enviar</span>
      </button>
    </div>
  )
}
