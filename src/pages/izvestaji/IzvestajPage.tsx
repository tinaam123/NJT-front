import { useState } from 'react'
import {
  Box, Button, Container, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Alert, Divider, Chip
} from '@mui/material'
import { getIzvestajPosecenosti, downloadIzvestajCsv } from '../../api/izvestajApi'
import DownloadIcon from '@mui/icons-material/Download'

export default function IzvestajPage() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [izvestaj, setIzvestaj] = useState<any>(null)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)

  const formatirajDateTime = (date: string, time: string) =>
    `${date}T${time || '00:00:00'}`

  const handleGenerate = async () => {
    if (!start || !end) {
      setGreska('Oba datuma su obavezna.')
      return
    }
    setLoading(true)
    setGreska('')
    try {
      const res = await getIzvestajPosecenosti(
        formatirajDateTime(start, '00:00:00'),
        formatirajDateTime(end, '23:59:59')
      )
      setIzvestaj(res.data)
    } catch (err: any) {
      setGreska(err.response?.data?.message || 'Greška pri generisanju izveštaja.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCsv = async () => {
    try {
      const res = await downloadIzvestajCsv(
        formatirajDateTime(start, '00:00:00'),
        formatirajDateTime(end, '23:59:59')
      )
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `izvestaj_${start}_${end}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      setGreska('Greška pri preuzimanju CSV-a.')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0d2b4e', mb: 3 }}>
        Izveštaj o posećenosti
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0d2b4e' }}>
          Izaberi period
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#888' }}>Od datuma</Typography>
            <input type="date" value={start} onChange={e => setStart(e.target.value)}
              style={{
                display: 'block', padding: '10px 14px', borderRadius: 8,
                border: '1px solid #ccc', fontSize: 14, marginTop: 4
              }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#888' }}>Do datuma</Typography>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)}
              style={{
                display: 'block', padding: '10px 14px', borderRadius: 8,
                border: '1px solid #ccc', fontSize: 14, marginTop: 4
              }} />
          </Box>
          <Button variant="contained" onClick={handleGenerate} disabled={loading}
            sx={{ mt: 2.5, backgroundColor: '#0d2b4e', borderRadius: 2, '&:hover': { backgroundColor: '#1a5276' } }}>
            Generiši izveštaj
          </Button>
          {izvestaj && (
            <Button variant="outlined" startIcon={<DownloadIcon />}
              onClick={handleDownloadCsv}
              sx={{ mt: 2.5, borderColor: '#2ec4b6', color: '#2ec4b6', borderRadius: 2 }}>
              Preuzmi CSV
            </Button>
          )}
        </Box>
      </Paper>

      {greska && <Alert severity="error" sx={{ mb: 2 }}>{greska}</Alert>}

      {izvestaj && (
        <>
          {/* Statistike */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
            {[
              { label: 'Ukupno poseta', value: izvestaj.brojPoseta, color: '#e8f8f7' },
              { label: 'Prosečno trajanje', value: `${izvestaj.prosecnoTrajanjeMin?.toFixed(0) ?? '—'} min`, color: '#eaf2fb' },
              { label: 'Period od', value: izvestaj.periodStart?.substring(0, 10), color: '#fef9e7' },
              { label: 'Period do', value: izvestaj.periodEnd?.substring(0, 10), color: '#fdebd0' },
            ].map(({ label, value, color }) => (
              <Paper key={label} elevation={0} sx={{
                p: 3, borderRadius: 3, backgroundColor: color,
                border: '1px solid #e0e0e0', textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d2b4e' }}>{value}</Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>{label}</Typography>
              </Paper>
            ))}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Najaktivniji članovi */}
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d2b4e', mb: 2 }}>
            Najaktivniji članovi
          </Typography>
          <TableContainer component={Paper} elevation={0}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0faf9' }}>
                <TableRow>
                  <TableCell><b>#</b></TableCell>
                  <TableCell><b>Ime i prezime</b></TableCell>
                  <TableCell><b>Broj poseta</b></TableCell>
                  <TableCell><b>Ukupno trajanje (min)</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {izvestaj.najaktivnijiClanovi?.map((c: any, i: number) => (
                  <TableRow key={c.clanId} hover>
                    <TableCell>
                      <Chip label={i + 1} size="small"
                        sx={{ backgroundColor: i === 0 ? '#fef9e7' : '#f5f5f5', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{c.imePrezime}</TableCell>
                    <TableCell>{c.brojPoseta}</TableCell>
                    <TableCell>{c.ukupnoTrajanjeMin}</TableCell>
                  </TableRow>
                ))}
                {!izvestaj.najaktivnijiClanovi?.length && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: '#888' }}>
                      Nema podataka.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Posete po danu */}
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d2b4e', mb: 2 }}>
            Posete po danu
          </Typography>
          <TableContainer component={Paper} elevation={0}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0faf9' }}>
                <TableRow>
                  <TableCell><b>Dan</b></TableCell>
                  <TableCell><b>Broj poseta</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {izvestaj.posetePoDanu?.map((p: any) => (
                  <TableRow key={p.dan} hover>
                    <TableCell>{p.dan}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          height: 8, borderRadius: 4, backgroundColor: '#2ec4b6',
                          width: `${Math.min(p.brojPoseta * 20, 200)}px`
                        }} />
                        {p.brojPoseta}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {!izvestaj.posetePoDanu?.length && (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 3, color: '#888' }}>
                      Nema podataka.
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