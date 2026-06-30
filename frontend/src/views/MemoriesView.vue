<template>
  <div class="fade-up">
    <div class="page-header">
      <h1><i class="bi bi-camera"></i> Journal de souvenirs</h1>
      <p>Vos moments précieux ensemble</p>
    </div>

    <div style="margin-bottom:1.5rem">
      <button class="btn btn-primary" @click="showForm = true">+ Ajouter un souvenir</button>
    </div>

    <div v-if="memories.length === 0" class="empty-state card">
      <div class="emoji"><i class="bi bi-book-half"></i></div>
      <p>Votre journal est vide — commencez à capturer vos moments ensemble</p>
    </div>

    <div v-else class="memories-grid">
      <div v-for="m in memories" :key="m.id" class="memory-card card">
        <div class="memory-emoji">{{ m.emoji }}</div>
        <div class="memory-content">
          <div class="memory-date">{{ formatDate(m.date) }}</div>
          <h3>{{ m.title }}</h3>
          <p v-if="m.note" class="memory-note">{{ m.note }}</p>
          <div class="memory-footer">
            <span class="memory-by">Par {{ m.createdBy }}</span>
            <button class="btn btn-ghost btn-sm" @click="deleteMemory(m.id)" style="padding:0.3rem 0.6rem;font-size:0.8rem">🗑</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal card">
        <h3>✨ Nouveau souvenir</h3>
        <div class="field">
          <label class="input-label">Emoji du moment</label>
          <div class="emoji-picker">
            <button v-for="e in emojis" :key="e" :class="['ep-btn', { selected: form.emoji === e }]" @click="form.emoji = e">{{ e }}</button>
          </div>
        </div>
        <div class="field">
          <label class="input-label">Titre</label>
          <input v-model="form.title" class="input" placeholder="Notre premier voyage..." />
        </div>
        <div class="field">
          <label class="input-label">Date</label>
          <input v-model="form.date" type="date" class="input" />
        </div>
        <div class="field">
          <label class="input-label">DESCRIPTION</label>
          <textarea v-model="form.note" class="input" rows="3" placeholder="Ce moment était magique parce que..."></textarea>
        </div>
        <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
          <button class="btn btn-primary" @click="createMemory" :disabled="!form.title">Sauvegarder 💕</button>
          <button class="btn btn-ghost" @click="showForm = false">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const memories = ref([])
const showForm = ref(false)
const emojis = ['💕', '🌹', '✈️', '🎉', '🍽️', '🌅', '🎭', '💍', '🏖️', '🎁', '🌙', '⭐']
const form = reactive({ title: '', note: '', date: new Date().toISOString().slice(0, 10), emoji: '💕' })

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function loadMemories() {
  try { const { data } = await axios.get('/api/memories'); memories.value = data } catch {}
}

async function createMemory() {
  try {
    await axios.post('/api/memories', { ...form })
    await loadMemories()
    Object.assign(form, { title: '', note: '', date: new Date().toISOString().slice(0, 10), emoji: '💕' })
    showForm.value = false
  } catch {}
}

async function deleteMemory(id) {
  await axios.delete(`/api/memories/${id}`)
  memories.value = memories.value.filter(m => m.id !== id)
}

onMounted(() => { auth.fetchCouple(); loadMemories() })
</script>

<style scoped>
.memories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }

.memory-card {
  display: flex;
  gap: 1rem;
  transition: transform 0.2s;
  border-left: 4px solid var(--rose);
}
.memory-card:hover { transform: translateY(-3px); }

.memory-emoji { font-size: 2rem; flex-shrink: 0; }
.memory-content { flex: 1; }
.memory-date { font-size: 0.78rem; color: var(--muted); margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
.memory-content h3 { font-size: 1rem; margin-bottom: 0.4rem; }
.memory-note { font-size: 0.88rem; color: #555; line-height: 1.5; margin-bottom: 0.5rem; }
.memory-footer { display: flex; justify-content: space-between; align-items: center; }
.memory-by { font-size: 0.78rem; color: var(--muted); }

.emoji-picker { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.ep-btn {
  background: #F5F5F5;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 1.3rem;
  width: 42px; height: 42px;
  cursor: pointer;
  transition: all 0.15s;
}
.ep-btn.selected { border-color: var(--rose); background: var(--rose-light); }
.ep-btn:hover { transform: scale(1.15); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
.modal { max-width: 460px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal h3 { margin-bottom: 1.25rem; }
.field { margin-bottom: 1rem; }
</style>
