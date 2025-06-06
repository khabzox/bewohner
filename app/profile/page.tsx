import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProfileManagement } from "@/components/features/profile/profile-management"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ProfileManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}
