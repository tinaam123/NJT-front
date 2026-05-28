import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ClanListPage from './pages/clanovi/ClanListePage'
import ClanFormPage from './pages/clanovi/ClanFormPage'
import ClanProfilPage from './pages/clanovi/ClanProfilPage'
import DodajClanarinu from './pages/clanovi/DodajClanarinu'
import DodeliTreneraPage from './pages/clanovi/DodeliTrenera'
import EvidentirajUlazakPage from './pages/posete/EvidentirajUlazakPage'
import IstorijaPosetaPage from './pages/posete/IstorijaPosetePage'
import NapredakPage from './pages/pokusaji/NapredakPage'
import RuteListPage from './pages/rute/RuteListPage'
import RutaFormPage from './pages/rute/RutaFormPage'
import TreneriListPage from './pages/treneri/TrenerFormPage'
import TrenerFormPage from './pages/treneri/TrenerListPage'
import IzvestajPage from './pages/izvestaji/IstekleClanarineePage'
import IstekleClanarineePage from './pages/izvestaji/IzvestajPage'

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clanovi" element={<ClanListPage />} />
        <Route path="/clanovi/novi" element={<ClanFormPage />} />
        <Route path="/clanovi/:id" element={<ClanProfilPage />} />
        <Route path="/clanovi/:id/izmeni" element={<ClanFormPage />} />
        <Route path="/clanovi/:id/clanarina" element={<DodajClanarinu />} />
        <Route path="/clanovi/:id/trener" element={<DodeliTreneraPage />} />
        <Route path="/clanovi/:id/ulazak" element={<EvidentirajUlazakPage />} />
        <Route path="/clanovi/:id/posete" element={<IstorijaPosetaPage />} />
        <Route path="/clanovi/:id/napredak" element={<NapredakPage />} />
        <Route path="/rute" element={<RuteListPage />} />
        <Route path="/rute/nova" element={<RutaFormPage />} />
        <Route path="/rute/:id/izmeni" element={<RutaFormPage />} />
        <Route path="/treneri" element={<TreneriListPage />} />
        <Route path="/treneri/novi" element={<TrenerFormPage />} />
        <Route path="/treneri/:id/izmeni" element={<TrenerFormPage />} />
        <Route path="/izvestaji" element={<IzvestajPage />} />
        <Route path="/clanarine/istekle" element={<IstekleClanarineePage />} />
      </Routes>
    </div>
  )
}

export default App