import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Container, Paper, TextField, Typography, Alert
} from '@mui/material'
import { login } from '../api/authApi'
import api from '../api/axiosConfig'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setGreska('Unesite korisničko ime i lozinku.')
      return
    }
    setLoading(true)
    setGreska('')
    try {
      const res = await login(username, password)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)

      if (res.data.role === 'CLAN') {
        // Uzmi podatke o clanu
        const clanRes = await api.get('/auth/me/clan')
        localStorage.setItem('clanId', clanRes.data.id.toString())
        window.location.href = '/moj-profil'
      } else {
        window.location.href = '/'
      }
    } catch (err: any) {
      setGreska(
        err.response?.data?.message ||
        'Pogrešno korisničko ime ili lozinka.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d2b4e 0%, #1a5276 50%, #0e6655 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d2b4e', mb: 1 }}>
            🧗 ClimbWorld
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mb: 4 }}>
            Prijavite se da biste nastavili
          </Typography>

          {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Korisničko ime" value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <TextField fullWidth label="Lozinka" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <Button fullWidth variant="contained" onClick={handleLogin} disabled={loading}
              sx={{
                mt: 1, py: 1.5, backgroundColor: '#0d2b4e',
                borderRadius: 2, fontWeight: 700, fontSize: 16,
                '&:hover': { backgroundColor: '#1a5276' }
              }}>
              {loading ? 'Prijavljivanje...' : 'Prijavi se'}
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: '#bbb', mt: 3, display: 'block' }}>
            © 2026 ClimbWorld
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}