import { request } from './api'
import type { ApiUser, FriendRequest } from '../types/auth'

export async function getFriends(): Promise<ApiUser[]> {
  return request<ApiUser[]>('/friends')
}

export async function getPendingRequests(): Promise<FriendRequest[]> {
  return request<FriendRequest[]>('/friends/requests')
}

export async function searchUsers(q: string): Promise<ApiUser[]> {
  return request<ApiUser[]>(`/users/search?q=${encodeURIComponent(q)}`)
}

export async function sendFriendRequest(username: string): Promise<FriendRequest> {
  return request<FriendRequest>(`/friends/request/${encodeURIComponent(username)}`, {
    method: 'POST',
  })
}

export async function acceptFriendRequest(id: number): Promise<void> {
  await request<void>(`/friends/accept/${id}`, { method: 'PUT' })
}

export async function rejectFriendRequest(id: number): Promise<void> {
  await request<void>(`/friends/reject/${id}`, { method: 'DELETE' })
}
