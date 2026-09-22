import type { ReactNode } from 'react'
import { Container, Paper, Stack, Typography } from '@mui/material'

type PageLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <Container maxWidth="lg" className="page-content">
      <Stack spacing={1} className="page-heading">
        <Typography variant="h4" component="h1">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
      <Paper elevation={0} variant="outlined" className="table-panel">
        {children}
      </Paper>
    </Container>
  )
}

export default PageLayout