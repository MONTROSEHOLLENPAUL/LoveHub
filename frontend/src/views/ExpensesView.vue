<template>
  <div class="fade-up">
    <div class="page-header">
      <h1><i class="bi bi-cash-coin"></i> Dépenses partagées</h1>
      <p>Suivez vos finances en couple</p>
    </div>

    <!-- Summary -->
    <div class="grid-3" style="margin-bottom:1.5rem">
      <div class="stat-card">
        <div class="stat-value">{{ formatHTG(totalAmount) }}</div>
        <div class="stat-label">Total dépensé</div>
      </div>
      <div class="stat-card teal">
        <div class="stat-value">{{ formatHTG(myTotal) }}</div>
        <div class="stat-label">Ma part ({{ auth.user?.name }})</div>
      </div>
      <div class="stat-card dark">
        <div class="stat-value">{{ formatHTG(partnerTotal) }}</div>
        <div class="stat-label">Part de {{ auth.partner?.name || 'Partenaire' }}</div>
      </div>
    </div>

    <div style="display:flex;gap:1rem;margin-bottom:1.5rem">
      <button class="btn btn-primary" @click="showForm = true">+ Ajouter une dépense</button>
    </div>

    <div v-if="expenses.length === 0" class="empty-state card">
      <div class="emoji"><i class="bi bi-cash"></i></div>
      <p>Aucune dépense enregistrée pour l'instant</p>
    </div>

    <div v-else class="card">
      <div v-for="e in expenses" :key="e.id" class="expense-item">
        <div class="expense-icon">{{ categoryIcon(e.category) }}</div>
        <div class="expense-info">
          <strong>{{ e.title }}</strong>
          <p class="expense-meta">{{ e.category }} · Payé par {{ e.paidByName }} · {{ formatDate(e.createdAt) }}</p>
        </div>
        <div class="expense-amount">{{ formatHTG(e.amount) }}</div>
        <button class="btn btn-ghost btn-sm" @click="deleteExpense(e.id)">🗑</button>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal card">
        <h3><i class="bi bi-cash-coin"></i> Nouvelle dépense</h3>
        <div class="field">
          <label class="input-label">Description</label>
          <input v-model="form.title" class="input" placeholder="Dîner au restaurant" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="input-label">Montant (HTG)</label>
            <input v-model="form.amount" type="number" class="input" placeholder="1500" />
          </div>
          <div class="field">
            <label class="input-label">Catégorie</label>
            <select v-model="form.category" class="input">
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="voyage">✈️ Voyage</option>
              <option value="loisirs">🎭 Loisirs</option>
              <option value="cadeaux">🎁 Cadeaux</option>
              <option value="logement">🏠 Logement</option>
              <option value="autre">📦 Autre</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
          <button class="btn btn-primary" @click="createExpense" :disabled="!form.title || !form.amount">Enregistrer</button>
          <button class="btn btn-ghost" @click="showForm = false">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const expenses = ref([])
const showForm = ref(false)
const form = reactive({ title: '', amount: '', category: 'restaurant' })

const totalAmount = computed(() => expenses.value.reduce((s, e) => s + e.amount, 0))
const myTotal = computed(() => expenses.value.filter(e => e.paidBy === auth.user?.id).reduce((s, e) => s + e.amount, 0))
const partnerTotal = computed(() => totalAmount.value - myTotal.value)

function formatHTG(n) { return `${n.toLocaleString('fr-FR')} HTG` }
function formatDate(d) { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }
function categoryIcon(c) {
  const icons = { restaurant: '🍽️', voyage: '✈️', loisirs: '🎭', cadeaux: '🎁', logement: '🏠', autre: '📦' }
  return icons[c] || '💰'
}

async function loadExpenses() {
  try { const { data } = await axios.get('/api/expenses'); expenses.value = data } catch {}
}

async function createExpense() {
  try {
    await axios.post('/api/expenses', { ...form, amount: parseFloat(form.amount) })
    await loadExpenses()
    Object.assign(form, { title: '', amount: '', category: 'restaurant' })
    showForm.value = false
  } catch {}
}

async function deleteExpense(id) {
  await axios.delete(`/api/expenses/${id}`)
  expenses.value = expenses.value.filter(e => e.id !== id)
}

onMounted(() => { auth.fetchCouple(); loadExpenses() })
</script>

<style scoped>
.expense-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #F5F5F5;
}
.expense-item:last-child { border-bottom: none; }
.expense-icon { font-size: 1.5rem; }
.expense-info { flex: 1; }
.expense-info strong { font-size: 0.95rem; }
.expense-meta { font-size: 0.8rem; color: var(--muted); margin-top: 0.2rem; }
.expense-amount { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--rose-dark); font-weight: 700; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
.modal { max-width: 420px; width: 100%; }
.modal h3 { margin-bottom: 1.25rem; }
.field { margin-bottom: 1rem; }
</style>
