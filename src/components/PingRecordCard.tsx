import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

export type PingRecord = {
  id: string
  statusCode: number
  responseTime: number | string
  fResponseTime: number | string
  zScore: number | string | null
  isAnomaly: boolean | null
  payload: {
    title: string
    author: string
  }
}

type PingRecordCardProps = {
  record: PingRecord
}

function formatNumber(value: number | string | null) {
  return value === null ? '-' : Number(value).toFixed(2)
}

function PingRecordCard({ record }: PingRecordCardProps) {
  const fields = [
    ['Author', record.payload.author],
    ['Response time', `${formatNumber(record.responseTime)} ms`],
    ['Forecast', `${formatNumber(record.fResponseTime)} ms`],
    ['Z-score', formatNumber(record.zScore)],
    ['Anomaly', record.isAnomaly === null ? '-' : record.isAnomaly ? 'Yes' : 'No'],
  ]

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
              {record.payload.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="span">
              {record.statusCode}
            </Typography>
          </Stack>
          {fields.map(([label, value]) => (
            <Stack key={label} direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" component="span">
                {label}:
              </Typography>
              <Box component="span" sx={{ typography: 'body2' }}>
                {value}
              </Box>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PingRecordCard
