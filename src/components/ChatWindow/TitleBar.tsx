import styles from './TitleBar.module.css'

interface TitleBarProps {
  contactName: string
}

export default function TitleBar({ contactName }: TitleBarProps) {
  const minimize = () => window.electronAPI?.minimizeWindow()
  const maximize = () => window.electronAPI?.maximizeWindow()
  const close = () => window.electronAPI?.closeWindow()

  return (
    <div className={styles.titleBar}>
      <div className={styles.left}>
        <svg className={styles.logo} viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" fill="white" fillOpacity="0.9" />
          <text x="7" y="10.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0063b1">T</text>
        </svg>
        <span className={styles.title}>TMC — {contactName}</span>
      </div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={minimize} title="Minimizar">_</button>
        <button className={styles.btn} onClick={maximize} title="Maximizar">□</button>
        <button className={`${styles.btn} ${styles.btnClose}`} onClick={close} title="Fechar">✕</button>
      </div>
    </div>
  )
}
