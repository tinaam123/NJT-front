import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, FormControlLabel, Paper,
  Switch, TextField, Typography, Alert
} from '@mui/material'
import { evidentirajUlazak } from '../../api/posetaApi'

const praznaForma = {
  opremaNajam: false,
  iznosNajma: '',
  pratilac: false,
  upisnina: false,
  napomena: ''
}

export default function EvidentirajUlazakPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSwitch = (name: string) =>
    setForma(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))

  const handleChange = (e: any) =>
    setForma(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setLoading(true)
    setGreska('')
    try {
      await evidentirajUlazak(Number(id), {
        opremaNajam: forma.opremaNajam,
        iznosNajma: forma.iznosNajma ? parseFloat(forma.iznosNajma) : null,
        pratilac: forma.pratilac,
        upisnina: forma.upisnina,
        napomena: forma.napomena || null
      })
      navigate(`/clanovi/${id}`)
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Došlo je do greške.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Evidentiraj ulazak
        </Typography>

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={<Switch checked={forma.upisnina}
              onChange={() => handleSwitch('upisnina')} />}
            label="Upisnina" />

          <FormControlLabel
            control={<Switch checked={forma.pratilac}
              onChange={() => handleSwitch('pratilac')} />}
            label="Sa pratiocem" />

          <FormControlLabel
            control={<Switch checked={forma.opremaNajam}
              onChange={() => handleSwitch('opremaNajam')} />}
            label="Najam opreme" />

          {forma.opremaNajam && (
            <TextField fullWidth label="Iznos najma (RSD)" name="iznosNajma"
              type="number" value={forma.iznosNajma} onChange={handleChange} />
          )}

          <TextField fullWidth label="Napomena (opciono)" name="napomena"
            value={forma.napomena} onChange={handleChange} multiline rows={2} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Otkaži</Button>
          <Button variant="contained" color="success"
            onClick={handleSubmit} disabled={loading}>
            Evidentiraj ulazak
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}