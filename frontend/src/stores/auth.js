import { defineStore } from 'pinia'
import axios from 'axios'

const API = '/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('lh_user') || 'null'),
    token: localStorage.getItem('lh_token') || null,
    couple: null,
    partner: null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    hasCouple: (s) => !!s.user?.coupleId,
  },
  actions: {
    setAuth(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('lh_token', token)
      localStorage.setItem('lh_user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    async login(email, password) {
      const { data } = await axios.post(`${API}/auth/login`, { email, password })
      this.setAuth(data.token, data.user)
    },
    async register(name, email, password) {
      const { data } = await axios.post(`${API}/auth/register`, { name, email, password })
      this.setAuth(data.token, data.user)
    },
    async fetchCouple() {
      try {
        const { data } = await axios.get(`${API}/couple/me`)
        this.couple = data.couple
        this.partner = data.partner
      } catch (e){
        console.log(e.message);
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.couple = null
      this.partner = null
      localStorage.removeItem('lh_token')
      localStorage.removeItem('lh_user')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})