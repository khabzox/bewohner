import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserManagement } from "@/components/features/admin/user-management"

export default function UsersPage() {
  return (
    <AuthGuard requiredRole="admin">
      <DashboardLayout>
        <UserManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}
