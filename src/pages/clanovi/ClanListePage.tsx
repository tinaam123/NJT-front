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
  const [pretrazivaoBio, setPretrazivaoBio] = useState(false)

  const pretrazi = async () => {
    if (!kriterijum.trim()) return
    setLoading(true)
    setPretrazivaoBio(true)
    try {
      const res = await pretraziClanove(kriterijum)
      setClanovi(res.data)
    } catch {
      setClanovi([])
    } finally {
      setLoading(false)
    }
  }

  const handlePromena = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKriterijum(e.target.value)
    if (e.target.value === '') {
      setClanovi([])
      setPretrazivaoBio(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e' }}>Članovi</Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate('/clanovi/novi')}
          sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
          Novi član
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Pretraži po imenu, prezimenu ili ID-u..."
          value={kriterijum}
          onChange={handlePromena}
          onKeyDown={(e) => e.key === 'Enter' && pretrazi()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              )
            }
          }}
        />
        <Button variant="contained" onClick={pretrazi} disabled={loading}
          sx={{ backgroundColor: '#2ec4b6', minWidth: 120, borderRadius: 2, '&:hover': { backgroundColor: '#25a99d' } }}>
          Pretraži
        </Button>
      </Box>

      {clanovi.length > 0 && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f0faf9' }}>
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
                  <TableCell sx={{ fontWeight: 600 }}>{clan.ime} {clan.prezime}</TableCell>
                  <TableCell>{clan.email}</TableCell>
                  <TableCell>{clan.telefon}</TableCell>
                  <TableCell>
                    {clan.trenerImePrezime
                      ? <Chip label={clan.trenerImePrezime} size="small" sx={{ backgroundColor: '#e8f8f7', color: '#0e6655' }} />
                      : <Chip label="Bez trenera" size="small" variant="outlined" />}
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined"
                      onClick={() => navigate(`/clanovi/${clan.id}`)}
                      sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
                      Profil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}