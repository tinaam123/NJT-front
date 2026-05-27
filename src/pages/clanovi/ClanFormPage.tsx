import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, Grid, MenuItem, Paper,
  TextField, Typography, Alert
} from '@mui/material'
import { getClan, izmeniClana, registrujClana } from '../../api/clanApi'

const KRV_GRUPE = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']

const praznaForma = {
  ime: '', prezime: '', datumRodjenja: '', email: '',
  telefon: '', adresa: '', kontaktOsoba: '', kontaktTelefon: '', krvnaGrupa: ''
}

export default function ClanFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getClan(Number(id)).then(res => {
        const c = res.data
        setForma({
          ime: c.ime,
          prezime: c.prezime,
          datumRodjenja: c.datumRodjenja,
          email: c.email,
          telefon: c.telefon,
          adresa: c.adresa || '',
          kontaktOsoba: c.kontaktOsoba || '',
          kontaktTelefon: c.kontaktTelefon || '',
          krvnaGrupa: c.krvnaGrupa || ''
        })
      })
    }
  }, [id])

  const handleChange = (e: any) =>
    setForma(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setLoading(true)
    setGreska('')
    try {
      if (isEdit) {
        await izmeniClana(Number(id), forma)
      } else {
        await registrujClana(forma)
      }
      navigate('/clanovi')
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Došlo je do greške.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          {isEdit ? 'Izmeni člana' : 'Registracija novog člana'}
        </Typography>

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        <Grid container spacing={2}>
          {[
            { name: 'ime', label: 'Ime' },
            { name: 'prezime', label: 'Prezime' },
            { name: 'email', label: 'Email' },
            { name: 'telefon', label: 'Telefon' },
            { name: 'adresa', label: 'Adresa' },
            { name: 'datumRodjenja', label: 'Datum rođenja', type: 'date' },
            { name: 'kontaktOsoba', label: 'Kontakt osoba za hitne slučajeve' },
            { name: 'kontaktTelefon', label: 'Telefon za hitne slučajeve' },
          ].map(({ name, label, type }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                type={type || 'text'}
                value={(forma as any)[name]}
                onChange={handleChange}
                slotProps={type === 'date' ? { inputLabel: { shrink: true } } : undefined}
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="Krvna grupa" name="krvnaGrupa"
              value={forma.krvnaGrupa} onChange={handleChange}>
              {KRV_GRUPE.map(k => (
                <MenuItem key={k} value={k}>{k.replace('_', ' ')}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Otkaži</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{ backgroundColor: '#1a237e' }}>
            {isEdit ? 'Sačuvaj izmene' : 'Registruj člana'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}