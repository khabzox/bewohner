import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OverviewPage } from "@/components/pages/overview-page"

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <OverviewPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
