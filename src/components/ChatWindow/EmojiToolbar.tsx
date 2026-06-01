import styles from './EmojiToolbar.module.css'

export default function EmojiToolbar() {
  return (
    <div className={styles.toolbar}>
      <button className={styles.btn} title="Fonte">Aa</button>
      <button className={styles.btn} title="Negrito"><b>B</b></button>
      <button className={`${styles.btn} ${styles.italic}`} title="Itálico">I</button>
      <button className={`${styles.btn} ${styles.underline}`} title="Sublinhado">U</button>
      <div className={styles.separator} />
      <button className={styles.btn} title="Emoticons">😊</button>
      <button className={styles.btn} title="Cutucão">👋</button>
      <button className={styles.btn} title="Arquivo">📎</button>
    </div>
  )
}
