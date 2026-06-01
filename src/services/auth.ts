import { request } from './api'
import type { LoginResponse } from '../types/auth'

export async function login(username: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  })
}

export async function register(username: string, password: string, profPic?: string): Promise<void> {
  await request<void>('/register', {
    method: 'POST',
    body: { username, password, prof_pic: profPic },
    auth: false,
  })
}

export async function logout(): Promise<void> {
  await request<void>('/logout', { method: 'POST' })
}
