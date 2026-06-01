import type { Contact } from '../../types/chat'
import styles from './ContactHeader.module.css'

interface ContactHeaderProps {
  contact: Contact
}

export default function ContactHeader({ contact }: ContactHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {contact.prof_pic ? (
            <img src={contact.prof_pic} alt={contact.username} />
          ) : (
            <span className={styles.avatarPlaceholder}>👤</span>
          )}
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{contact.username}</div>
      </div>
      <div className={styles.watermark}>TMC</div>
    </div>
  )
}
