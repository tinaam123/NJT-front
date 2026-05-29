import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, Paper, TextField, Typography, Alert
} from '@mui/material'
import { registrujKorisnika } from '../../api/authApi'

export default function DodajNalogClanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [greska, setGreska] = useState('')
  const [uspeh, setUspeh] = useState(false)
  const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  if (!username.trim() || !password.trim()) {
    setGreska('Korisničko ime i lozinka su obavezni.')
    return
  }
  setLoading(true)
  setGreska('')
  try {
    await registrujKorisnika(Number(id), { username, password })
    setUspeh(true)
    setTimeout(() => navigate(`/clanovi/${id}`), 2000)
  } catch (err: any) {
    setGreska(err.response?.data?.message || 'Greška pri kreiranju naloga.')
  } finally {
    setLoading(false)
  }
}

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#0d2b4e' }}>
          Kreiraj nalog za člana
        </Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
          Član će se ovim kredencijalima prijaviti i beležiti pokušaje na rutama.
        </Typography>

        {uspeh && <Alert severity="success" sx={{ mb: 2 }}>Nalog uspešno kreiran!</Alert>}
        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField fullWidth label="Korisničko ime" value={username}
            onChange={e => setUsername(e.target.value)} />
          <TextField fullWidth label="Lozinka" type="password" value={password}
            onChange={e => setPassword(e.target.value)} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderRadius: 2 }}>
            Otkaži
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading || uspeh}
            sx={{ backgroundColor: '#0d2b4e', borderRadius: 2 }}>
            Kreiraj nalog
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
