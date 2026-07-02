import GameCanvas from './components/GameCanvas.jsx'
import { useGameSocket } from './hooks/useGameSocket.js'

export default function App() {
  const { gameState, connected, sendReset } = useGameSocket()

  return (
    <div className="app">
      <h1>SnakeIsland</h1>

      <div className="hud">
        <span>Score: {gameState?.score ?? 0}</span>
        <span className={connected ? 'status-live' : 'status-dead'}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {gameState ? (
        <GameCanvas gameState={gameState} />
      ) : (
        <p>Connecting to game server...</p>
      )}

      {gameState?.status !== 'RUNNING' && gameState && (
        <div className="overlay">
          <p>{gameState.status === 'WON' ? 'You won!' : 'Game over'}</p>
          <button onClick={sendReset}>Play again</button>
        </div>
      )}

      <p className="hint">Use arrow keys or WASD to move.</p>
    </div>
  )
}
