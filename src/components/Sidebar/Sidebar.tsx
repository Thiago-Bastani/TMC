import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { ApiUser, FriendRequest } from '../../types/auth'
import type { Contact } from '../../types/chat'
import {
  getFriends,
  getPendingRequests,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../../services/friends'
import { supabase } from '../../services/realtime'
import { ApiError } from '../../services/api'
import styles from './Sidebar.module.css'

interface SidebarProps {
  activeContact: Contact | null
  onSelectContact: (contact: Contact) => void
}

function avatarLetter(username: string) {
  return username.charAt(0).toUpperCase()
}

type RelationStatus = 'friend' | 'pending_sent' | 'none'

interface ProfilePanel {
  user: ApiUser
  relation: RelationStatus
  msg: { text: string; ok: boolean } | null
  loading: boolean
}

function Avatar({ user, size }: { user: ApiUser; size: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? styles.profilePanelAvatar : size === 'md' ? styles.meAvatar : styles.userAvatar
  return (
    <div className={cls}>
      {user.prof_pic ? (
        <img src={user.prof_pic} alt={user.username} />
      ) : (
        avatarLetter(user.username)
      )}
    </div>
  )
}

export default function Sidebar({ activeContact, onSelectContact }: SidebarProps) {
  const { user, logout } = useAuth()
  const [friends, setFriends] = useState<ApiUser[]>([])
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ApiUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [profile, setProfile] = useState<ProfilePanel | null>(null)

  const loadFriends = useCallback(async () => {
    try {
      const data = await getFriends()
      setFriends(data)
    } catch {
      // silent
    }
  }, [])

  const loadPending = useCallback(async () => {
    try {
      const data = await getPendingRequests()
      setPendingRequests(data)
    } catch {
      // silent
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadFriends()
    loadPending()
  }, [loadFriends, loadPending])

  // Realtime: new friend request arriving
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('friend_requests_incoming')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friend_requests',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => loadPending(),
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, loadPending])

  // Realtime: friend request accepted (we become friends)
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('friend_requests_accepted')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'friend_requests',
        },
        () => {
          loadFriends()
          loadPending()
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, loadFriends, loadPending])

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsers(searchQuery.trim())
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const getRelation = (u: ApiUser): RelationStatus => {
    if (friends.some(f => f.id === u.id)) return 'friend'
    return 'none'
  }

  const openProfile = (u: ApiUser) => {
    // If already a friend, open chat directly
    const rel = getRelation(u)
    if (rel === 'friend') {
      onSelectContact({ id: u.id, username: u.username, prof_pic: u.prof_pic })
      setSearchQuery('')
      setSearchResults([])
      return
    }
    setProfile({ user: u, relation: rel, msg: null, loading: false })
  }

  const handleSendRequest = async () => {
    if (!profile) return
    setProfile(p => p ? { ...p, loading: true, msg: null } : p)
    try {
      await sendFriendRequest(profile.user.username)
      setProfile(p => p ? { ...p, loading: false, relation: 'pending_sent', msg: { text: 'SolicitaÃ§Ã£o enviada!', ok: true } } : p)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao enviar solicitaÃ§Ã£o.'
      setProfile(p => p ? { ...p, loading: false, msg: { text: msg, ok: false } } : p)
    }
  }

  const handleOpenChat = (u: ApiUser) => {
    onSelectContact({ id: u.id, username: u.username, prof_pic: u.prof_pic })
    setProfile(null)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleAccept = async (req: FriendRequest) => {
    try {
      await acceptFriendRequest(req.id)
      setPendingRequests(prev => prev.filter(r => r.id !== req.id))
      loadFriends()
    } catch {
      // silent
    }
  }

  const handleReject = async (req: FriendRequest) => {
    try {
      await rejectFriendRequest(req.id)
      setPendingRequests(prev => prev.filter(r => r.id !== req.id))
    } catch {
      // silent
    }
  }

  const isShowingSearch = searchQuery.trim().length > 0
  const displayList = isShowingSearch ? searchResults : friends

  if (!user) return null

  return (
    <div className={styles.sidebar}>
      {/* Me row */}
      <div className={styles.meRow}>
        <Avatar user={user} size="md" />
        <div className={styles.meInfo}>
          <div className={styles.meUsername}>{user.username}</div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Sair">âœ•</button>
      </div>

      {/* Search */}
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar usuÃ¡rios..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setProfile(null) }}
        />
      </div>

      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>SolicitaÃ§Ãµes recebidas</span>
            <span className={styles.badge}>{pendingRequests.length}</span>
          </div>
          {pendingRequests.map(req => (
            <div key={req.id} className={styles.requestItem}>
              {req.sender && <Avatar user={req.sender} size="sm" />}
              <span className={styles.userName}>{req.sender?.username ?? '...'}</span>
              <div className={styles.requestActions}>
                <button className={styles.acceptBtn} onClick={() => handleAccept(req)} title="Aceitar">âœ“</button>
                <button className={styles.rejectBtn} onClick={() => handleReject(req)} title="Rejeitar">âœ•</button>
              </div>
            </div>
          ))}
          <div className={styles.divider} />
        </>
      )}

      {/* Friends / search results */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          {isShowingSearch
            ? (isSearching ? 'Buscando...' : `Resultados (${searchResults.length})`)
            : `Amigos (${friends.length})`}
        </span>
      </div>

      <div className={styles.listScroll}>
        {displayList.length === 0 && (
          <div className={styles.emptyHint}>
            {isShowingSearch ? 'Nenhum usuÃ¡rio encontrado.' : 'Nenhum amigo ainda.\nUse a busca acima.'}
          </div>
        )}
        {displayList.map(u => (
          <div
            key={u.id}
            className={`${styles.userItem} ${activeContact?.id === u.id && !isShowingSearch ? styles.active : ''}`}
            onClick={() => openProfile(u)}
          >
            <Avatar user={u} size="sm" />
            <span className={styles.userName}>{u.username}</span>
            {isShowingSearch && !friends.some(f => f.id === u.id) && (
              <span style={{ fontSize: '8px', color: '#0063b1', flexShrink: 0 }}>+</span>
            )}
          </div>
        ))}
      </div>

      {/* Profile panel â€” shown when clicking a non-friend from search */}
      {profile && (
        <div className={styles.profilePanel}>
          <div className={styles.profilePanelHeader}>
            <Avatar user={profile.user} size="lg" />
            <span className={styles.profilePanelName}>{profile.user.username}</span>
            <button
              className={styles.profilePanelClose}
              onClick={() => setProfile(null)}
              title="Fechar"
            >âœ•</button>
          </div>

          {profile.msg && (
            <div className={`${styles.profileMsg} ${profile.msg.ok ? styles.ok : styles.err}`}>
              {profile.msg.text}
            </div>
          )}

          <div className={styles.profilePanelActions}>
            {profile.relation === 'friend' ? (
              <button
                className={styles.profileActionBtn}
                onClick={() => handleOpenChat(profile.user)}
              >
                ðŸ’¬ Conversar
              </button>
            ) : profile.relation === 'pending_sent' ? (
              <button className={styles.profileActionBtn} disabled>
                â³ Aguardando...
              </button>
            ) : (
              <>
                <button
                  className={styles.profileActionBtn}
                  onClick={handleSendRequest}
                  disabled={profile.loading}
                >
                  {profile.loading ? '...' : 'âž• Adicionar amigo'}
                </button>
                <button
                  className={styles.profileActionBtnSecondary}
                  onClick={() => setProfile(null)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
