<template>
  <div>
    <div v-if="auth.isLoggedIn" class="app-shell">
      <nav class="sidebar">
        <div class="sidebar-logo"><i class="bi bi-hearts"></i> Love<span>Hub</span></div>
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="icon"><i class="bi bi-house-door"></i></span><span>Accueil</span>
        </router-link>
        <router-link to="/chat" class="nav-item" :class="{ active: $route.path === '/chat' }">
          <span class="icon"><i class="bi bi-chat-heart"></i></span><span>Chat</span>
        </router-link>
        <router-link to="/planning" class="nav-item" :class="{ active: $route.path === '/planning' }">
          <span class="icon"><i class="bi bi-calendar-day"></i></span><span>Planning</span>
        </router-link>
        <router-link to="/expenses" class="nav-item" :class="{ active: $route.path === '/expenses' }">
          <span class="icon"><i class="bi bi-cash-coin"></i></span><span>Dépenses</span>
        </router-link>
        <router-link to="/memories" class="nav-item" :class="{ active: $route.path === '/memories' }">
          <span class="icon"><i class="bi bi-camera"></i></span><span>Souvenirs</span>
        </router-link>
        <router-link to="/challenges" class="nav-item" :class="{ active: $route.path === '/challenges' }">
          <span class="icon"><i class="bi bi-bullseye"></i></span><span>Défis</span>
        </router-link>
        <div class="nav-bottom">
          <div class="nav-item" @click="logout">
            <span class="icon"><i class="bi bi-box-arrow-in-left"></i></span><span>Déconnexion</span>
          </div>
        </div>
      </nav>
      <main class="main-content fade-up">
        <router-view />
      </main>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth.js'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
