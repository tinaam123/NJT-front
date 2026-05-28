import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, Grid, Paper, TextField,
  Typography, Alert, Switch, FormControlLabel
} from '@mui/material'
import { getTrener, kreirajTrenera, izmeniTrenera } from '../../api/trenerApi'

const praznaForma = {
  ime: '', prezime: '', specijalizacija: '', ocena: '',
  email: '', telefon: '', datumZaposlenja: '', aktivan: true
}

export default function TrenerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getTrener(Number(id)).then(res => {
        const t = res.data
        setForma({
          ime: t.ime || '',
          prezime: t.prezime || '',
          specijalizacija: t.specijalizacija || '',
          ocena: t.ocena?.toString() || '',
          email: t.email || '',
          telefon: t.telefon || '',
          datumZaposlenja: t.datumZaposlenja || '',
          aktivan: t.aktivan ?? true
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
      const payload = {
        ime: forma.ime,
        prezime: forma.prezime,
        specijalizacija: forma.specijalizacija || null,
        ocena: forma.ocena ? parseFloat(forma.ocena) : null,
        email: forma.email || null,
        telefon: forma.telefon || null,
        datumZaposlenja: forma.datumZaposlenja || null,
        aktivan: forma.aktivan
      }
      if (isEdit) {
        await izmeniTrenera(Number(id), payload)
      } else {
        await kreirajTrenera(payload)
      }
      navigate('/treneri')
    } catch (err: any) {
      setGreska(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        'Došlo je do greške.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#0d2b4e' }}>
          {isEdit ? 'Izmeni trenera' : 'Novi trener'}
        </Typography>

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        <Grid container spacing={2}>
          {[
            { name: 'ime', label: 'Ime' },
            { name: 'prezime', label: 'Prezime' },
            { name: 'specijalizacija', label: 'Specijalizacija' },
            { name: 'ocena', label: 'Ocena (1-10)', type: 'number' },
            { name: 'email', label: 'Email' },
            { name: 'telefon', label: 'Telefon' },
            { name: 'datumZaposlenja', label: 'Datum zaposlenja', type: 'date' },
          ].map(({ name, label, type }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={name}>
              <TextField fullWidth label={label} name={name} type={type || 'text'}
                value={(forma as any)[name]} onChange={handleChange}
                slotProps={type === 'date' ? { inputLabel: { shrink: true } } : undefined} />
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch checked={forma.aktivan}
                  onChange={e => setForma(prev => ({ ...prev, aktivan: e.target.checked }))} />
              }
              label="Aktivan trener" />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/treneri')}>Otkaži</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
            {isEdit ? 'Sačuvaj izmene' : 'Kreiraj trenera'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}