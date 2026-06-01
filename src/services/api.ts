const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:80'

function getToken(): string | null {
  return localStorage.getItem('tmc_token')
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions {
  method?: HttpMethod
  body?: Record<string, unknown> | FormData
  auth?: boolean
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const isFormData = body instanceof FormData

  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const data = await res.json()
      message = data.message ?? message
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, message)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : ({} as T)
}
