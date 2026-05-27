import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, MenuItem, Paper, TextField, Typography, Alert
} from '@mui/material'
import { dodajClanarinu } from '../../api/clanarinaApi'

const TIPOVI = ['DNEVNA', 'MESECNA', 'TROMESECNA', 'POLUGODISNJA', 'GODISNJA']

const praznaForma = {
  tip: '',
  datumPocetka: '',
  datumIsteka: '',
  iznos: '',
  napomena: ''
}

export default function DodajClanarinu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) =>
    setForma(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    console.log('Forma vrednosti:', forma)
    setLoading(true)
    setGreska('')

    if (!forma.tip || !forma.datumPocetka || !forma.datumIsteka || !forma.iznos) {
    setGreska('Sva obavezna polja moraju biti popunjena.')
    setLoading(false)
    return
    }

    try {
      await dodajClanarinu(Number(id), {
      tip: forma.tip,
      datumPocetka: forma.datumPocetka,      // "2026-01-01"
      datumIsteka: forma.datumIsteka,          // "2026-02-01"
      iznos: Number(forma.iznos),              // broj, ne string
      napomena: forma.napomena || null
      })
      navigate(`/clanovi/${id}`)
    } catch (err: any) {
      const msg = err.response?.data?.message
      || err.response?.data?.greska
      || JSON.stringify(err.response?.data)
      || 'Došlo je do greške.'
      setGreska(msg)
    } finally {
      setLoading(false)
    }
}

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Dodaj članarinu
        </Typography>

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField select fullWidth label="Tip članarine" name="tip"
            value={forma.tip} onChange={handleChange}>
            {TIPOVI.map(t => (
              <MenuItem key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Datum početka" name="datumPocetka" type="date"
            value={forma.datumPocetka} onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }} />

          <TextField fullWidth label="Datum isteka" name="datumIsteka" type="date"
            value={forma.datumIsteka} onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }} />

          <TextField fullWidth label="Iznos (RSD)" name="iznos" type="number"
            value={forma.iznos} onChange={handleChange} />

          <TextField fullWidth label="Napomena (opciono)" name="napomena"
            value={forma.napomena} onChange={handleChange} multiline rows={2} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Otkaži</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{ backgroundColor: '#1a237e' }}>
            Dodaj članarinu
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}