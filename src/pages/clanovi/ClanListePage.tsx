import { useState } from 'react'
import {
  Box, Button, Container, InputAdornment, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { pretraziClanove } from '../../api/clanApi'

export default function ClanListPage() {
  const navigate = useNavigate()
  const [clanovi, setClanovi] = useState<any[]>([])
  const [kriterijum, setKriterijum] = useState('')
  const [loading, setLoading] = useState(false)

  const pretrazi = async () => {
    if (!kriterijum.trim()) return
    setLoading(true)
    try {
      const res = await pretraziClanove(kriterijum)
      setClanovi(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Članovi</Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate('/clanovi/novi')}
          sx={{ backgroundColor: '#1a237e' }}>
          Novi član
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Pretraži po imenu, prezimenu ili ID-u..."
          value={kriterijum}
          onChange={(e) => setKriterijum(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && pretrazi()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              )
            }
          }}
        />
        <Button variant="contained" onClick={pretrazi} disabled={loading}
          sx={{ backgroundColor: '#1a237e', minWidth: 120 }}>
          Pretraži
        </Button>
      </Box>

      {clanovi.length > 0 && (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e8eaf6' }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Ime i prezime</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Telefon</b></TableCell>
                <TableCell><b>Trener</b></TableCell>
                <TableCell><b>Akcije</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clanovi.map((clan) => (
                <TableRow key={clan.id} hover>
                  <TableCell>{clan.id}</TableCell>
                  <TableCell>{clan.ime} {clan.prezime}</TableCell>
                  <TableCell>{clan.email}</TableCell>
                  <TableCell>{clan.telefon}</TableCell>
                  <TableCell>
                    {clan.trenerImePrezime
                      ? <Chip label={clan.trenerImePrezime} size="small" color="primary" />
                      : <Chip label="Bez trenera" size="small" variant="outlined" />}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/clanovi/${clan.id}`)}>
                      Profil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {clanovi.length === 0 && kriterijum && !loading && (
        <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
          Nije pronađen nijedan član za "{kriterijum}"
        </Typography>
      )}
    </Container>
  )
}