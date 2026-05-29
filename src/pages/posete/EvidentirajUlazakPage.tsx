import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Container, FormControlLabel, Paper,
  Switch, TextField, Typography, Alert
} from '@mui/material'
import { evidentirajUlazak, evidentirajIzlazak, getIstorijaPosteta } from '../../api/posetaApi'

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
  const [upozorenje, setUpozorenje] = useState('')
  const [imaOtvorenaPoseta, setImaOtvorenaPoseta] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingIzlazak, setLoadingIzlazak] = useState(false)

  useEffect(() => {
    // Proveri da li clan ima otvorenu posetu
    getIstorijaPosteta(Number(id)).then(res => {
      const posete = res.data.posete || []
      const otvorena = posete.find((p: any) => p.otvorena)
      if (otvorena) {
        setImaOtvorenaPoseta(true)
        setUpozorenje('Član već ima evidentiran ulazak bez izlaska. Najpre evidentirajte izlazak.')
      }
    }).catch(() => {})
  }, [id])

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
      setGreska(
        err.response?.data?.message ||
        err.response?.data?.greska ||
        JSON.stringify(err.response?.data) ||
        'Došlo je do greške.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleIzlazak = async () => {
    setLoadingIzlazak(true)
    setGreska('')
    try {
      await evidentirajIzlazak(Number(id))
      setImaOtvorenaPoseta(false)
      setUpozorenje('')
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Greška pri evidentiranju izlaska.')
    } finally {
      setLoadingIzlazak(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#0d2b4e' }}>
          Evidentiraj ulazak
        </Typography>

        {/* Upozorenje za otvorenu posetu */}
        {imaOtvorenaPoseta && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {upozorenje}
            </Alert>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleIzlazak}
              disabled={loadingIzlazak}
              sx={{ borderRadius: 2 }}>
              {loadingIzlazak ? 'Evidentiranje...' : 'Evidentiraj izlazak'}
            </Button>
          </Box>
        )}

        {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

        {/* Forma za ulazak — blokirana ako ima otvorenu posetu */}
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: 2,
          opacity: imaOtvorenaPoseta ? 0.4 : 1,
          pointerEvents: imaOtvorenaPoseta ? 'none' : 'auto'
        }}>
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
          <Button variant="outlined" onClick={() => navigate(-1)}
            sx={{ borderRadius: 2 }}>
            Otkaži
          </Button>
          <Button variant="contained" color="success"
            onClick={handleSubmit}
            disabled={loading || imaOtvorenaPoseta}
            sx={{ borderRadius: 2 }}>
            {loading ? 'Evidentiranje...' : 'Evidentiraj ulazak'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}