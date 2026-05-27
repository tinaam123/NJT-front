import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Chip, Container, Divider, Grid,
  Paper, Typography, Alert
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { getClan, ukloniTrenera } from '../../api/clanApi'
import { getStatusClanarine } from '../../api/clanarinaApi'

export default function ClanProfilPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clan, setClan] = useState<any>(null)
  const [statusClanarine, setStatusClanarine] = useState<any>(null)
  const [greska, setGreska] = useState('')

  const ucitaj = async () => {
    try {
      const [clanRes, statusRes] = await Promise.all([
        getClan(Number(id)),
        getStatusClanarine(Number(id))
      ])
      setClan(clanRes.data)
      setStatusClanarine(statusRes.data)
    } catch (err: any) {
      setGreska('Greška pri učitavanju podataka.')
    }
  }

  useEffect(() => { ucitaj() }, [id])

  const handleUkloniTrenera = async () => {
    await ukloniTrenera(Number(id))
    ucitaj()
  }

  if (!clan) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Učitavanje...</Typography>

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {clan.ime} {clan.prezime}
          </Typography>
          <Button startIcon={<EditIcon />} variant="outlined"
            onClick={() => navigate(`/clanovi/${id}/izmeni`)}>
            Izmeni
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {[
            { label: 'Email', value: clan.email },
            { label: 'Telefon', value: clan.telefon },
            { label: 'Adresa', value: clan.adresa },
            { label: 'Datum rođenja', value: clan.datumRodjenja },
            { label: 'Krvna grupa', value: clan.krvnaGrupa },
            { label: 'Kontakt osoba', value: clan.kontaktOsoba },
            { label: 'Telefon kontakta', value: clan.kontaktTelefon },
          ].map(({ label, value }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={label}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
              <Typography variant="body1">{value || '—'}</Typography>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Članarina */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Članarina</Typography>
        {statusClanarine?.imaAktivnuClanarinu ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip label="Aktivna" color="success" />
            <Typography>Tip: <b>{statusClanarine.aktivnaClanarina?.tip}</b></Typography>
            <Typography>Ističe: <b>{statusClanarine.aktivnaClanarina?.datumIsteka}</b></Typography>
            <Typography>Iznos: <b>{statusClanarine.aktivnaClanarina?.iznos} RSD</b></Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label="Nema aktivne članarine" color="error" variant="outlined" />
            <Button size="small" variant="contained"
              onClick={() => navigate(`/clanovi/${id}/clanarina`)}
              sx={{ backgroundColor: '#1a237e' }}>
              Dodaj članarinu
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Trener */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Trener</Typography>
        {clan.trenerImePrezime ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={clan.trenerImePrezime} color="primary" />
            <Button size="small" color="error" variant="outlined" onClick={handleUkloniTrenera}>
              Ukloni trenera
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label="Bez trenera" variant="outlined" />
            <Button size="small" variant="contained"
              onClick={() => navigate(`/clanovi/${id}/trener`)}
              sx={{ backgroundColor: '#1a237e' }}>
              Dodeli trenera
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Brze akcije */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Brze akcije</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => navigate(`/clanovi/${id}/posete`)}>
            Istorija poseta
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/clanovi/${id}/napredak`)}>
            Napredak na rutama
          </Button>
          <Button variant="contained" color="success"
            onClick={() => navigate(`/clanovi/${id}/ulazak`)}>
            Evidentiraj ulazak
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}