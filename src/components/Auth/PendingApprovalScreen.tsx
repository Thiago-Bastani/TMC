import { useAuth } from '../../contexts/AuthContext'
import styles from './AuthScreen.module.css'

export default function PendingApprovalScreen() {
  const { logout } = useAuth()

  const minimize = () => window.electronAPI?.minimizeWindow()
  const close = () => window.electronAPI?.closeWindow()

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

        <div style={{ maxWidth: 240, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fff8dc', border: '1px solid #ccaa00', color: '#665500', fontSize: '11px', padding: '10px', borderRadius: '2px', lineHeight: 1.5 }}>
            ⏳ Sua conta está aguardando aprovação do administrador.
            <br />
            Você será notificado quando for aprovado.
          </div>
          <button
            className={styles.submitBtn}
            style={{ background: 'linear-gradient(to bottom, #888, #555)', borderColor: '#333' }}
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
