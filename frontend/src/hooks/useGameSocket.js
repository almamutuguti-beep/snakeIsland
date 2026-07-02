import { useEffect, useRef, useState } from 'react'

const WS_URL = 'ws://localhost:8000/ws/game'

const KEY_TO_DIRECTION = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
}

export function useGameSocket() {
  const [gameState, setGameState] = useState(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = new WebSocket(WS_URL)
    socketRef.current = socket

    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'state') {
        setGameState(msg)
      }
    }

    return () => socket.close()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      const direction = KEY_TO_DIRECTION[e.key]
      if (!direction) return
      e.preventDefault()
      const socket = socketRef.current
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'direction', value: direction }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function sendReset() {
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'reset' }))
    }
  }

  return { gameState, connected, sendReset }
}
