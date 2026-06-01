import { useState, type FormEvent } from 'react'
import { register as registerApi } from '../../services/auth'
import { ApiError } from '../../services/api'
import styles from './AuthScreen.module.css'

interface RegisterScreenProps {
  onGoLogin: () => void
}

export default function RegisterScreen({ onGoLogin }: RegisterScreenProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const minimize = () => window.electronAPI?.minimizeWindow()
  const close = () => window.electronAPI?.closeWindow()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setIsLoading(true)
    try {
      await registerApi(username.trim(), password)
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro de conexão com o servidor.')
      }
    } finally {
      setIsLoading(false)
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
          <span className={styles.titleBarTitle}>TMC Messenger — Criar conta</span>
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
          <span className={styles.logoLabel}>Nova conta</span>
        </div>

        {success ? (
          <div className={styles.form}>
            <div style={{ background: '#e0ffe0', border: '1px solid #008800', color: '#006600', fontSize: '11px', padding: '8px', borderRadius: '2px', textAlign: 'center' }}>
              Conta criada! Aguarde a aprovação do administrador.
            </div>
            <button type="button" className={styles.link} onClick={onGoLogin}>
              ← Voltar ao login
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Usuário (3-30 chars, a-z 0-9 _-)</label>
              <input
                className={styles.input}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_\-]+"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Senha (mínimo 8 caracteres)</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirmar senha</label>
              <input
                className={styles.input}
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            <button className={styles.submitBtn} type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar conta'}
            </button>

            <button type="button" className={styles.link} onClick={onGoLogin}>
              ← Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
