import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ClanListPage from './pages/clanovi/ClanListePage'
import ClanFormPage from './pages/clanovi/ClanFormPage'
import ClanProfilPage from './pages/clanovi/ClanProfilPage'
import DodajClanarinu from './pages/clanovi/DodajClanarinu'
import DodeliTreneraPage from './pages/clanovi/DodeliTrenera'
import DodajNalogClanPage from './pages/clanovi/DodajNalogClanPage'
import EvidentirajUlazakPage from './pages/posete/EvidentirajUlazakPage'
import IstorijaPosetaPage from './pages/posete/IstorijaPosetePage'
import NapredakPage from './pages/pokusaji/NapredakPage'
import RuteListPage from './pages/rute/RuteListPage'
import RutaFormPage from './pages/rute/RutaFormPage'
import TreneriListPage from './pages/treneri/TrenerListPage'
import TrenerFormPage from './pages/treneri/TrenerFormPage'
import IzvestajPage from './pages/izvestaji/IzvestajPage'
import IstekleClanarineePage from './pages/izvestaji/IstekleClanarineePage'
import MojProfilPage from './pages/clan/MojProfilPage'

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
)

function App() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {token && role !== 'CLAN' && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Protected><HomePage /></Protected>} />
        <Route path="/clanovi" element={<Protected><ClanListPage /></Protected>} />
        <Route path="/clanovi/novi" element={<Protected><ClanFormPage /></Protected>} />
        <Route path="/clanovi/:id" element={<Protected><ClanProfilPage /></Protected>} />
        <Route path="/clanovi/:id/izmeni" element={<Protected><ClanFormPage /></Protected>} />
        <Route path="/clanovi/:id/clanarina" element={<Protected><DodajClanarinu /></Protected>} />
        <Route path="/clanovi/:id/trener" element={<Protected><DodeliTreneraPage /></Protected>} />
        <Route path="/clanovi/:id/nalog" element={<Protected><DodajNalogClanPage /></Protected>} />
        <Route path="/clanovi/:id/ulazak" element={<Protected><EvidentirajUlazakPage /></Protected>} />
        <Route path="/clanovi/:id/posete" element={<Protected><IstorijaPosetaPage /></Protected>} />
        <Route path="/clanovi/:id/napredak" element={<Protected><NapredakPage /></Protected>} />
        <Route path="/rute" element={<Protected><RuteListPage /></Protected>} />
        <Route path="/rute/nova" element={<Protected><RutaFormPage /></Protected>} />
        <Route path="/rute/:id/izmeni" element={<Protected><RutaFormPage /></Protected>} />
        <Route path="/treneri" element={<Protected><TreneriListPage /></Protected>} />
        <Route path="/treneri/novi" element={<Protected><TrenerFormPage /></Protected>} />
        <Route path="/treneri/:id/izmeni" element={<Protected><TrenerFormPage /></Protected>} />
        <Route path="/izvestaji" element={<Protected><IzvestajPage /></Protected>} />
        <Route path="/clanarine/istekle" element={<Protected><IstekleClanarineePage /></Protected>} />
        <Route path="/moj-profil" element={<Protected><MojProfilPage /></Protected>} />
      </Routes>
    </div>
  )
}

export default App