<template>
  <div class="fade-up">
    <div class="page-header">
      <h1>Bonjour, {{ auth.user?.name }} <i class="bi bi-hearts"></i></h1>
      <p>{{ greeting }}</p>
    </div>

    <!-- No couple yet -->
    <div v-if="!auth.couple" class="card" style="text-align:center;padding:3rem">
      <div style="font-size:3rem;margin-bottom:1rem">💑</div>
      <h2>Connectez-vous avec votre partenaire</h2>
      <p style="color:var(--muted);margin:0.75rem 0 1.5rem">Pour accéder à toutes les fonctionnalités</p>
      <router-link to="/connect" class="btn btn-primary">Connecter mon partenaire</router-link>
    </div>

    <div v-else>
      <!-- Partner banner -->
      <div class="partner-banner card" style="margin-bottom:1.5rem">
        <div class="partner-info">
          <div class="partner-avatar">{{ auth.partner?.name?.[0] || '?' }}</div>
          <div>
            <p class="partner-label">Votre partenaire</p>
            <h3>{{ auth.partner?.name || 'En attente...' }}</h3>
          </div>
        </div>
        <div v-if="auth.couple?.anniversary" class="anniversary">
          <span>❤️</span>
          <div>
            <p class="partner-label">Ensemble depuis</p>
            <strong>{{ daysTogether }} jours</strong>
          </div>
        </div>
        <div v-else>
          <button class="btn btn-outline btn-sm" @click="showAnniv = true">+ Anniversaire</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid-3" style="margin-bottom:1.5rem">
        <div class="stat-card">
          <div class="stat-value">{{ stats.messages }}</div>
          <div class="stat-label"><i class="bi bi-chat-heart"></i> Messages échangés</div>
        </div>
        <div class="stat-card teal">
          <div class="stat-value">{{ stats.memories }}</div>
          <div class="stat-label"><i class="bi bi-camera"></i> Souvenirs créés</div>
        </div>
        <div class="stat-card dark">
          <div class="stat-value">{{ auth.couple?.points || 0 }}</div>
          <div class="stat-label"><i class="bi bi-bullseye"></i> Points de complicité</div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="card" style="margin-bottom:1.5rem">
        <h2 style="margin-bottom:1.25rem;font-size:1.2rem">Actions rapides</h2>
        <div class="quick-actions">
          <router-link to="/chat" class="quick-btn">
            <span><i class="bi bi-chat-heart"></i></span><span>Envoyer un message</span>
          </router-link>
          <router-link to="/planning" class="quick-btn">
            <span><i class="bi bi-calendar-day"></i></span><span>Planifier un rendez-vous</span>
          </router-link>
          <router-link to="/memories" class="quick-btn">
            <span><i class="bi bi-camera"></i></span><span>Ajouter un souvenir</span>
          </router-link>
          <router-link to="/challenges" class="quick-btn">
            <span><i class="bi bi-bullseye"></i></span><span>Voir les défis</span>
          </router-link>
        </div>
      </div>

      <!-- Upcoming dates -->
      <div class="card" v-if="upcomingDates.length">
        <h2 style="margin-bottom:1rem;font-size:1.2rem">📅 Prochains rendez-vous</h2>
        <div v-for="d in upcomingDates" :key="d.id" class="date-item">
          <div class="date-dot"></div>
          <div>
            <strong>{{ d.title }}</strong>
            <p class="date-when">{{ formatDate(d.scheduledAt) }} · {{ d.location }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Anniversary modal -->
    <div v-if="showAnniv" class="modal-overlay" @click.self="showAnniv = false">
      <div class="modal card">
        <h3>📅 Date d'anniversaire de couple</h3>
        <input v-model="anniversaryDate" type="date" class="input" style="margin:1rem 0" />
        <div style="display:flex;gap:0.75rem">
          <button class="btn btn-primary" @click="saveAnniversary">Sauvegarder</button>
          <button class="btn btn-ghost" @click="showAnniv = false">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const showAnniv = ref(false)
const anniversaryDate = ref('')
const stats = ref({ messages: 0, memories: 0 })
const upcomingDates = ref([])

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bon matin ☀️'
  if (h < 18) return 'Bon après-midi 🌤️'
  return 'Bonne soirée 🌙'
})

const daysTogether = computed(() => {
  if (!auth.couple?.anniversary) return 0
  const diff = Date.now() - new Date(auth.couple.anniversary).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

async function saveAnniversary() {
  await axios.put('/api/couple/anniversary', { date: anniversaryDate.value })
  await auth.fetchCouple()
  showAnniv.value = false
}

onMounted(async () => {
  await auth.fetchCouple()
  if (!auth.couple) return
  try {
    const [msgs, mems, dates] = await Promise.all([
      axios.get('/api/messages'),
      axios.get('/api/memories'),
      axios.get('/api/dates')
    ])
    stats.value.messages = msgs.data.length
    stats.value.memories = mems.data.length
    const now = new Date()
    upcomingDates.value = dates.data.filter(d => new Date(d.scheduledAt) > now).slice(0, 3)
  } catch {}
})
</script>

<style scoped>
.partner-banner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.partner-info { display: flex; align-items: center; gap: 1rem; }
.partner-avatar {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rose), var(--rose-dark));
  color: white;
  font-size: 1.4rem;
  font-family: 'Playfair Display', serif;
  display: flex; align-items: center; justify-content: center;
}
.partner-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.anniversary { display: flex; align-items: center; gap: 0.75rem; }
.anniversary span { font-size: 1.5rem; }

.quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.quick-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #F8F8FA;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--dark);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.quick-btn:hover { background: var(--rose-light); color: var(--rose-dark); transform: translateY(-2px); }
.quick-btn span:first-child { font-size: 1.3rem; }

.date-item { display: flex; align-items: flex-start; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #F0F0F0; }
.date-item:last-child { border-bottom: none; }
.date-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--rose); margin-top: 6px; flex-shrink: 0; }
.date-when { font-size: 0.82rem; color: var(--muted); margin-top: 0.2rem; }

.modal-overlay { 
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,0.4); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 200;
  backdrop-filter: blur(6px); 
  }
.modal { max-width: 380px; width: 90%; }
.modal h3 { margin-bottom: 0.5rem; }
</style>
