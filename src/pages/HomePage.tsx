import { useEffect, useState } from 'react'
import { Alert, Box, Chip, CircularProgress } from '@mui/material'
import PageLayout from '../layouts/PageLayout'

type PingRecord = {
  id: string
  statusCode: number
  responseTime: number
  zScore: number | null
  isAnomaly: boolean | null
  payload: {
    title: string
    author: string
  }
}

function HomePage() {
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
          {hasConnectionError && (
            <Alert severity="warning" className="stream-alert">
              Connection interrupted. Waiting to reconnect.
            </Alert>
          )}
          <Box component="table" className="data-table home-table">
            <thead>
              <tr>
                <th scope="col">Status code</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Response time</th>
                <th scope="col">Z-score</th>
                <th scope="col">Anomaly</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Chip label={ping.statusCode} size="small" color="success" variant="outlined" /></td>
                <td>{ping.payload.title}</td>
                <td>{ping.payload.author}</td>
                <td>{ping.responseTime} ms</td>
                <td>{ping.zScore ?? '-'}</td>
                <td>{ping.isAnomaly === null ? '-' : ping.isAnomaly ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </Box>
        </>
      )}
    </PageLayout>
  )
}

export default HomePage