import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, Grid, MenuItem, Paper, TextField, Typography, Alert, Switch, FormControlLabel
} from '@mui/material'
import { getRuta, kreirajRutu, izmeniRutu } from '../../api/rutaApi'

const KATEGORIJE = ['BOULDERING', 'TOP_ROPE', 'LEAD', 'SPEED', 'KILTER']

const praznaForma = {
  naziv: '', tezina: '', visina: '', lokacija: '', boja: '',
  kategorija: '', datumPostavljanja: '', datumUklanjanja: '',
  postavljac: '', aktivna: true
}

export default function RutaFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [forma, setForma] = useState(praznaForma)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getRuta(Number(id)).then(res => {
        const r = res.data
        setForma({
          naziv: r.naziv || '',
          tezina: r.tezina || '',
          visina: r.visina?.toString() || '',
          lokacija: r.lokacija || '',
          boja: r.boja || '',
          kategorija: r.kategorija || '',
          datumPostavljanja: r.datumPostavljanja || '',
          datumUklanjanja: r.datumUklanjanja || '',
          postavljac: r.postavljac || '',
          aktivna: r.aktivna ?? true
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
        naziv: forma.naziv,
        tezina: forma.tezina || null,
        visina: forma.visina ? parseInt(forma.visina) : null,
        lokacija: forma.lokacija || null,
        boja: forma.boja || null,
        kategorija: forma.kategorija,
        datumPostavljanja: forma.datumPostavljanja || null,
        datumUklanjanja: forma.datumUklanjanja || null,
        postavljac: forma.postavljac || null,
        aktivna: forma.aktivna
      }
      if (isEdit) {
        await izmeniRutu(Number(id), payload)
      } else {
        await kreirajRutu(payload)
      }
      navigate('/rute')
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
          {isEdit ? 'Izmeni rutu' : 'Nova ruta'}
        </Typography>

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        <Grid container spacing={2}>
          {[
            { name: 'naziv', label: 'Naziv rute' },
            { name: 'tezina', label: 'Težina (npr. 6a, V4)' },
            { name: 'visina', label: 'Visina (m)', type: 'number' },
            { name: 'lokacija', label: 'Lokacija u sali' },
            { name: 'boja', label: 'Boja rute' },
            { name: 'postavljac', label: 'Postavljač' },
            { name: 'datumPostavljanja', label: 'Datum postavljanja', type: 'date' },
            { name: 'datumUklanjanja', label: 'Datum uklanjanja', type: 'date' },
          ].map(({ name, label, type }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={name}>
              <TextField fullWidth label={label} name={name} type={type || 'text'}
                value={(forma as any)[name]} onChange={handleChange}
                slotProps={type === 'date' ? { inputLabel: { shrink: true } } : undefined} />
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="Kategorija" name="kategorija"
              value={forma.kategorija} onChange={handleChange}>
              {KATEGORIJE.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch checked={forma.aktivna}
                  onChange={e => setForma(prev => ({ ...prev, aktivna: e.target.checked }))} />
              }
              label="Aktivna ruta" />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/rute')}>Otkaži</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
            {isEdit ? 'Sačuvaj izmene' : 'Kreiraj rutu'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}