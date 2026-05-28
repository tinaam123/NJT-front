import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  const navItems = [
    { label: 'Članovi', path: '/clanovi' },
    { label: 'Rute', path: '/rute' },
    { label: 'Treneri', path: '/treneri' },
    { label: 'Izveštaji', path: '/izvestaji' },
    { label: 'Članarine', path: '/clanarine/istekle' },
  ]

  return (
    <AppBar position="static" elevation={0} sx={{
      backgroundColor: '#0d2b4e',
      borderBottom: '3px solid #2ec4b6'
    }}>
      <Toolbar sx={{ px: { xs: 2, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <Typography variant="h6" sx={{
            fontWeight: 800,
            letterSpacing: 1,
            color: 'white',
            fontSize: 20
          }}>
            🧗 ClimbWorld
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navItems.map(item => (
            <Button key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: isActive(item.path) ? '#2ec4b6' : 'rgba(255,255,255,0.85)',
                fontWeight: isActive(item.path) ? 700 : 400,
                borderBottom: isActive(item.path) ? '2px solid #2ec4b6' : '2px solid transparent',
                borderRadius: 0,
                px: 2,
                fontSize: 14,
                '&:hover': { color: '#2ec4b6', backgroundColor: 'transparent' }
              }}>
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}