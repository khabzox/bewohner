import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuftraegePage } from "@/components/pages/auftraege-page"

export default function AuftraegePageRoute() {
  return (
    <DashboardLayout>
      <AuftraegePage />
    </DashboardLayout>
  )
}
