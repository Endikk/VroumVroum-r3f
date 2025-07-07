# VroumVroum-r3f

## Description
VroumVroum-r3f is a 3D racing game built using React, TypeScript, and Three.js. The project leverages Vite for fast development and includes a variety of assets and components to create an engaging gaming experience.

## 🚀 GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages. 

### Automatic Deployment
- Every push to the `main` branch triggers an automatic deployment
- The site will be available at: `https://yourusername.github.io/VroumVroum-r3f/`

### Manual Deployment
To deploy manually, you can also use:
```bash
npm run deploy
```

### Setup Instructions for GitHub Pages
1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"
4. Push your changes to the `main` branch
5. The deployment will start automatically

## Features
- **React + TypeScript**: Modern web development with type safety.
- **Three.js**: 3D rendering for immersive gameplay.
- **Vite**: Fast development server and build tool.
- **Custom Components**: Includes components for player and opponent cars, roads, and game UI.
- **Reusable Assets**: A rich collection of 3D models and textures for tracks, items, and more.

## Project Structure
```
public/
  model/
    Toy Car/
      Models/
      Previews/
src/
  assets/
  components/
  hooks/
  types/
```

## Getting Started

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd VroumVroum-r3f
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Building for Production
Build the project for production:
```bash
npm run build
# or
yarn build
```

### Previewing the Production Build
Preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

## License
This project uses assets from the Toy Car model pack by Kenney. Refer to the `License.txt` file in the `public/model/Toy Car` directory for more details.
