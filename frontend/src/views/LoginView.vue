<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-brand">
        <div class="brand-icon"><i class="bi bi-hearts"></i></div>
        <h1>LoveHub</h1>
        <p class="brand-tagline">Bienvenue sur Love Hub, l'espace moderne conçu pour provoquer de vraies rencontres et connecter les cœurs. Que vous recherchiez le grand amour, une relation complice ou simplement à élargir votre horizon, Love Hub vous accompagne à chaque étape. <br>
Grâce à une interface fluide, chaleureuse et intuitive, découvrez des profils qui partagent authentiquement vos centres d'intérêt et votre vision du couple. Ne laissez plus le hasard décider.</p>
      </div>
      <div class="features-preview">
        <div v-for="f in features" :key="f.icon" class="feature-pill">
          <span><i :class="f.icon"></i></span> {{ f.label }}
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-card">
        <div class="tab-switch">
          <button :class="['tab', { active: mode === 'login' }]" @click="mode = 'login'">Connexion</button>
          <button :class="['tab', { active: mode === 'register' }]" @click="mode = 'register'">Inscription</button>
        </div>

        <form @submit.prevent="submit">
          <div v-if="mode === 'register'" class="field">
            <label class="input-label">Nom Complet</label>
            <input v-model="form.name" class="input"  required />
          </div>
          <div class="field">
            <label class="input-label">Email</label>
            <input v-model="form.email" type="email" class="input"  required />
          </div>
          <div class="field">
            <label class="input-label">Mot de passe</label>
            <input v-model="form.password" type="password" class="input"  required />
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? '...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()
const mode = ref('login')
const loading = ref(false)
const error = ref('')

const form = reactive({ name: '', email: '', password: '' })

const features = [
  { icon: 'bi bi-chat-heart', label: 'Chat privé chiffré' },
  { icon: 'bi bi-calendar-day', label: 'Planificateur de dates' },
  { icon: 'bi bi-cash-coin', label: 'Dépenses partagées' },
  { icon: 'bi bi-camera', label: 'Journal de souvenirs' },
  { icon: 'bi bi-bullseye', label: 'Défis en couple' },
]

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(form.email, form.password)
    } else {
      await auth.register(form.name, form.email, form.password)
    }
    await auth.fetchCouple()
    router.push(auth.hasCouple ? '/' : '/connect')
  } catch (e) {
    error.value = e.response?.data?.error || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
}

.login-left {
  flex: 1;
  background: linear-gradient(160deg, var(--dark) 0%, #2d1b2e 60%, #3d1030 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232,99,122,0.3) 0%, transparent 70%);
  top: -100px; right: -100px;
}

.login-left::after {
  content: '';
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(43,191,176,0.2) 0%, transparent 70%);
  bottom: -50px; left: -80px;
}

.login-brand { text-align: center; z-index: 1; }

.brand-icon { 
  font-size: 4rem; /*margin-bottom: 1rem;*/
    color: #ff0000;
    text-shadow: 2px 2px 6px black; 
}

.login-brand h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: white;
  margin-bottom: 0.75rem;
}

.brand-tagline {
  color: rgba(255,255,255,0.6);
  font-size: 1.1rem;
  line-height: 1.7;
  font-style: italic;
}

.features-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.5rem;
  justify-content: center;
  z-index: 1;
  max-width: 360px;
}

.feature-pill {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.85);
  padding: 0.5rem 1.1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--cream);
}

.login-card {
  width: 100%;
  max-width: 380px;
}

.tab-switch {
  display: flex;
  gap: 0;
  background: #EEE;
  border-radius: 50px;
  padding: 4px;
  margin-bottom: 2rem;
}

.tab {
  flex: 1;
  padding: 0.65rem;
  border: none;
  background: transparent;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active { background: white; color: var(--rose); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

.field { margin-bottom: 1.25rem; }

.btn-block { width: 100%; justify-content: center; margin-top: 0.5rem; }

.error-msg {
  color: var(--rose-dark);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  background: var(--rose-light);
  padding: 0.6rem 0.9rem;
  border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
  .login-page { flex-direction: column; }
  .login-left { padding: 3rem 2rem 2rem; min-height: 40vh; }
  .login-right { width: 100%; padding: 2rem 1.5rem; }
}
</style>
