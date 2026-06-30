<template>
  <div class="connect-page">
    <div class="connect-card card">
      <div class="connect-icon">💑</div>
      <h1>Connectez-vous avec votre partenaire</h1>
      <p class="sub">Invitez votre moitié ou rejoignez avec un code</p>

      <div class="connect-tabs">
        <button :class="['tab', { active: tab === 'invite' }]" @click="tab = 'invite'">Inviter</button>
        <button :class="['tab', { active: tab === 'join' }]" @click="tab = 'join'">Rejoindre</button>
      </div>

      <div v-if="tab === 'invite'">
        <p class="info-text">Générez un code et partagez-le avec votre partenaire</p>
        <button class="btn btn-primary" @click="generateCode" :disabled="loading">
          {{ loading ? '...' : '✨ Générer un code' }}
        </button>
        <div v-if="inviteCode" class="code-display">
          <div class="code">{{ inviteCode }}</div>
          <p class="code-note">⏰ Valide 24h — partagez ce code avec votre partenaire</p>
        </div>
      </div>

      <div v-else>
        <p class="info-text">Entrez le code reçu de votre partenaire</p>
        <input v-model="joinCode" class="input code-input" placeholder="EX: ABC123" maxlength="6" />
        <button class="btn btn-primary" @click="joinCouple" :disabled="loading || !joinCode">
          {{ loading ? '...' : '💕 Rejoindre le couple' }}
        </button>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const router = useRouter()
const tab = ref('invite')
const loading = ref(false)
const error = ref('')
const inviteCode = ref('')
const joinCode = ref('')

async function generateCode() {
  loading.value = true; error.value = ''
  try {
    const { data } = await axios.post('/api/couple/invite')
    inviteCode.value = data.code
  } catch (e) {
    error.value = e.response?.data?.error || 'Erreur'
  } finally { loading.value = false }
}

async function joinCouple() {
  loading.value = true; error.value = ''
  try {
    await axios.post('/api/couple/join', { code: joinCode.value.toUpperCase() })
    await auth.fetchCouple()
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.error || 'Code invalide'
  } finally { loading.value = false }
}
</script>

<style scoped>
.connect-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream) 0%, #fce4ec 100%);
  padding: 2rem;
}

.connect-card {
  max-width: 480px;
  width: 100%;
  text-align: center;
  padding: 3rem;
}

.connect-icon { font-size: 3.5rem; margin-bottom: 1rem; }
h1 { font-size: 1.7rem; margin-bottom: 0.5rem; }
.sub { color: var(--muted); margin-bottom: 2rem; }

.connect-tabs {
  display: flex;
  gap: 4px;
  background: #EEE;
  border-radius: 50px;
  padding: 4px;
  margin-bottom: 2rem;
}

.tab {
  flex: 1;
  padding: 0.6rem;
  border: none;
  background: transparent;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--muted);
  transition: all 0.2s;
}

.tab.active { background: white; color: var(--rose); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

.info-text { color: var(--muted); margin-bottom: 1.25rem; font-size: 0.9rem; }

.code-display { margin-top: 1.5rem; }
.code {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  letter-spacing: 0.3em;
  color: var(--rose);
  background: var(--rose-light);
  padding: 1rem 2rem;
  border-radius: var(--radius-sm);
  margin-bottom: 0.75rem;
}

.code-note { font-size: 0.82rem; color: var(--muted); }

.code-input {
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 0.3em;
  font-family: 'Playfair Display', serif;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.error-msg {
  margin-top: 1rem;
  color: var(--rose-dark);
  background: var(--rose-light);
  padding: 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}
</style>
