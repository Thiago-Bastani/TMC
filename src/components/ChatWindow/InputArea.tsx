import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import styles from './InputArea.module.css'

const ACCEPTED = 'image/jpeg,image/png,image/gif,audio/mpeg,audio/ogg,audio/webm,audio/mp4'

interface InputAreaProps {
  onSend: (text: string) => void
  onSendMedia?: (file: File) => void
  disabled?: boolean
}

export default function InputArea({ onSend, onSendMedia, disabled }: InputAreaProps) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<{ name: string; file: File } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (preview && onSendMedia) {
      onSendMedia(preview.file)
      setPreview(null)
      return
    }
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

  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    setPreview({ name: file.name, file })
    ;(e.target as HTMLInputElement).value = ''
  }

  return (
    <div className={styles.inputArea}>
      {preview && (
        <div className={styles.preview}>
          <span className={styles.previewName}>📎 {preview.name}</span>
          <button className={styles.previewRemove} onClick={() => setPreview(null)}>✕</button>
        </div>
      )}
      <div className={styles.row}>
        <button
          className={styles.attachBtn}
          type="button"
          onClick={() => fileRef.current?.click()}
          title="Anexar arquivo"
          disabled={disabled}
        >
          📎
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <textarea
          className={styles.textarea}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={preview ? '' : 'Digite uma mensagem...'}
          autoFocus
          disabled={disabled || !!preview}
        />
        <button className={styles.sendBtn} onClick={handleSend} disabled={disabled || (!text.trim() && !preview)}>
          <span className={styles.sendIcon}>✉</span>
          <span>Enviar</span>
        </button>
      </div>
    </div>
  )
}
