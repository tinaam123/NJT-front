import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Chip, Container, InputAdornment, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { getSveTrenere, obrisiTrenera } from '../../api/trenerApi'

export default function TreneriListPage() {
  const navigate = useNavigate()
  const [treneri, setTreneri] = useState<any[]>([])
  const [pretraga, setPretraga] = useState('')
  const [greska, setGreska] = useState('')

  const ucitaj = async () => {
    try {
      const res = await getSveTrenere()
      setTreneri(res.data)
    } catch {
      setGreska('Greška pri učitavanju trenera.')
    }
  }

  useEffect(() => { ucitaj() }, [])

  const handleObrisi = async (id: number) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovog trenera?')) return
    try {
      await obrisiTrenera(id)
      ucitaj()
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Nije moguće obrisati trenera koji ima članove.')
    }
  }

  const filtrirani = treneri.filter(t => {
    const q = pretraga.toLowerCase()
    return (
      t.ime?.toLowerCase().includes(q) ||
      t.prezime?.toLowerCase().includes(q) ||
      t.specijalizacija?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q)
    )
  })

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e' }}>Treneri</Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate('/treneri/novi')}
          sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
          Novi trener
        </Button>
      </Box>

      {greska && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setGreska('')}>{greska}</Alert>}

      <TextField
        fullWidth
        placeholder="Pretraži po imenu, prezimenu, specijalizaciji ili emailu..."
        value={pretraga}
        onChange={e => setPretraga(e.target.value)}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start"><SearchIcon /></InputAdornment>
            )
          }
        }}
      />

      <TableContainer component={Paper} elevation={0}
        sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0faf9' }}>
            <TableRow>
              <TableCell><b>Ime i prezime</b></TableCell>
              <TableCell><b>Specijalizacija</b></TableCell>
              <TableCell><b>Ocena</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Telefon</b></TableCell>
              <TableCell><b>Datum zaposlenja</b></TableCell>
              <TableCell><b>Broj članova</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Akcije</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrirani.map(trener => (
              <TableRow key={trener.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{trener.ime} {trener.prezime}</TableCell>
                <TableCell>{trener.specijalizacija || '—'}</TableCell>
                <TableCell>
                  <Chip label={`⭐ ${trener.ocena ?? '—'}`} size="small"
                    sx={{ backgroundColor: '#fef9e7' }} />
                </TableCell>
                <TableCell>{trener.email || '—'}</TableCell>
                <TableCell>{trener.telefon || '—'}</TableCell>
                <TableCell>{trener.datumZaposlenja || '—'}</TableCell>
                <TableCell>
                  <Chip label={trener.brojClanova} size="small"
                    sx={{ backgroundColor: '#e8f8f7', color: '#0e6655' }} />
                </TableCell>
                <TableCell>
                  <Chip label={trener.aktivan ? 'Aktivan' : 'Neaktivan'}
                    color={trener.aktivan ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined"
                      onClick={() => navigate(`/treneri/${trener.id}/izmeni`)}
                      sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
                      Izmeni
                    </Button>
                    <Button size="small" variant="outlined" color="error"
                      onClick={() => handleObrisi(trener.id)}
                      sx={{ borderRadius: 2 }}>
                      Obriši
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filtrirani.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4, color: '#888' }}>
                  Nema trenera za prikaz.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}