import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Container, Divider, MenuItem, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Alert, Chip
} from '@mui/material'
import { getAktivneRute } from '../../api/rutaApi'
import { dodajPokusaj, getNapredak } from '../../api/pokusajApi'
import { getClan } from '../../api/clanApi'

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
  const [clan, setClan] = useState<any>(null)
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [uspeh, setUspeh] = useState('')
  const [loading, setLoading] = useState(false)

  const clanId = localStorage.getItem('clanId')

  const ucitaj = async () => {
    try {
      const [ruteRes, napredakRes, clanRes] = await Promise.all([
        getAktivneRute(),
        clanId ? getNapredak(Number(clanId)) : Promise.resolve({ data: null }),
        clanId ? getClan(Number(clanId)) : Promise.resolve({ data: null })
      ])
      setRute(ruteRes.data)
      setNapredak(napredakRes.data)
      setClan(clanRes.data)
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
          {clan ? `${clan.ime} ${clan.prezime}` : 'Moj profil'}
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: 2 }}>
          Odjavi se
        </Button>
      </Box>

      {/* Informacije o treneru */}
      {clan && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0d2b4e' }}>
            Moj trener
          </Typography>
          {clan.trenerImePrezime ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label={clan.trenerImePrezime} color="primary" sx={{ fontSize: 14, px: 1 }} />
              <Typography variant="body2" sx={{ color: '#555' }}>
                Dodeljen trener
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label="Bez trenera" variant="outlined" />
              <Typography variant="body2" sx={{ color: '#888' }}>
                Trenutno nemate dodeljenog trenera. Kontaktirajte recepciju.
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Email</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{clan.email || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Telefon</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{clan.telefon || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Datum učlanjenja</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{clan.datumUclanjanja || '—'}</Typography>
            </Box>
          </Box>
        </Paper>
      )}

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
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#0d2b4e' }}>
            Moj napredak
          </Typography>

          {/* Statistike kartice */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2, mb: 4 }}>
            {[
              { label: 'Ukupno pokušaja', value: napredak.ukupnoPokusaja, color: '#e8f8f7' },
              { label: 'Savladano', value: napredak.ukupnoSavladano, color: '#e8f8f7' },
              {
                label: 'Uspešnost',
                value: napredak.ukupnoPokusaja > 0
                  ? `${Math.round((napredak.ukupnoSavladano / napredak.ukupnoPokusaja) * 100)}%`
                  : '—',
                color: '#eaf2fb'
              },
              {
                label: 'U napretku',
                value: napredak.pokusaji?.filter((p: any) => !p.savladana).length ?? 0,
                color: '#fef9e7'
              },
            ].map(({ label, value, color }) => (
              <Paper key={label} elevation={0} sx={{
                p: 3, borderRadius: 3, backgroundColor: color,
                border: '1px solid #e0e0e0', textAlign: 'center'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0d2b4e' }}>{value}</Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>{label}</Typography>
              </Paper>
            ))}
          </Box>

          {/* Tabela pokušaja */}
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
                {napredak.pokusaji?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#888' }}>
                      Nema evidentiranih pokušaja.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  )
}