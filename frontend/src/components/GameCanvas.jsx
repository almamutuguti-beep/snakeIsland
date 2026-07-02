import { useEffect, useRef } from 'react'

const CELL_SIZE = 24

const COLORS = {
  background: '#0f172a',
  gridLine: '#1e293b',
  snakeHead: '#4ade80',
  snakeBody: '#22c55e',
  food: '#f97316',
}

export default function GameCanvas({ gameState }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState) return
    const ctx = canvas.getContext('2d')

    const { board_width, board_height, snake_body, food_position } = gameState

    canvas.width = board_width * CELL_SIZE
    canvas.height = board_height * CELL_SIZE

    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = COLORS.gridLine
    ctx.lineWidth = 1
    for (let x = 0; x <= board_width; x++) {
      ctx.beginPath()
      ctx.moveTo(x * CELL_SIZE, 0)
      ctx.lineTo(x * CELL_SIZE, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= board_height; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * CELL_SIZE)
      ctx.lineTo(canvas.width, y * CELL_SIZE)
      ctx.stroke()
    }

    const [fx, fy] = food_position
    ctx.fillStyle = COLORS.food
    ctx.beginPath()
    ctx.arc(
      fx * CELL_SIZE + CELL_SIZE / 2,
      fy * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2.5,
      0,
      Math.PI * 2
    )
    ctx.fill()

    snake_body.forEach(([x, y], i) => {
      ctx.fillStyle = i === 0 ? COLORS.snakeHead : COLORS.snakeBody
      const pad = i === 0 ? 1 : 2
      ctx.fillRect(
        x * CELL_SIZE + pad,
        y * CELL_SIZE + pad,
        CELL_SIZE - pad * 2,
        CELL_SIZE - pad * 2
      )
    })
  }, [gameState])

  return <canvas ref={canvasRef} className="game-canvas" />
}
