import './Credits.css'

interface CreditsProps {
  onBack: () => void
}

export function Credits({ onBack }: CreditsProps) {
  return (
    <div className="credits">
      <div className="credits-content">
        <h1 className="credits-title">Crédits</h1>
        
        <div className="credits-sections">
          <div className="credits-section">
            <h2>Développement</h2>
            <p>LUCAS LE BG</p>
            <p>Cours CESI - MAALSI</p>
            <p>Three.js & React Three Fiber</p>
          </div>
          
          <div className="credits-section">
            <h2>Modèles 3D</h2>
            <p>Kenney.nl - Toy Car Pack</p>
            <p>Modèles sous licence Creative Commons</p>
            <p>Site web: kenney.nl</p>
          </div>
          
          <div className="credits-section">
            <h2>Technologies</h2>
            <ul>
              <li>React Three Fiber</li>
              <li>Three.js</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>React</li>
            </ul>
          </div>
          
          <div className="credits-section">
            <h2>Remerciements</h2>
            <p>Merci à la communauté a PACO pour la photo</p>
            <p>Merci au prof</p>
            <p>Merci maman</p>
          </div>
        </div>
        
        <button className="back-button" onClick={onBack}>
          <span className="button-icon">🏠</span>
          Retour au menu
        </button>
      </div>
    </div>
  )
}
