import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Card, CardActionArea, CardContent,
  Container, Typography, Alert, Chip
} from '@mui/material'
import { getDostupniTreneri, dodeliTrenera } from '../../api/clanApi'

export default function DodeliTreneraPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [treneri, setTreneri] = useState<any[]>([])
  const [odabrani, setOdabrani] = useState<number | null>(null)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDostupniTreneri(Number(id))
      .then(res => setTreneri(res.data))
      .catch(() => setGreska('Greška pri učitavanju trenera.'))
  }, [id])

  const handleSubmit = async () => {
    if (!odabrani) return
    setLoading(true)
    setGreska('')
    try {
      await dodeliTrenera(Number(id), odabrani)
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Dodeli trenera
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Klikni na trenera da ga odabereš, zatim potvrdi.
      </Typography>

      {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

      {treneri.length === 0 && !greska && (
        <Alert severity="info">Nema dostupnih trenera.</Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {treneri.map(trener => (
          <Card key={trener.id}
            variant={odabrani === trener.id ? 'elevation' : 'outlined'}
            sx={{
              border: odabrani === trener.id ? '2px solid #1a237e' : '1px solid #ddd',
              backgroundColor: odabrani === trener.id ? '#e8eaf6' : 'white',
              transition: 'all 0.2s'
            }}>
            <CardActionArea onClick={() => setOdabrani(trener.id)}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                      {trener.ime} {trener.prezime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {trener.specijalizacija}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      📧 {trener.email} · 📞 {trener.telefon}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Zaposlen od: {trener.datumZaposlenja}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Chip label={`⭐ ${trener.ocena}`} color="primary" size="small" />
                    <Chip label={`👥 ${trener.brojClanova} članova`} variant="outlined" size="small" />
                    {trener.aktivan
                      ? <Chip label="Aktivan" color="success" size="small" />
                      : <Chip label="Neaktivan" color="error" size="small" />}
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Otkaži</Button>
        <Button variant="contained" onClick={handleSubmit}
          disabled={!odabrani || loading}
          sx={{ backgroundColor: '#1a237e' }}>
          Dodeli trenera
        </Button>
      </Box>
    </Container>
  )
}