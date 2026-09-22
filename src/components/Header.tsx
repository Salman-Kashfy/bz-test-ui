import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import {
  AppBar,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const activePath = location.pathname === '/history' ? '/history' : '/'

  return (
    <AppBar position="static" color="inherit" elevation={0} className="app-bar">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="toolbar">
          <Typography variant="h6" component="div" className="product-name">
            Workspace
          </Typography>
          <Tabs value={activePath} aria-label="Main navigation">
            <Tab value="/" label="Home" icon={<DashboardOutlinedIcon fontSize="small" />} iconPosition="start" component={RouterLink} to="/" />
            <Tab value="/history" label="History" icon={<HistoryOutlinedIcon fontSize="small" />} iconPosition="start" component={RouterLink} to="/history" />
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header