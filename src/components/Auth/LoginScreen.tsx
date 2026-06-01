import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { ApiError } from '../../services/api'
import styles from './AuthScreen.module.css'

interface LoginScreenProps {
  onGoRegister: () => void
}

export default function LoginScreen({ onGoRegister }: LoginScreenProps) {
  const { login, isLoading, error, clearError } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const minimize = () => window.electronAPI?.minimizeWindow()
  const close = () => window.electronAPI?.closeWindow()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await login(username.trim(), password)
    } catch (err) {
      // error is set in AuthContext
      if (err instanceof ApiError && err.status === 403) {
        // pending/rejected — handled by App.tsx redirect
      }
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.titleBar}>
        <div className={styles.titleBarLeft}>
          <svg className={styles.titleBarLogo} viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="white" fillOpacity="0.9" />
            <text x="7" y="10.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0063b1">T</text>
          </svg>
          <span className={styles.titleBarTitle}>TMC Messenger</span>
        </div>
        <div className={styles.titleBarControls}>
          <button className={styles.titleBarBtn} onClick={minimize}>_</button>
          <button className={`${styles.titleBarBtn} ${styles.titleBarBtnClose}`} onClick={close}>✕</button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.logo}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>T</span>
          </div>
          <span className={styles.logoLabel}>TMC Messenger</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Usuário</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          <button type="button" className={styles.link} onClick={onGoRegister}>
            Não tem conta? Registre-se
          </button>
        </form>
      </div>
    </div>
  )
}
