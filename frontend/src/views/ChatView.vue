<template>
  <div class="chat-layout fade-up">
    <div class="chat-header">
      <div class="chat-partner">
        <div class="avatar">{{ auth.partner?.name?.[0] || '?' }}</div>
        <div>
          <h2>{{ auth.partner?.name || 'Partenaire' }}</h2>
          <p class="online">{{(onlinePart == true)? "● En ligne" :"● Hors ligne"}}</p>
        </div>
      </div>
    </div>

    <div class="messages-area" ref="messagesEl">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="emoji"><i class="bi bi-envelope-heart-fill"></i></div>
        <p>Envoyez votre premier message à {{ auth.partner?.name }}</p>
      </div>
      <div v-for="msg in messages" :key="msg.id"
        :class="['message', { mine: msg.senderId === auth.user?.id }]">
        <div class="bubble">
          <p>{{ msg.content }}</p>
          <span class="time">{{ formatTime(msg.createdAt) }}</span>
        </div>
      </div>
    </div>

   <div :class="['viewAllEmojis', { 'actived': actived }]">
    <div class="Emojis">
    <span class="emoji-btn" v-for="e in quickEmojis" :key="e" @click="sendEmoji(e)">{{ e }}</span>
    </div>
   </div>

    <div class="chat-input-bar">
      <div class="input-row">
        <button class="" @click="actived = !actived"><i class="bi bi-emoji-smile"></i></button>
        <input v-model="newMsg" class="input chat-input" placeholder="Écrivez un message..." @keyup.enter="send" />
        <button class="btn btn-primary send-btn" @click="send" :disabled="!newMsg.trim()">
          ➤
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const messages = ref([])
const newMsg = ref('')
const messagesEl = ref(null)
const quickEmojis = ['❤️', '😘', '🥰', '💋', '😍', '💕', '🌹', '✨','🤩', '🤭', '🥱', '🙈','😝', '😜', '😔', '💃','🕺', '🧎', '🙏', '💍','💤', '👫', '👪', '💑']
const onlinePart = (auth)? true : false;
const actived = ref(false);

console.log(auth);

function formatTime(d) {
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

async function loadMessages() {
  try {
    const { data } = await axios.get('/api/messages')
    messages.value = data
    await nextTick()
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  } catch(e) {
    console.log(e.message)
  }
}

async function send() {
  if (!newMsg.value.trim()) return
  try {
    const { data } = await axios.post('/api/messages', { content: newMsg.value })
    messages.value.push(data)
    newMsg.value = ''
    await nextTick()
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  } catch(e) {
    console.log(e.message);
  }
}

async function sendEmoji(emoji) {
  try {
    const { data } = await axios.post('/api/messages', { content: emoji, type: 'emoji' })
    messages.value.push(data)
    await nextTick()
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  } catch(e) {
    console.log(e.message)
  }
}

onMounted(() => {
  auth.fetchCouple()
  loadMessages()
  setInterval(loadMessages, 5000)
})
</script>
<style scoped>
.chat-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 5rem);
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.chat-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #F0F0F0;
  background: white;
}

.chat-partner { display: flex; align-items: center; gap: 0.75rem; }

.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rose), var(--rose-dark));
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  font-family: 'Playfair Display', serif;
}

.chat-partner h2 { font-size: 1rem; font-family: 'DM Sans', sans-serif; }
.online { font-size: 0.78rem; color: #4caf50; }

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background: linear-gradient(180deg, #fdf8f5 0%, #fff 100%);
}

.message { display: flex; }
.message.mine { justify-content: flex-end; }

.bubble {
  max-width: 70%;
  padding: 0.75rem 1.1rem;
  border-radius: 18px;
  background: #F0F0F5;
  position: relative;
}

.message.mine .bubble {
  background: linear-gradient(135deg, var(--rose), var(--rose-dark));
  color: white;
  border-bottom-right-radius: 4px;
}

.message:not(.mine) .bubble { border-bottom-left-radius: 4px; }

.bubble p { font-size: 0.95rem; line-height: 1.5; }
.time { font-size: 0.72rem; opacity: 0.65; margin-top: 0.25rem; display: block; }

.chat-input-bar {
  padding: 0.45rem;
  border-top: 1px solid #F0F0F0;
  background: white;
}

.viewAllEmojis {
    background: var(--rose-light);
    /* width: 100%; */
    height: 0px;
    border-radius: 6px 6px 0px 0px;
    margin: 0 8px;
    transition: .3s height ease-in-out;
}

.viewAllEmojis.actived{
height: 115px;
transition: .3s height ease-in-out;
}

.viewAllEmojis .Emojis {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    justify-items: center;
    align-items: center;
    padding: 2px;
    color: black;
}

.emoji-row {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  transition: transform 0.2s;
}
.emoji-btn:hover { transform: scale(1.3); background: #F5F5F5; }

.input-row input{
  border:none;
  outline:none;
}

.input-row button{
  background:none;
  border:none;
    font-size: 1.35rem;
    cursor: pointer;
    color: #0000009c;
}

.input-row { 
  display: flex; 
  gap: 0.75rem;
  border: 2px solid #EEE;
  border-radius: var(--radius-sm);
    padding: 0 0.3rem;
    align-items: center; 
}
.chat-input { 
  border-radius: 50px; 
}
.send-btn { 
  border-radius: 50px; 
  padding: 0rem 0.25rem;
}
</style>
