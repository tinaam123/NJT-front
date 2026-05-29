import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Container, MenuItem, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Alert, Chip
} from '@mui/material'
import { getAktivneRute } from '../../api/rutaApi'
import { dodajPokusaj, getNapredak } from '../../api/pokusajApi'

const praznaForma = {
  rutaId: '',
  brPokusaja: '1',
  savladana: 'false',
  napomena: ''
}

export default function MojProfilPage() {
  const navigate = useNavigate()
  const [rute, setRute] = useState<any[]>([])
  const [napredak, setNapredak] = useState<any>(null)
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [uspeh, setUspeh] = useState('')
  const [loading, setLoading] = useState(false)

  // Izvuci clanId iz tokena — backend /auth/me vraca username, 
  // ali nam treba id pa cemo ga cuvati u localStorage pri loginu
  const clanId = localStorage.getItem('clanId')

  const ucitaj = async () => {
    try {
      const [ruteRes, napredakRes] = await Promise.all([
        getAktivneRute(),
        clanId ? getNapredak(Number(clanId)) : Promise.resolve({ data: null })
      ])
      setRute(ruteRes.data)
      setNapredak(napredakRes.data)
    } catch {
      setGreska('Greška pri učitavanju podataka.')
    }
  }

  useEffect(() => { ucitaj() }, [])

  const handleChange = (e: any) =>
    setForma(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleDodajPokusaj = async () => {
    if (!forma.rutaId) {
      setGreska('Odaberite rutu.')
      return
    }
    setLoading(true)
    setGreska('')
    setUspeh('')
    try {
      await dodajPokusaj(Number(clanId), {
        rutaId: Number(forma.rutaId),
        brPokusaja: Number(forma.brPokusaja),
        savladana: forma.savladana === 'true',
        napomena: forma.napomena || null
      })
      setUspeh('Pokušaj uspešno evidentiran!')
      setForma(praznaForma)
      ucitaj()
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Greška pri evidentiranju pokušaja.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('clanId')
    navigate('/login')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e' }}>
          Moj profil
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: 2 }}>
          Odjavi se
        </Button>
      </Box>

      {/* Forma za dodavanje pokušaja */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0d2b4e' }}>
          Evidentuj pokušaj na ruti
        </Typography>

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}
        {uspeh && <Alert severity="success" sx={{ mb: 2 }}>{uspeh}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField select label="Ruta" name="rutaId" value={forma.rutaId}
            onChange={handleChange} sx={{ minWidth: 220 }}>
            {rute.map(r => (
              <MenuItem key={r.id} value={r.id}>
                {r.naziv} — {r.kategorija} {r.tezina ? `(${r.tezina})` : ''}
              </MenuItem>
            ))}
          </TextField>

          <TextField label="Broj pokušaja" name="brPokusaja" type="number"
            value={forma.brPokusaja} onChange={handleChange} sx={{ width: 140 }} />

          <TextField select label="Savladana" name="savladana"
            value={forma.savladana} onChange={handleChange} sx={{ minWidth: 140 }}>
            <MenuItem value="true">Da ✓</MenuItem>
            <MenuItem value="false">Ne</MenuItem>
          </TextField>

          <TextField label="Napomena (opciono)" name="napomena"
            value={forma.napomena} onChange={handleChange} sx={{ minWidth: 200 }} />

          <Button variant="contained" onClick={handleDodajPokusaj} disabled={loading}
            sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, height: 56 }}>
            Dodaj pokušaj
          </Button>
        </Box>
      </Paper>

      {/* Moj napredak */}
      {napredak && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0d2b4e' }}>
            Moj napredak — ukupno pokušaja: {napredak.ukupnoPokusaja} · savladano: {napredak.ukupnoSavladano}
          </Typography>

          <TableContainer component={Paper} elevation={0}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0faf9' }}>
                <TableRow>
                  <TableCell><b>Ruta</b></TableCell>
                  <TableCell><b>Kategorija</b></TableCell>
                  <TableCell><b>Težina</b></TableCell>
                  <TableCell><b>Datum</b></TableCell>
                  <TableCell><b>Pokušaji</b></TableCell>
                  <TableCell><b>Savladana</b></TableCell>
                  <TableCell><b>Napomena</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {napredak.pokusaji?.map((p: any) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{p.nazivRute}</TableCell>
                    <TableCell>
                      <Chip label={p.kategorijaRute} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{p.tezinaRute || '—'}</TableCell>
                    <TableCell>{p.datum}</TableCell>
                    <TableCell>{p.brPokusaja}</TableCell>
                    <TableCell>
                      <Chip label={p.savladana ? 'Da ✓' : 'Ne'}
                        color={p.savladana ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>{p.napomena || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  )
}