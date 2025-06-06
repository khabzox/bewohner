"use client"

import { Suspense } from "react"
import { ResidenceInfoCard } from "@/components/features/residence/residence-info-card"
import { InspectionChecklist } from "@/components/features/inspection/inspection-checklist"
import { RoomAssessment } from "@/components/features/inspection/room-assessment"
import { LiveStatistics } from "@/components/features/analytics/live-statistics"
import { ActivityTimeline } from "@/components/features/analytics/activity-timeline"
import { MaintenanceOrders } from "@/components/features/maintenance/maintenance-orders"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export function OverviewPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Column - Residence Management */}
      <div className="xl:col-span-2 space-y-6">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ResidenceInfoCard />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <InspectionChecklist />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <RoomAssessment />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Right Column - Analytics & History */}
      <div className="space-y-6">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <LiveStatistics />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ActivityTimeline />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <MaintenanceOrders />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
