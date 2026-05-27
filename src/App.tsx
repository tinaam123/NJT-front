import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ClanListPage from './pages/clanovi/ClanListePage.tsx'
import ClanFormPage from './pages/clanovi/ClanFormPage'
import ClanProfilPage from './pages/clanovi/ClanProfilPage'
import DodajClanarinu from './pages/clanovi/DodajClanarinu.tsx'
import DodeliTreneraPage from './pages/clanovi/DodeliTrenera.tsx'
import EvidentirajUlazakPage from './pages/posete/EvidentirajUlazakPage.tsx'
import IstorijaPosetaPage from './pages/posete/IstorijaPosetePage.tsx'
import NapredakPage from './pages/pokusaji/NapredakPage.tsx'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/clanovi" />} />
        <Route path="/clanovi" element={<ClanListPage />} />
        <Route path="/clanovi/novi" element={<ClanFormPage />} />
        <Route path="/clanovi/:id" element={<ClanProfilPage />} />
        <Route path="/clanovi/:id/izmeni" element={<ClanFormPage />} />
        <Route path="/clanovi/:id/clanarina" element={<DodajClanarinu />} />
        <Route path="/clanovi/:id/trener" element={<DodeliTreneraPage />} />
        <Route path="/clanovi/:id/ulazak" element={<EvidentirajUlazakPage />} />
        <Route path="/clanovi/:id/posete" element={<IstorijaPosetaPage />} />
        <Route path="/clanovi/:id/napredak" element={<NapredakPage />} />
      </Routes>
    </>
  )
}

export default App