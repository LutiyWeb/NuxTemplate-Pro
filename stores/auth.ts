import { defineStore } from 'pinia'
import axios from 'axios'

interface User { id: number; firstName: string; lastName: string; email: string; phone?: string }

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  if (process.client) {
    token.value = localStorage.getItem('access_token')
    const saved = localStorage.getItem('auth_user')
    if (saved) user.value = JSON.parse(saved)
  }

  const apiClient = axios.create({ baseURL: config.public.apiBase })

  function _save(t: string, u: User) {
    token.value = t
    user.value = u
    localStorage.setItem('access_token', t)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  function _clear() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await apiClient.post('/api/auth/login', { email, password })
      _save(res.data.token, res.data.user)
    } catch (err) {
      error.value = axios.isAxiosError(err)
        ? (err.response?.data?.error?.message ?? 'Ошибка входа')
        : 'Ошибка входа'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await apiClient.post('/api/auth/register', data)
      _save(res.data.token, res.data.user)
    } catch (err) {
      error.value = axios.isAxiosError(err)
        ? (err.response?.data?.error?.message ?? 'Ошибка регистрации')
        : 'Ошибка регистрации'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() { _clear() }

  async function deleteAccount() {
    loading.value = true
    error.value = null
    try {
      await apiClient.delete('/api/users/me', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      _clear()
    } catch (err) {
      error.value = 'Ошибка удаления аккаунта'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { token, user, loading, error, isLoggedIn, login, register, logout, deleteAccount }
})
