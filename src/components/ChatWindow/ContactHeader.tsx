import type { Contact } from '../../types/chat'
import styles from './ContactHeader.module.css'

const STATUS_COLORS = {
  online: '#00cc00',
  away: '#ffcc00',
  busy: '#cc0000',
  offline: '#aaaaaa',
}

interface ContactHeaderProps {
  contact: Contact
}

export default function ContactHeader({ contact }: ContactHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {contact.avatarUrl ? (
            <img src={contact.avatarUrl} alt={contact.displayName} />
          ) : (
            <span className={styles.avatarPlaceholder}>👤</span>
          )}
        </div>
        <span
          className={styles.statusDot}
          style={{ background: STATUS_COLORS[contact.status] }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{contact.displayName}</div>
        {contact.personalMessage && (
          <div className={styles.personalMessage}>{contact.personalMessage}</div>
        )}
      </div>
      <div className={styles.watermark}>TMC</div>
    </div>
  )
}
