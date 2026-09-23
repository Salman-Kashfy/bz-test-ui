import { useEffect, useState } from 'react'
import { Alert, Box, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material'
import PingRecordCard, { type PingRecord } from '../components/PingRecordCard'
import PageLayout from '../layouts/PageLayout'

function HomePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [ping, setPing] = useState<PingRecord | null>(null)
  const [hasConnectionError, setHasConnectionError] = useState(false)

  useEffect(() => {
  const eventSource = new EventSource(
    `${import.meta.env.VITE_API_BASE_URL}/api/ping/stream`,
  )

  eventSource.onopen = () => {
    setHasConnectionError(false)
  }

  const handlePing = (event: MessageEvent<string>) => {
      console.log('ping event received:', event.data)  // add this
    try {
      const nextPing = JSON.parse(event.data) as PingRecord
      setPing(nextPing)
      setHasConnectionError(false)
    } catch {
      console.error('Received an invalid ping event payload.')
    }
  }

  eventSource.addEventListener('ping', handlePing)

  eventSource.onerror = () => {
    setHasConnectionError(true)
  }

  return () => {
    eventSource.removeEventListener('ping', handlePing)
    eventSource.close()
  }
}, [])

  return (
    <PageLayout title="Home" description="The latest ping received from the live stream.">
      {!ping && !hasConnectionError && (
        <Box className="history-state">
          <CircularProgress size={28} aria-label="Waiting for a live ping" />
        </Box>
      )}
      {hasConnectionError && !ping && (
        <Alert severity="error">Unable to connect to the live ping stream.</Alert>
      )}
      {ping && (
        <>
          {ping.isAnomaly && (
            <Alert severity="error" className="stream-alert">
              Anomaly detected in the latest live ping.
            </Alert>
          )}
          {hasConnectionError && (
            <Alert severity="warning" className="stream-alert">
              Connection interrupted. Waiting to reconnect.
            </Alert>
          )}
          {isMobile ? (
            <Stack spacing={2} sx={{ p: 2 }}>
              <PingRecordCard record={ping} />
            </Stack>
          ) : (
            <TableContainer>
              <Table aria-label="Latest ping">
                <TableHead>
                  <TableRow>
                    <TableCell>Status code</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Response time</TableCell>
                    <TableCell>Forecast</TableCell>
                    <TableCell>Z-score</TableCell>
                    <TableCell>Anomaly</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell><Chip label={ping.statusCode} size="small" color="success" variant="outlined" /></TableCell>
                    <TableCell>{ping.payload.title}</TableCell>
                    <TableCell>{ping.payload.author}</TableCell>
                    <TableCell>{Number(ping.responseTime).toFixed(2)} ms</TableCell>
                    <TableCell>{Number(ping.fResponseTime).toFixed(2)} ms</TableCell>
                    <TableCell>{ping.zScore === null ? '-' : Number(ping.zScore).toFixed(2)}</TableCell>
                    <TableCell>{ping.isAnomaly === null ? '-' : ping.isAnomaly ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HomePage