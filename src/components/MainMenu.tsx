import './MainMenu.css'
import accueilImage from '../assets/accueil.jpg'

interface MainMenuProps {
  onPlay: () => void
  onCredits: () => void
}

export function MainMenu({ onPlay, onCredits }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="menu-background">
        <img src={accueilImage} alt="Background" className="background-image" />
        <div className="background-overlay"></div>
      </div>
      <div className="menu-content">
        <h1 className="game-title">VroumVroum Racing</h1>
        <div className="menu-buttons">
          <button className="menu-button play-button" onClick={onPlay}>
            <span className="button-icon">🏁</span>
            Jouer
          </button>
          <button className="menu-button credits-button" onClick={onCredits}>
            <span className="button-icon">🏆</span>
            Crédits
          </button>
        </div>
        <div className="menu-footer">
          <p>Utilisez les flèches ou WASD pour conduire</p>
        </div>
      </div>
    </div>
  )
}
