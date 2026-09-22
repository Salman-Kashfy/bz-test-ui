import DataTable, { type RecordRow } from '../components/DataTable'
import PageLayout from '../layouts/PageLayout'

const historyRows: RecordRow[] = [
  { id: 'EVT-592', name: 'Record updated', status: 'Completed', updated: 'Today, 08:25' },
  { id: 'EVT-591', name: 'Report generated', status: 'Completed', updated: 'Yesterday, 16:10' },
  { id: 'EVT-590', name: 'Access changed', status: 'Completed', updated: 'Sep 19, 2026' },
]

function HistoryPage() {
  return (
    <PageLayout title="History" description="Recent activity across your workspace.">
      <DataTable rows={historyRows} />
    </PageLayout>
  )
}

export default HistoryPage