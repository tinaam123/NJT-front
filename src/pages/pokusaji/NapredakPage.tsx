import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Chip, Container, MenuItem, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Alert
} from '@mui/material'
import { getNapredak } from '../../api/pokusajApi'

const KATEGORIJE = ['BOULDERING', 'TOP_ROPE', 'LEAD', 'SPEED', 'KILTER']

export default function NapredakPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [napredak, setNapredak] = useState<any>(null)
  const [greska, setGreska] = useState('')
  const [kategorija, setKategorija] = useState('')
  const [datumOd, setDatumOd] = useState('')
  const [datumDo, setDatumDo] = useState('')
  const [savladana, setSavladana] = useState('')

  const ucitaj = async () => {
    setGreska('')
    try {
      const res = await getNapredak(Number(id), {
        kategorija: kategorija || undefined,
        datumOd: datumOd || undefined,
        datumDo: datumDo || undefined,
        savladana: savladana === '' ? undefined : savladana === 'true'
      })
      setNapredak(res.data)
    } catch {
      setGreska('Greška pri učitavanju napretka.')
    }
  }

  useEffect(() => { ucitaj() }, [id])

  if (!napredak) return (
    <Typography sx={{ mt: 4, textAlign: 'center' }}>Učitavanje...</Typography>
  )

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Napredak na rutama — {napredak.ime} {napredak.prezime}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ukupno pokušaja: {napredak.ukupnoPokusaja} · Savladano: {napredak.ukupnoSavladano}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate(`/clanovi/${id}`)}>
          Nazad na profil
        </Button>
      </Box>

      {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}
      {napredak.poruka && (
        <Alert severity="info" sx={{ mb: 2 }}>{napredak.poruka}</Alert>
      )}

      {/* Filteri */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField select label="Kategorija" value={kategorija}
            onChange={e => setKategorija(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="">Sve kategorije</MenuItem>
            {KATEGORIJE.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
          </TextField>

          <TextField label="Datum od" type="date" value={datumOd}
            onChange={e => setDatumOd(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }} />

          <TextField label="Datum do" type="date" value={datumDo}
            onChange={e => setDatumDo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }} />

          <TextField select label="Savladana" value={savladana}
            onChange={e => setSavladana(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">Sve</MenuItem>
            <MenuItem value="true">Da</MenuItem>
            <MenuItem value="false">Ne</MenuItem>
          </TextField>

          <Button variant="contained" onClick={ucitaj}
            sx={{ backgroundColor: '#1a237e' }}>
            Filtriraj
          </Button>

          <Button variant="outlined" onClick={() => {
            setKategorija('')
            setDatumOd('')
            setDatumDo('')
            setSavladana('')
          }}>
            Resetuj
          </Button>
        </Box>
      </Paper>

      {!napredak.pokusaji || napredak.pokusaji.length === 0 ? (
        <Alert severity="info">Nema evidentiranih pokušaja.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e8eaf6' }}>
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
              {napredak.pokusaji.map((p: any) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.nazivRute}</TableCell>
                  <TableCell>
                    <Chip label={p.kategorijaRute} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{p.tezinaRute}</TableCell>
                  <TableCell>{p.datum}</TableCell>
                  <TableCell>{p.brPokusaja}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.savladana ? 'Da ✓' : 'Ne'}
                      color={p.savladana ? 'success' : 'default'}
                      size="small" />
                  </TableCell>
                  <TableCell>{p.napomena || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}