import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Chip, Container, MenuItem, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { getSveRute, getAktivneRute, deaktivirajRutu, obrisiRutu } from '../../api/rutaApi'

const KATEGORIJE = ['BOULDERING', 'TOP_ROPE', 'LEAD', 'SPEED', 'KILTER']

const kategorijaColor: Record<string, string> = {
  BOULDERING: '#e8f8f7',
  TOP_ROPE: '#eaf2fb',
  LEAD: '#fef9e7',
  SPEED: '#fdebd0',
  KILTER: '#f5eef8'
}

export default function RuteListPage() {
  const navigate = useNavigate()
  const [rute, setRute] = useState<any[]>([])
  const [filter, setFilter] = useState('SVE')
  const [kategorijaFilter, setKategorijaFilter] = useState('')
  const [greska, setGreska] = useState('')

  const ucitaj = async () => {
    try {
      const res = filter === 'AKTIVNE' ? await getAktivneRute() : await getSveRute()
      setRute(res.data)
    } catch {
      setGreska('Greška pri učitavanju ruta.')
    }
  }

  useEffect(() => { ucitaj() }, [filter])

  const handleDeaktiviraj = async (id: number) => {
    try {
      await deaktivirajRutu(id)
      ucitaj()
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Greška pri deaktiviranju.')
    }
  }

  const handleObrisi = async (id: number) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovu rutu?')) return
    try {
      await obrisiRutu(id)
      ucitaj()
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Nije moguće obrisati rutu koja ima pokušaje.')
    }
  }

  const filtrirane = kategorijaFilter
    ? rute.filter(r => r.kategorija === kategorijaFilter)
    : rute

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e' }}>Rute</Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate('/rute/nova')}
          sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
          Nova ruta
        </Button>
      </Box>

      {greska && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setGreska('')}>{greska}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField select label="Prikaz" value={filter}
          onChange={e => setFilter(e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="SVE">Sve rute</MenuItem>
          <MenuItem value="AKTIVNE">Samo aktivne</MenuItem>
        </TextField>

        <TextField select label="Kategorija" value={kategorijaFilter}
          onChange={e => setKategorijaFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">Sve kategorije</MenuItem>
          {KATEGORIJE.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={0}
        sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0faf9' }}>
            <TableRow>
              <TableCell><b>Naziv</b></TableCell>
              <TableCell><b>Kategorija</b></TableCell>
              <TableCell><b>Težina</b></TableCell>
              <TableCell><b>Visina (m)</b></TableCell>
              <TableCell><b>Lokacija</b></TableCell>
              <TableCell><b>Boja</b></TableCell>
              <TableCell><b>Postavljač</b></TableCell>
              <TableCell><b>Datum postavljanja</b></TableCell>
              <TableCell><b>Pokušaji</b></TableCell>
              <TableCell><b>Uspešni</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Akcije</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrirane.map((ruta) => (
              <TableRow key={ruta.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{ruta.naziv}</TableCell>
                <TableCell>
                  <Chip label={ruta.kategorija} size="small"
                    sx={{ backgroundColor: kategorijaColor[ruta.kategorija] || '#f5f5f5' }} />
                </TableCell>
                <TableCell>{ruta.tezina || '—'}</TableCell>
                <TableCell>{ruta.visina ?? '—'}</TableCell>
                <TableCell>{ruta.lokacija || '—'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {ruta.boja && (
                      <Box sx={{
                        width: 16, height: 16, borderRadius: '50%',
                        backgroundColor: ruta.boja.toLowerCase(),
                        border: '1px solid #ccc'
                      }} />
                    )}
                    {ruta.boja || '—'}
                  </Box>
                </TableCell>
                <TableCell>{ruta.postavljac || '—'}</TableCell>
                <TableCell>{ruta.datumPostavljanja || '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={ruta.brojPokusaja}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={`✓ ${ruta.brojUspelihPokusaja}`}
                    size="small"
                    color={ruta.brojUspelihPokusaja > 0 ? 'success' : 'default'}
                    variant={ruta.brojUspelihPokusaja > 0 ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ruta.aktivna ? 'Aktivna' : 'Neaktivna'}
                    color={ruta.aktivna ? 'success' : 'default'}
                    size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined"
                      onClick={() => navigate(`/rute/${ruta.id}/izmeni`)}
                      sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
                      Izmeni
                    </Button>
                    {ruta.aktivna && (
                      <Button size="small" variant="outlined" color="warning"
                        onClick={() => handleDeaktiviraj(ruta.id)}
                        sx={{ borderRadius: 2 }}>
                        Deaktiviraj
                      </Button>
                    )}
                    <Button size="small" variant="outlined" color="error"
                      onClick={() => handleObrisi(ruta.id)}
                      sx={{ borderRadius: 2 }}>
                      Obriši
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filtrirane.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} sx={{ textAlign: 'center', py: 4, color: '#888' }}>
                  Nema ruta za prikaz.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}