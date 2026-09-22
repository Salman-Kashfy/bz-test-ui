import { Box, Chip } from '@mui/material'

export type RecordRow = {
  id: string
  name: string
  status: string
  updated: string
}

type DataTableProps = {
  rows: RecordRow[]
}

function DataTable({ rows }: DataTableProps) {
  return (
    <Box component="table" className="data-table">
      <thead>
        <tr>
          <th scope="col">Reference</th>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
          <th scope="col">Last updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td><Chip label={row.status} size="small" color="success" variant="outlined" /></td>
            <td>{row.updated}</td>
          </tr>
        ))}
      </tbody>
    </Box>
  )
}

export default DataTable