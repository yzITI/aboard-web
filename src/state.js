import { reactive } from 'vue'

export const state = reactive({
  user: {},
  block: {},
  children: {}
})

export default state

const ws = new WebSocket(`ws://localhost:8080`)
ws.json = (N, ...A) => ws.send(JSON.stringify({ N, A }))

export function auth (jwt) {
  const sendAuth = () => ws.json('auth', jwt)
  if (ws.readyState === 1) return sendAuth()
  ws.onopen = sendAuth
}

ws.onmessage = e => {
  const data = JSON.parse(e.data), N = data.N, A = data.A || []
  console.log(N)
  if (N === 'auth') {
    window.location.href = 'http://localhost:3000/#/'
  }
  if (N === 'block.one' && state.block._id == A[0]) state.block = A[1]
  if (N === 'block.children' && state.block._id == A[0]) {
    for (const id in A[1]) state.children[id] = A[1][id]
  }
  if (N === 'block.removeChildren' && state.block._id == A[0]) {
    for (const id in A[1]) delete state.children[id]
  }
}

export const send = ws.json