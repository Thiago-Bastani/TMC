export interface ApiUser {
  id: number
  username: string
  prof_pic: string | null
}

export interface AuthUser extends ApiUser {
  is_admin: boolean
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface FriendRequest {
  id: number
  sender_id: number
  receiver_id: number
  status: 'pending' | 'accepted'
  sender?: ApiUser
  receiver?: ApiUser
  created_at: string
}
