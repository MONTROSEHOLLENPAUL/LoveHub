<template>
  <div class="fade-up">
    <div class="page-header">
      <h1><i class="bi bi-bullseye"></i> Défis en couple</h1>
      <p>Renforcez votre complicité avec ces activités</p>
    </div>

    <div class="points-banner card" style="margin-bottom:1.5rem">
      <div class="points-left">
        <div class="points-score">{{ couplePoints }}</div>
        <div class="points-label">Points de complicité</div>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
        <p class="progress-label">{{ completedCount }}/{{ challenges.length }} défis accomplis</p>
      </div>
      <div class="level-badge">
        <span>{{ levelEmoji }}</span>
        <span>{{ level }}</span>
      </div>
    </div>

    <div class="challenges-grid">
      <div v-for="c in challenges" :key="c.id" :class="['challenge-card card', { completed: c.completed }]">
        <div class="challenge-top">
          <span class="tag">{{ c.category }}</span>
          <span class="points-tag">+{{ c.points }} pts</span>
        </div>
        <h3>{{ c.title }}</h3>
        <p class="challenge-desc">{{ c.description }}</p>
        <button
          v-if="!c.completed"
          class="btn btn-primary btn-sm"
          @click="complete(c.id)"
          :disabled="completing === c.id"
        >
          {{ completing === c.id ? '...' : '✅ Défi accompli !' }}
        </button>
        <div v-else class="completed-badge">✨ Accompli !</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const challenges = ref([])
const couplePoints = ref(0)
const completing = ref(null)

const completedCount = computed(() => challenges.value.filter(c => c.completed).length)
const progressPct = computed(() => challenges.value.length ? (completedCount.value / challenges.value.length) * 100 : 0)

const level = computed(() => {
  const p = couplePoints.value
  if (p >= 300) return 'Couple Légendaire'
  if (p >= 200) return 'Couple Expert'
  if (p >= 100) return 'Couple Complice'
  return 'Couple Débutant'
})

const levelEmoji = computed(() => {
  const p = couplePoints.value
  if (p >= 300) return '👑'
  if (p >= 200) return '💎'
  if (p >= 100) return '🌟'
  return '💕'
})

async function loadChallenges() {
  try {
    const [ch, couple] = await Promise.all([axios.get('/api/challenges'), axios.get('/api/couple/me')])
    challenges.value = ch.data
    couplePoints.value = couple.data.couple?.points || 0
  } catch {}
}

async function complete(id) {
  completing.value = id
  try {
    const { data } = await axios.post(`/api/challenges/${id}/complete`)
    couplePoints.value = data.points
    const c = challenges.value.find(c => c.id === id)
    if (c) c.completed = true
  } catch {}
  finally { completing.value = null }
}

onMounted(() => { auth.fetchCouple(); loadChallenges() })
</script>

<style scoped>
.points-banner {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  background: linear-gradient(135deg, var(--dark), var(--dark-mid));
  color: white;
}

.points-score { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; color: var(--rose); }
.points-label { font-size: 0.85rem; opacity: 0.7; }

.progress-bar-wrap { flex: 1; min-width: 200px; }
.progress-bar { height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--rose), var(--teal)); border-radius: 4px; transition: width 0.5s ease; }
.progress-label { font-size: 0.82rem; opacity: 0.7; }

.level-badge { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.level-badge span:first-child { font-size: 2rem; }
.level-badge span:last-child { font-size: 0.78rem; opacity: 0.8; font-weight: 600; }

.challenges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

.challenge-card { transition: transform 0.2s; }
.challenge-card:hover { transform: translateY(-3px); }
.challenge-card.completed { opacity: 0.75; background: #F8FFF8; }

.challenge-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.points-tag { font-size: 0.8rem; font-weight: 700; color: var(--teal); background: var(--teal-light); padding: 0.25rem 0.65rem; border-radius: 50px; }

.challenge-card h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
.challenge-desc { font-size: 0.88rem; color: #666; line-height: 1.5; margin-bottom: 1.1rem; }

.completed-badge { font-size: 0.88rem; color: #4caf50; font-weight: 600; }
</style>
