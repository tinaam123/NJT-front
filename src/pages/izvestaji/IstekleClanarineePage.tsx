import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Chip, Container, MenuItem, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Alert
} from '@mui/material'
import { getIstekleClanarine } from '../../api/istekleClanarinaApi'

export default function IstekleClanarineePage() {
  const navigate = useNavigate()
  const [lista, setLista] = useState<any>(null)
  const [filterTip, setFilterTip] = useState('ISTEKLE')
  const [brojiDana, setBrojiDana] = useState('30')
  const [greska, setGreska] = useState('')

  const ucitaj = async () => {
    setGreska('')
    try {
      const res = await getIstekleClanarine(
        filterTip,
        filterTip === 'ISTICA' ? parseInt(brojiDana) : undefined
      )
      setLista(res.data)
    } catch {
      setGreska('Greška pri učitavanju.')
    }
  }

  useEffect(() => { ucitaj() }, [])

  const chipColor = (danaDo: number) => {
    if (danaDo < 0) return 'error'
    if (danaDo <= 7) return 'warning'
    return 'success'
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e', mb: 3 }}>
        Pregled članarina
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField select label="Filter" value={filterTip}
            onChange={e => setFilterTip(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="ISTEKLE">Istekle članarine</MenuItem>
            <MenuItem value="ISTICA">Ističu uskoro</MenuItem>
          </TextField>

          {filterTip === 'ISTICA' && (
            <TextField label="Broj dana" type="number" value={brojiDana}
              onChange={e => setBrojiDana(e.target.value)} sx={{ width: 140 }} />
          )}

          <Button variant="contained" onClick={ucitaj}
            sx={{ backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
            Prikaži
          </Button>
        </Box>
      </Paper>

      {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

      {lista && (
        <>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#555' }}>
              Ukupno pronađeno:
            </Typography>
            <Chip label={lista.ukupniBroj} color="primary" />
          </Box>

          <TableContainer component={Paper} elevation={0}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0faf9' }}>
                <TableRow>
                  <TableCell><b>Ime i prezime</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Telefon</b></TableCell>
                  <TableCell><b>Tip članarine</b></TableCell>
                  <TableCell><b>Datum isteka</b></TableCell>
                  <TableCell><b>Iznos</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Akcije</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lista.clanarine?.map((c: any) => (
                  <TableRow key={c.clanId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{c.ime} {c.prezime}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.telefon}</TableCell>
                    <TableCell>
                      <Chip label={c.tipClanarine} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{c.datumIsteka}</TableCell>
                    <TableCell>{c.iznos} RSD</TableCell>
                    <TableCell>
                      <Chip label={c.statusPrikaz} size="small"
                        color={chipColor(c.danaDo)} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined"
                        onClick={() => navigate(`/clanovi/${c.clanId}`)}
                        sx={{ borderColor: '#0d2b4e', color: '#0d2b4e', borderRadius: 2 }}>
                        Profil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!lista.clanarine?.length && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: '#888' }}>
                      Nema rezultata za izabrani filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  )
}