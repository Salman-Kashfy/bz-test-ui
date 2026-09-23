import { useEffect, useState } from 'react'
import { Alert, Box, Chip, CircularProgress, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios'
import PingRecordCard, { type PingRecord } from '../components/PingRecordCard'
import PageLayout from '../layouts/PageLayout'

type PingListResponse = {
  status: boolean
  data: {
    data: PingRecord[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

function HistoryPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [records, setRecords] = useState<PingRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PingListResponse['data']['pagination'] | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const latestRecord = currentPage === 1 ? records[0] : null

  useEffect(() => {
    const controller = new AbortController()

    async function loadHistory() {
      try {
        setIsLoading(true)
        setError('')
        const response = await axios.get<PingListResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/ping/list`,
          {
            params: { page: currentPage },
            signal: controller.signal,
          },
        )

        setRecords(response.data.data.data)
        setPagination(response.data.data.pagination)
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError('Unable to load history. Check that the API is running.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadHistory()
    return () => controller.abort()
  }, [currentPage])

  return (
    <PageLayout title="History" description="Recent activity across your workspace.">
      {isLoading && (
        <Box className="history-state">
          <CircularProgress size={28} aria-label="Loading history" />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!isLoading && !error && (
        <>
          {latestRecord?.isAnomaly && (
            <Alert severity="error" className="stream-alert">
              Anomaly detected in the latest history record.
            </Alert>
          )}
          {isMobile ? (
            <Stack spacing={2} sx={{ p: 2 }}>
              {records.map((record) => <PingRecordCard key={record.id} record={record} />)}
              {records.length === 0 && <Box className="empty-cell">No history records found.</Box>}
            </Stack>
          ) : (
            <TableContainer>
              <Table aria-label="Ping history">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Response time</TableCell>
                    <TableCell>Forecast</TableCell>
                    <TableCell>Z-score</TableCell>
                    <TableCell>Anomaly</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record) => (
                    <TableRow hover key={record.id}>
                      <TableCell><Chip label={record.statusCode} size="small" color="success" variant="outlined" /></TableCell>
                      <TableCell>{record.payload.title}</TableCell>
                      <TableCell>{record.payload.author}</TableCell>
                      <TableCell>{Number(record.responseTime).toFixed(2)} ms</TableCell>
                      <TableCell>{Number(record.fResponseTime).toFixed(2)} ms</TableCell>
                      <TableCell>{record.zScore === null ? '-' : Number(record.zScore).toFixed(2)}</TableCell>
                      <TableCell>{record.isAnomaly === null ? '-' : record.isAnomaly ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                  {records.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No history records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {pagination && pagination.totalPages > 1 && (
            <Box className="pagination-bar">
              <Typography variant="body2" color="text.secondary">
                {pagination.total} records, {pagination.limit} per page
              </Typography>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HistoryPage