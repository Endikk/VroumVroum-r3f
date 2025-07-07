import './ProfessionalGameUI.css'

interface ProfessionalGameUIProps {
  speed?: number
  lapCount?: number
  isOffTrack?: boolean
  bestLapTime?: number
  currentLapTime?: number
  collisionCount?: number
  rpm?: number
  gear?: number
  enginePower?: number
  position?: number
  totalRacers?: number
}

export default function ProfessionalGameUI({ 
  speed = 0, 
  lapCount = 0, 
  isOffTrack = false,
  bestLapTime,
  currentLapTime,
  collisionCount = 0,
  rpm = 0,
  gear = 1,
  enginePower = 0,
  position = 1,
  totalRacers = 1
}: ProfessionalGameUIProps) {
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = (timeInSeconds % 60).toFixed(3)
    return `${minutes}:${seconds.padStart(6, '0')}`
  }

  const getSpeedColor = () => {
    if (speed < 50) return '#00ff00'
    if (speed < 150) return '#ffff00'
    if (speed < 250) return '#ff8800'
    return '#ff0000'
  }

  const getRPMColor = () => {
    const rpmPercentage = (rpm / 15000) * 100
    if (rpmPercentage < 60) return '#00ff00'
    if (rpmPercentage < 80) return '#ffff00'
    if (rpmPercentage < 95) return '#ff8800'
    return '#ff0000'
  }
  
  return (
    <div className="professional-game-ui">
      {/* Tableau de bord principal F1 */}
      <div className="f1-dashboard">
        <div className="main-display">
          {/* Compteur de vitesse digital */}
          <div className="speed-display" style={{ color: getSpeedColor() }}>
            <div className="speed-value">{Math.round(speed)}</div>
            <div className="speed-unit">KM/H</div>
          </div>
          
          {/* Compte-tours */}
          <div className="rpm-display">
            <div className="rpm-gauge">
              <div className="rpm-bar" style={{ 
                width: `${Math.min((rpm / 15000) * 100, 100)}%`,
                backgroundColor: getRPMColor()
              }}></div>
            </div>
            <div className="rpm-value" style={{ color: getRPMColor() }}>
              {Math.round(rpm)} RPM
            </div>
          </div>
          
          {/* Indicateur de vitesse */}
          <div className="gear-display">
            <div className="gear-label">GEAR</div>
            <div className="gear-value">{gear}</div>
          </div>
        </div>

        {/* Barre de puissance moteur */}
        <div className="engine-power">
          <div className="power-label">POWER</div>
          <div className="power-bar">
            <div 
              className="power-fill" 
              style={{ 
                width: `${enginePower}%`,
                backgroundColor: enginePower > 85 ? '#ff0000' : '#00ff00'
              }}
            ></div>
          </div>
          <div className="power-value">{Math.round(enginePower)}%</div>
        </div>
      </div>

      {/* Informations de course */}
      <div className="race-telemetry">
        <div className="position-display">
          <div className="position-value">{position}</div>
          <div className="position-total">/{totalRacers}</div>
        </div>
        
        <div className="lap-timing">
          <div className="timing-item">
            <span className="label">LAP</span>
            <span className="value">{lapCount}</span>
          </div>
          
          {currentLapTime && (
            <div className="timing-item current">
              <span className="label">CURRENT</span>
              <span className="value">{formatTime(currentLapTime)}</span>
            </div>
          )}
          
          {bestLapTime && (
            <div className="timing-item best">
              <span className="label">BEST</span>
              <span className="value">{formatTime(bestLapTime)}</span>
            </div>
          )}
        </div>

        {/* Indicateurs d'état */}
        <div className="status-indicators">
          {isOffTrack && (
            <div className="status-warning off-track">
              <span className="icon">⚠️</span>
              <span>OFF TRACK</span>
            </div>
          )}
          
          {collisionCount > 0 && (
            <div className="status-info damage">
              <span className="icon">💥</span>
              <span>DAMAGE: {collisionCount}</span>
            </div>
          )}
          
          {speed > 200 && (
            <div className="status-info high-speed">
              <span className="icon">🚀</span>
              <span>HIGH SPEED</span>
            </div>
          )}
        </div>
      </div>

      {/* Mini-carte du circuit (placeholder) */}
      <div className="track-map">
        <div className="map-title">CIRCUIT MAP</div>
        <div className="map-display">
          <div className="track-outline">
            <div className="car-position" style={{
              left: `${20 + (lapCount * 10) % 60}%`,
              top: `${30 + Math.sin(Date.now() * 0.001) * 20}%`
            }}></div>
          </div>
        </div>
      </div>

      {/* Contrôles et aide */}
      <div className="controls-help">
        <div className="controls-title">CONTROLS</div>
        <div className="control-grid">
          <div className="control-item">
            <kbd>W/↑</kbd><span>Accelerate</span>
          </div>
          <div className="control-item">
            <kbd>S/↓</kbd><span>Brake/Reverse</span>
          </div>
          <div className="control-item">
            <kbd>A/←</kbd><span>Turn Left</span>
          </div>
          <div className="control-item">
            <kbd>D/→</kbd><span>Turn Right</span>
          </div>
          <div className="control-item">
            <kbd>SPACE</kbd><span>Emergency Brake</span>
          </div>
          <div className="control-item">
            <kbd>SHIFT</kbd><span>DRS/Boost</span>
          </div>
        </div>
      </div>

      {/* Données de télémétrie */}
      <div className="telemetry-data">
        <div className="telemetry-title">TELEMETRY</div>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">Speed</span>
            <span className="data-value">{speed.toFixed(1)} km/h</span>
          </div>
          <div className="data-item">
            <span className="data-label">RPM</span>
            <span className="data-value">{rpm.toFixed(0)}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Gear</span>
            <span className="data-value">{gear}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Power</span>
            <span className="data-value">{enginePower.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
