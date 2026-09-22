import { Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import './App.css'

function App() {
  return (
    <Box className="app-shell">
      <Header />
      <Box component="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
