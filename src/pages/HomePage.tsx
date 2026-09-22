import DataTable, { type RecordRow } from '../components/DataTable'
import PageLayout from '../layouts/PageLayout'

const homeRows: RecordRow[] = [
  { id: 'PRJ-1042', name: 'Website refresh', status: 'Active', updated: 'Today, 09:42' },
  { id: 'PRJ-1041', name: 'Customer export', status: 'In review', updated: 'Yesterday' },
  { id: 'PRJ-1038', name: 'Usage report', status: 'Active', updated: 'Sep 18, 2026' },
]

function HomePage() {
  return (
    <PageLayout title="Home" description="A quick view of the work currently in motion.">
      <DataTable rows={homeRows} />
    </PageLayout>
  )
}

export default HomePage