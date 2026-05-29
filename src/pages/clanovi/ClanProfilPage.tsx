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

      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>

        {/* Zaglavlje */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e' }}>
            {clan.ime} {clan.prezime}
          </Typography>
          <Button startIcon={<EditIcon />} variant="outlined"
            onClick={() => navigate(`/clanovi/${id}/izmeni`)}
            sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
            Izmeni
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Lični podaci */}
        <Grid container spacing={2}>
          {[
            { label: 'Email', value: clan.email },
            { label: 'Telefon', value: clan.telefon },
            { label: 'Adresa', value: clan.adresa },
            { label: 'Datum rođenja', value: clan.datumRodjenja },
            { label: 'Datum učlanjenja', value: clan.datumUclanjanja },
            { label: 'Krvna grupa', value: clan.krvnaGrupa },
            { label: 'Kontakt osoba', value: clan.kontaktOsoba },
            { label: 'Telefon kontakta', value: clan.kontaktTelefon },
          ].map(({ label, value }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={label}>
              <Typography variant="caption" sx={{ color: '#888' }}>{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{value || '—'}</Typography>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Članarine */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0d2b4e' }}>
          Članarine
        </Typography>

        {statusClanarine?.imaAktivnuClanarinu ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>Trenutno aktivna</Typography>
            <Box sx={{
              display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap',
              p: 2, backgroundColor: '#e8f8f7', borderRadius: 2,
              border: '1px solid #2ec4b6'
            }}>
              <Chip label="Aktivna" color="success" />
              <Typography variant="body2">Tip: <b>{statusClanarine.aktivnaClanarina?.tip}</b></Typography>
              <Typography variant="body2">Od: <b>{statusClanarine.aktivnaClanarina?.datumPocetka}</b></Typography>
              <Typography variant="body2">Do: <b>{statusClanarine.aktivnaClanarina?.datumIsteka}</b></Typography>
              <Typography variant="body2">Iznos: <b>{statusClanarine.aktivnaClanarina?.iznos} RSD</b></Typography>
              {statusClanarine.aktivnaClanarina?.napomena && (
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Napomena: {statusClanarine.aktivnaClanarina.napomena}
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Chip label="Nema aktivne članarine" color="error" variant="outlined" />
          </Box>
        )}

        {statusClanarine?.sveClanarine?.filter((c: any) => !c.trenutnoAktivna).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
              Istekle članarine ({statusClanarine.sveClanarine.filter((c: any) => !c.trenutnoAktivna).length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {statusClanarine.sveClanarine
                .filter((c: any) => !c.trenutnoAktivna)
                .map((c: any) => (
                  <Box key={c.id} sx={{
                    display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap',
                    p: 1.5, borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e0e0e0'
                  }}>
                    <Chip label="Istekla" color="default" size="small" />
                    <Typography variant="body2">Tip: <b>{c.tip}</b></Typography>
                    <Typography variant="body2">Od: <b>{c.datumPocetka}</b></Typography>
                    <Typography variant="body2">Do: <b>{c.datumIsteka}</b></Typography>
                    <Typography variant="body2">Iznos: <b>{c.iznos} RSD</b></Typography>
                    {c.napomena && (
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Napomena: {c.napomena}
                      </Typography>
                    )}
                  </Box>
                ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button size="small" variant="outlined"
            onClick={() => navigate(`/clanovi/${id}/clanarina`)}
            sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
            + Dodaj članarinu
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Trener */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#0d2b4e' }}>Trener</Typography>
        {clan.trenerImePrezime ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={clan.trenerImePrezime} color="primary" />
            <Button size="small" color="error" variant="outlined"
              onClick={handleUkloniTrenera} sx={{ borderRadius: 2 }}>
              Ukloni trenera
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label="Bez trenera" variant="outlined" />
            <Button size="small" variant="contained"
              onClick={() => navigate(`/clanovi/${id}/trener`)}
              sx={{ backgroundColor: '#0d2b4e', borderRadius: 2 }}>
              Dodeli trenera
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Brze akcije */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0d2b4e' }}>Brze akcije</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined"
            onClick={() => navigate(`/clanovi/${id}/posete`)}
            sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
            Istorija poseta
          </Button>
          <Button variant="outlined"
            onClick={() => navigate(`/clanovi/${id}/napredak`)}
            sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
            Napredak na rutama
          </Button>
          <Button variant="contained" color="success"
            onClick={() => navigate(`/clanovi/${id}/ulazak`)}
            sx={{ borderRadius: 2 }}>
            Evidentiraj ulazak
          </Button>

          {clan.username ? (
            <Chip
              label={`Nalog: ${clan.username}`}
              color="success"
              variant="outlined"
              sx={{ height: 36, fontSize: 14, alignSelf: 'center' }}
            />
          ) : (
            <Button variant="outlined"
              onClick={() => navigate(`/clanovi/${id}/nalog`)}
              sx={{ borderColor: '#2ec4b6', color: '#2ec4b6', borderRadius: 2 }}>
              Kreiraj nalog
            </Button>
          )}
        </Box>

      </Paper>
    </Container>
  )
}