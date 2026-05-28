import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Chip, Container, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography, Alert
} from '@mui/material'
import { getIstorijaPosteta, evidentirajIzlazak } from '../../api/posetaApi'

export default function IstorijaPosetaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [istorija, setIstorija] = useState<any>(null)
  const [greska, setGreska] = useState('')
  const [loadingIzlazak, setLoadingIzlazak] = useState(false)

  const ucitaj = async () => {
    try {
      const res = await getIstorijaPosteta(Number(id))
      setIstorija(res.data)
    } catch {
      setGreska('Greška pri učitavanju istorije poseta.')
    }
  }

  useEffect(() => { ucitaj() }, [id])

  const handleIzlazak = async () => {
    setLoadingIzlazak(true)
    setGreska('')
    try {
      await evidentirajIzlazak(Number(id))
      ucitaj()
    } catch (err: any) {
      setGreska(
        err.response?.data?.message ||
        err.response?.data?.greska ||
        JSON.stringify(err.response?.data) ||
        'Greška pri evidentiranju izlaska.'
      )
    } finally {
      setLoadingIzlazak(false)
    }
  }

  const formatirajVreme = (vreme: string | null) => {
    if (!vreme) return null
    return vreme.replace('T', ' ').substring(0, 16)
  }

  if (!istorija) return (
    <Typography sx={{ mt: 4, textAlign: 'center' }}>Učitavanje...</Typography>
  )

  const otvorenaPosteta = istorija.posete?.find((p: any) => p.otvorena)

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Istorija poseta — {istorija.ime} {istorija.prezime}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ukupno poseta: {istorija.ukupnoPoseta}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {otvorenaPosteta && (
            <Button variant="contained" color="error"
              onClick={handleIzlazak} disabled={loadingIzlazak}>
              Evidentiraj izlazak
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate(`/clanovi/${id}`)}>
            Nazad na profil
          </Button>
        </Box>
      </Box>

      {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}
      {istorija.poruka && (
        <Alert severity="info" sx={{ mb: 2 }}>{istorija.poruka}</Alert>
      )}

      {!istorija.posete || istorija.posete.length === 0 ? (
        <Alert severity="info">Nema evidentiranih poseta.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e8eaf6' }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Vreme ulaska</b></TableCell>
                <TableCell><b>Vreme izlaska</b></TableCell>
                <TableCell><b>Trajanje (min)</b></TableCell>
                <TableCell><b>Oprema</b></TableCell>
                <TableCell><b>Pratilac</b></TableCell>
                <TableCell><b>Upisnina</b></TableCell>
                <TableCell><b>Pokušaji</b></TableCell>
                <TableCell><b>Napomena</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {istorija.posete.map((p: any) => (
                <TableRow key={p.id} hover
                  sx={{ backgroundColor: p.otvorena ? '#f1f8e9' : 'inherit' }}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{formatirajVreme(p.vremeUlaska)}</TableCell>
                  <TableCell>
                    {p.otvorena
                      ? <Chip label="U sali" color="success" size="small" />
                      : formatirajVreme(p.vremeIzlaska)}
                  </TableCell>
                  <TableCell>{p.trajanje ?? '—'}</TableCell>
                  <TableCell>
                    {p.opremaNajam
                      ? <Chip label={`Da · ${p.iznosNajma} RSD`} size="small" color="primary" />
                      : <Chip label="Ne" size="small" variant="outlined" />}
                  </TableCell>
                  <TableCell>
                    <Chip label={p.pratilac ? 'Da' : 'Ne'} size="small"
                      color={p.pratilac ? 'primary' : 'default'}
                      variant={p.pratilac ? 'filled' : 'outlined'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={p.upisnina ? 'Da' : 'Ne'} size="small"
                      color={p.upisnina ? 'secondary' : 'default'}
                      variant={p.upisnina ? 'filled' : 'outlined'} />
                  </TableCell>
                  <TableCell>{p.brojPokusaja ?? 0}</TableCell>
                  <TableCell>{p.napomena || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}