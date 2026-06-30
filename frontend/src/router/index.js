import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/connect', component: () => import('../views/ConnectView.vue'), meta: { requiresAuth: true } },
  { path: '/chat', component: () => import('../views/ChatView.vue'), meta: { requiresAuth: true } },
  { path: '/planning', component: () => import('../views/PlanningView.vue'), meta: { requiresAuth: true } },
  { path: '/expenses', component: () => import('../views/ExpensesView.vue'), meta: { requiresAuth: true } },
  { path: '/memories', component: () => import('../views/MemoriesView.vue'), meta: { requiresAuth: true } },
  { path: '/challenges', component: () => import('../views/ChallengesView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.token) {
    const axios = (await import('axios')).default
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
})

export default router