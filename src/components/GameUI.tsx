import { useState, useEffect } from 'react'

interface GameState {
  score: number
  speed: number
  difficulty: number
  isGameOver: boolean
  isPaused: boolean
  distance: number
}

interface GameUIProps {
  gameState: GameState
  onRestart: () => void
  onPause: () => void
  onResume: () => void
  onBackToMenu: () => void
}

export function GameUI({ gameState, onRestart, onPause, onResume, onBackToMenu }: GameUIProps) {
  const [showInstructions, setShowInstructions] = useState(true)
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ': // Espace pour pause/reprendre
          event.preventDefault()
          if (gameState.isGameOver) return
          if (gameState.isPaused) {
            onResume()
          } else {
            onPause()
          }
          break
        case 'r':
        case 'R':
          if (gameState.isGameOver) {
            onRestart()
          }
          break
        case 'Enter':
          if (showInstructions) {
            setShowInstructions(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, onRestart, onPause, onResume, showInstructions])

  if (showInstructions) {
    return (
      <div className="game-ui instructions">
        <div className="instructions-panel">
          <h1>🏎️ Course d'Évitement</h1>
          <div className="instructions-content">
            <h2>Comment jouer :</h2>
            <ul>
              <li>🡸 🡺 ou A/D : Déplacer la voiture</li>
              <li>Espace : Pause/Reprendre</li>
              <li>Évitez les autres véhicules !</li>
            </ul>
            <h2>Objectif :</h2>
            <p>Roulez le plus longtemps possible sans collision.<br/>
            La vitesse et la difficulté augmentent progressivement.</p>
          </div>
          <button 
            className="start-button"
            onClick={() => setShowInstructions(false)}
          >
            Appuyez sur ENTRÉE pour commencer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-ui">
      {/* HUD en jeu */}
      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">Score:</span>
          <span className="hud-value">{gameState.score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Distance:</span>
          <span className="hud-value">{Math.floor(gameState.distance)}m</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Vitesse:</span>
          <span className="hud-value">{Math.floor(gameState.speed * 10)} km/h</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Niveau:</span>
          <span className="hud-value">{Math.floor(gameState.difficulty) + 1}</span>
        </div>
      </div>

      {/* Écran de pause */}
      {gameState.isPaused && !gameState.isGameOver && (
        <div className="pause-screen">
          <div className="pause-panel">
            <h2>⏸️ Jeu en Pause</h2>
            <p>Appuyez sur ESPACE pour reprendre</p>
          </div>
        </div>
      )}

      {/* Écran de game over */}
      {gameState.isGameOver && (
        <div className="game-over-screen">
          <div className="game-over-panel">
            <h2>💥 Game Over!</h2>
            <div className="final-stats">
              <p>Score final: <strong>{gameState.score}</strong></p>
              <p>Distance parcourue: <strong>{Math.floor(gameState.distance)}m</strong></p>
              <p>Vitesse max: <strong>{Math.floor(gameState.speed * 10)} km/h</strong></p>
            </div>
            <button 
              className="restart-button"
              onClick={onRestart}
            >
              Appuyez sur R pour rejouer
            </button>
            <button 
              className="menu-button"
              onClick={onBackToMenu}
            >
              Retour au menu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
