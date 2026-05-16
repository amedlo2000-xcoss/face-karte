import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import KartePage from './pages/KartePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/karte" element={<KartePage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
