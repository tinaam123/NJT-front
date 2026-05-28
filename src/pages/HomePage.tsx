import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Container, InputAdornment,
  TextField, Typography, Paper
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import GroupIcon from '@mui/icons-material/Group'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { pretraziClanove } from '../api/clanApi'

export default function HomePage() {
  const navigate = useNavigate()
  const [kriterijum, setKriterijum] = useState('')
  const [rezultati, setRezultati] = useState<any[]>([])
  const [pretrazivaoBio, setPretrazivaoBio] = useState(false)
  const [loading, setLoading] = useState(false)

  const pretrazi = async () => {
    if (!kriterijum.trim()) return
    setLoading(true)
    setPretrazivaoBio(true)
    try {
      const res = await pretraziClanove(kriterijum)
      setRezultati(res.data)
    } catch {
      setRezultati([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') pretrazi()
  }

  const handlePromena = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKriterijum(e.target.value)
    if (e.target.value === '') {
      setRezultati([])
      setPretrazivaoBio(false)
    }
  }

  return (
    <Box>
      {/* Hero sekcija */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0d2b4e 0%, #1a5276 50%, #0e6655 100%)',
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h3" sx={{
          color: 'white',
          fontWeight: 800,
          mb: 1,
          fontSize: { xs: 28, md: 42 },
          letterSpacing: 1
        }}>
          🧗 ClimbWorld
        </Typography>

        <Typography variant="h6" sx={{
          color: '#a8d8ea',
          mb: 4,
          fontWeight: 400,
          fontSize: { xs: 14, md: 18 }
        }}>
          Dobrodošli u program za evidenciju članova našeg kluba
        </Typography>

        {/* Polje za pretragu */}
        <Box sx={{
          maxWidth: 600,
          mx: 'auto',
          display: 'flex',
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            fullWidth
            placeholder="Pretraži člana po imenu, prezimenu ili ID-u..."
            value={kriterijum}
            onChange={handlePromena}
            onKeyDown={handleKeyDown}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { border: 'none' },
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#0d2b4e' }} />
                  </InputAdornment>
                )
              }
            }}
          />
          <Button
            variant="contained"
            onClick={pretrazi}
            disabled={loading}
            sx={{
              backgroundColor: '#2ec4b6',
              color: 'white',
              fontWeight: 700,
              px: 4,
              borderRadius: 2,
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#25a99d' }
            }}>
            Pretraži
          </Button>
        </Box>

        {/* Rezultati pretrage */}
        {rezultati.length > 0 && (
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {rezultati.map((clan, index) => (
                <Box
                  key={clan.id}
                  onClick={() => navigate(`/clanovi/${clan.id}`)}
                  sx={{
                    px: 3, py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: index < rezultati.length - 1 ? '1px solid #f0f0f0' : 'none',
                    '&:hover': { backgroundColor: '#f0faf9' },
                    transition: 'background 0.15s'
                  }}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontWeight: 600, color: '#0d2b4e' }}>
                      {clan.ime} {clan.prezime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                      {clan.email} · {clan.telefon}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{
                    backgroundColor: '#e8f8f7',
                    color: '#2ec4b6',
                    px: 1.5, py: 0.5,
                    borderRadius: 5,
                    fontWeight: 600
                  }}>
                    ID {clan.id}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </Box>

      {/* Kartice sa akcijama */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" sx={{
          fontWeight: 700,
          color: '#0d2b4e',
          mb: 4,
          textAlign: 'center'
        }}>
          Brzi pristup
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3
        }}>
          {[
            {
              icon: <GroupIcon sx={{ fontSize: 40, color: '#2ec4b6' }} />,
              title: 'Pregled članova',
              desc: 'Pretraži i upravljaj evidencijom svih članova kluba.',
              action: () => navigate('/clanovi'),
              btnLabel: 'Otvori listu',
              color: '#e8f8f7'
            },
            {
              icon: <AddIcon sx={{ fontSize: 40, color: '#1a5276' }} />,
              title: 'Novi član',
              desc: 'Registruj novog člana i unesi sve potrebne podatke.',
              action: () => navigate('/clanovi/novi'),
              btnLabel: 'Registruj člana',
              color: '#eaf2fb'
            },
            {
              icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#0e6655' }} />,
              title: 'Evidencija poseta',
              desc: 'Pretraži člana i evidentiraj ulazak ili izlazak iz sale.',
              action: () => navigate('/clanovi'),
              btnLabel: 'Evidentiraj',
              color: '#e9f7ef'
            },
          ].map(({ icon, title, desc, action, btnLabel, color }) => (
            <Paper key={title} elevation={0} sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: color,
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1.5,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }
            }}>
              {icon}
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#0d2b4e' }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', flexGrow: 1 }}>
                {desc}
              </Typography>
              <Button variant="contained" onClick={action} sx={{
                mt: 1,
                backgroundColor: '#0d2b4e',
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#1a5276' }
              }}>
                {btnLabel}
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{
        backgroundColor: '#0d2b4e',
        py: 3,
        textAlign: 'center'
      }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2026 ClimbWorld · Sistem za evidenciju članova penjačkog kluba
        </Typography>
      </Box>
    </Box>
  )
}