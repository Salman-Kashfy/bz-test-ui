import { useEffect, useState } from 'react'
import { Alert, Box, Chip, CircularProgress, Pagination, Typography } from '@mui/material'
import axios from 'axios'
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
  const [records, setRecords] = useState<PingRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PingListResponse['data']['pagination'] | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
          <Box component="table" className="data-table history-table">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Response time</th>
                <th scope="col">Z-score</th>
                <th scope="col">Anomaly</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td><Chip label={record.statusCode} size="small" color="success" variant="outlined" /></td>
                  <td>{record.payload.title}</td>
                  <td>{record.payload.author}</td>
                  <td>{record.responseTime} ms</td>
                  <td>{record.zScore ?? '-'}</td>
                  <td>{record.isAnomaly === null ? '-' : record.isAnomaly ? 'Yes' : 'No'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">No history records found.</td>
                </tr>
              )}
            </tbody>
          </Box>
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