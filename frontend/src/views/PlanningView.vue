<template>
  <div class="fade-up">
    <div class="page-header">
      <h1><i class="bi bi-calendar-day"></i> Planificateur de dates</h1>
      <p>Organisez vos sorties et moments romantiques</p>
    </div>

    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem">
      <button class="btn btn-primary" @click="showForm = true">+ Nouveau rendez-vous</button>
    </div>

    <div v-if="dates.length === 0" class="empty-state card">
      <div class="emoji">🌹</div>
      <p>Aucun rendez-vous prévu — planifiez votre prochain moment ensemble</p>
    </div>

    <div v-else class="dates-list">
      <div v-for="d in sortedDates" :key="d.id" :class="['date-card card', { past: isPast(d.scheduledAt) }]">
        <div class="date-header">
          <div>
            <span :class="['tag', d.type === 'restaurant' ? 'tag-teal' : '']">{{ typeIcon(d.type) }} {{ d.type }}</span>
            <h3>{{ d.title }}</h3>
          </div>
          <button class="btn btn-ghost btn-sm" @click="deleteDate(d.id)">🗑</button>
        </div>
        <div class="date-meta">
          <span><i class="bi bi-calendar-day"></i> {{ formatDate(d.scheduledAt) }}</span>
          <span v-if="d.location">📍 {{ d.location }}</span>
        </div>
        <p v-if="d.notes" class="date-notes">{{ d.notes }}</p>
        <div class="date-footer">
          <span class="date-by">Planifié par {{ d.createdBy }}</span>
          <span :class="['status-badge', isPast(d.scheduledAt) ? 'done' : 'upcoming']">
            {{ isPast(d.scheduledAt) ? '✅ Passé' : '⏳ À venir' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal card">
        <h3>✨ Nouveau rendez-vous</h3>
        <div class="field">
          <label class="input-label">Titre</label>
          <input v-model="form.title" class="input" placeholder="Dîner romantique" required />
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="input-label">Type</label>
            <select v-model="form.type" class="input">
              <option value="sortie">Sortie</option>
              <option value="restaurant">Restaurant</option>
              <option value="voyage">Voyage</option>
              <option value="activité">Activité</option>
              <option value="cinéma">Cinéma</option>
              <option value="surprise">Surprise</option>
            </select>
          </div>
          <div class="field">
            <label class="input-label">Date & heure</label>
            <input v-model="form.scheduledAt" type="datetime-local" class="input" />
          </div>
        </div>
        <div class="field">
          <label class="input-label">Lieu</label>
          <input v-model="form.location" class="input" placeholder="Restaurant mariotte, Haiti" />
        </div>
        <div class="field">
          <label class="input-label">Notes</label>
          <textarea v-model="form.notes" class="input" rows="3" placeholder="Réservation nécessaire..."></textarea>
        </div>
        <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
          <button class="btn btn-primary" @click="createDate" :disabled="!form.title || !form.scheduledAt">Planifier 💕</button>
          <button class="btn btn-ghost" @click="showForm = false">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'

const dates = ref([])
const showForm = ref(false)
const form = reactive({ title: '', type: 'sortie', scheduledAt: '', location: '', notes: '' })

const sortedDates = computed(() => [...dates.value].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)))

function isPast(d) { return new Date(d) < new Date() }

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function typeIcon(type) {
  const icons = { restaurant: '🍽️', voyage: '✈️', activité: '🎭', cinéma: '🎬', surprise: '🎁', sortie: '🌟' }
  return icons[type] || '📍'
}

async function loadDates() {
  try { const { data } = await axios.get('/api/dates'); dates.value = data } catch(e) {console.log(e.message)}
}

async function createDate() {
  try {
    await axios.post('/api/dates', { ...form })
    await loadDates()
    Object.assign(form, { title: '', type: 'sortie', scheduledAt: '', location: '', notes: '' })
    showForm.value = false
  } catch(e) {
    console.log(e.message)
  }
}

async function deleteDate(id) {
  await axios.delete(`/api/dates/${id}`)
  dates.value = dates.value.filter(d => d.id !== id)
}

onMounted(loadDates)
</script>

<style scoped>
.dates-list { display: flex; flex-direction: column; gap: 1rem; }
.date-card { transition: transform 0.2s; }
.date-card:hover { transform: translateY(-2px); }
.date-card.past { opacity: 0.65; }

.date-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
.date-header h3 { font-size: 1.1rem; margin-top: 0.4rem; }

.date-meta { display: flex; gap: 1.5rem; color: var(--muted); font-size: 0.88rem; margin-bottom: 0.5rem; }
.date-notes { font-size: 0.9rem; color: #555; background: #F8F8FA; padding: 0.6rem 0.9rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem; }

.date-footer { display: flex; justify-content: space-between; align-items: center; }
.date-by { font-size: 0.8rem; color: var(--muted); }

.status-badge { font-size: 0.8rem; padding: 0.25rem 0.7rem; border-radius: 50px; font-weight: 600; }
.status-badge.upcoming { background: var(--teal-light); color: #1a8f83; }
.status-badge.done { background: #F0F0F0; color: var(--muted); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
.modal { max-width: 480px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal h3 { margin-bottom: 1.25rem; }
.field { margin-bottom: 1rem; }
</style>
