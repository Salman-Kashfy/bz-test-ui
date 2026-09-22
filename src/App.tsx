import {
  AppBar,
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import {
  Link as RouterLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import './App.css'

type RecordRow = {
  id: string
  name: string
  status: string
  updated: string
}

const homeRows: RecordRow[] = [
  { id: 'PRJ-1042', name: 'Website refresh', status: 'Active', updated: 'Today, 09:42' },
  { id: 'PRJ-1041', name: 'Customer export', status: 'In review', updated: 'Yesterday' },
  { id: 'PRJ-1038', name: 'Usage report', status: 'Active', updated: 'Sep 18, 2026' },
]

const historyRows: RecordRow[] = [
  { id: 'EVT-592', name: 'Record updated', status: 'Completed', updated: 'Today, 08:25' },
  { id: 'EVT-591', name: 'Report generated', status: 'Completed', updated: 'Yesterday, 16:10' },
  { id: 'EVT-590', name: 'Access changed', status: 'Completed', updated: 'Sep 19, 2026' },
]

function DataTable({ rows }: { rows: RecordRow[] }) {
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

function PageLayout({ title, description, rows }: { title: string; description: string; rows: RecordRow[] }) {
  return (
    <Container maxWidth="lg" className="page-content">
      <Stack spacing={1} className="page-heading">
        <Typography variant="h4" component="h1">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
      <Paper elevation={0} variant="outlined" className="table-panel">
        <DataTable rows={rows} />
      </Paper>
    </Container>
  )
}

function Navigation() {
  const location = useLocation()
  const activePath = location.pathname === '/history' ? '/history' : '/'

  return (
    <AppBar position="static" color="inherit" elevation={0} className="app-bar">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">
          <Typography variant="h6" component="div" className="product-name">Workspace</Typography>
          <Tabs value={activePath} aria-label="Main navigation">
            <Tab value="/" label="Home" icon={<DashboardOutlinedIcon fontSize="small" />} iconPosition="start" component={RouterLink} to="/" />
            <Tab value="/history" label="History" icon={<HistoryOutlinedIcon fontSize="small" />} iconPosition="start" component={RouterLink} to="/history" />
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

function App() {
  return (
    <Box className="app-shell">
      <Navigation />
      <Box component="main">
        <Routes>
          <Route path="/" element={<PageLayout title="Home" description="A quick view of the work currently in motion." rows={homeRows} />} />
          <Route path="/history" element={<PageLayout title="History" description="Recent activity across your workspace." rows={historyRows} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
