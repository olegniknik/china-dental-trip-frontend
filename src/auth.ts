/**
 * Хранение токена и базовый URL API.
 * Для запросов с авторизацией используйте apiFetch (при 401 редирект на /login).
 */
const AUTH_TOKEN_KEY = 'auth_token'
// 127.0.0.1 совпадает с хостом uvicorn, чтобы не было проблем с localhost/IPv6
const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? 'http://127.0.0.1:8002'

export function getApiBase(): string {
  return API_BASE
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

/**
 * Запрос к API с токеном. При 401 — редирект на /login.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const token = getToken()
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(url, { ...options, headers })
  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return res
}
