import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const couple = ref(null)
  const token = ref(localStorage.getItem('lovehub_token'))
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const partner = computed(() => {
    if (!couple.value || !user.value) return null
    const p1 = couple.value.partner1
    const p2 = couple.value.partner2
    return p1?._id === user.value._id ? p2 : p1
  })

  async function login(email, password) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      token.value = data.token
      user.value = data.user
      couple.value = data.couple
      localStorage.setItem('lovehub_token', data.token)
      return data
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('lovehub_token', data.token)
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
      couple.value = data.couple
    } catch {
      logout()
    }
  }

  async function updateCouple(payload) {
    const { data } = await api.patch('/couple', payload)
    couple.value = data.couple
  }

  async function joinCouple(inviteCode) {
    const { data } = await api.post('/couple/join', { inviteCode })
    couple.value = data.couple
  }

  function logout() {
    token.value = null
    user.value = null
    couple.value = null
    localStorage.removeItem('lovehub_token')
  }

  return { user, couple, token, loading, isLoggedIn, partner, login, register, fetchMe, updateCouple, joinCouple, logout }
})
