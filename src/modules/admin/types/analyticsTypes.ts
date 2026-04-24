export type AnalyticsOverview = {
  users: {
    total: number
    newToday: number
    newThisMonth: number
  }
  datasets: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  revenue: {
    thisMonth: number
    netWorth: number
  }
}

export type LabellerStats = {
  totalLabellers: number
  activeLabellers: number
  statusDistribution: Array<{ status: string; count: number; percentage: string }>
  performanceMetrics: {
    avgQualityScore: number
    avgCompletionRate: number
    avgApprovalRate: number
    avgReliabilityScore: number
    medianEarnings: number
  }
  performanceDistribution: Array<{ scoreRange: string; count: number; percentage: string }>
  byTier: Array<{ tier: string; count: number; avgQualityScore: number; avgReliabilityScore: number; totalTasksCompleted: number; totalEarnings: number }>
}

export type LabellerPerformance = {
  distribution: Array<{ scoreRange: string; count: number; percentage: string }>
}

export type LabellerTiers = {
  byTier: Array<{ tier: string; count: number; avgQualityScore: number; avgReliabilityScore: number; totalTasksCompleted: number; totalEarnings: number }>
}

export type LabellerEarnings = {
  totals: {
    totalEarned: number
    totalPaid: number
    totalPending: number
    totalLabellers: number
  }
  distribution: Array<{ earningsRange: string; count: number; percentage: string }>
  topEarners: Array<{ rank: number; labellerName: string; tier: string; totalEarned: number; tasksCompleted: number; avgQualityScore: number }>
}

export type LabellerActivity = {
  activeLast7Days: number
  activeLast30Days: number
  inactive30Plus: number
  totalActive: number
  activityRate7d: string
  activityRate30d: string
}

export type TaskCompletion = {
  totalTasksAssigned: number
  totalTasksCompleted: number
  totalTasksRejected: number
  completionRate: string
  rejectionRate: string
  avgTasksPerLabeller: number
}

export type LabellerRatings = {
  averageRating: { avgRating: number; totalRatings: number }
  distribution: Array<{ ratingBucket: string; count: number; percentage: string }>
}

export type Analytics = {
  overview: AnalyticsOverview | null
  error: string | null
  setError: (error: string | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  getAnalytics: () => Promise<AnalyticsOverview | void>
}

export type LabellerAnalyticsState = {
  labellerOverview: LabellerStats | null
  labellerPerformance: LabellerPerformance | null
  labellerTiers: LabellerTiers | null
  labellerEarnings: LabellerEarnings | null
  labellerActivity: LabellerActivity | null
  labellerTaskCompletion: TaskCompletion | null
  labellerRatings: LabellerRatings | null
  loading: boolean
  error: string | null
  fetchLabellerAnalytics: () => Promise<void>
  setError: (error: string | null) => void
}

export type TasksQueueHealth = {
  pending: number
  assigned: number
  completed: number
  rejected: number
  inReview: number
}

export type TasksVelocity = {
  tasksPerDay: number
  avgCompletionTime: number
  avgAssignmentTime: number
  avgReviewTime: number
  tasksCompleted7Days: number
  tasksCompleted30Days: number
}

export type TasksDistribution = {
  byStatus: Array<{ status: string; count: number; percentage: string }>
  byDataset: Array<{ datasetName: string; count: number; percentage: string }>
  byDifficulty: Array<{ difficulty: string; count: number; percentage: string }>
}

export type TasksQualityMetrics = {
  avgRejectionRate: string
  reworkRate: string
  avgQualityScore: number
  approvalRate: string
}

export type TopDatasets = {
  datasetId: string
  datasetName: string
  totalTasks: number
  completedTasks: number
  rejectedTasks: number
  avgCompletionTime: number
  costPerTask: number
}

export type TasksAnalyticsState = {
  queueHealth: TasksQueueHealth | null
  velocity: TasksVelocity | null
  distribution: TasksDistribution | null
  qualityMetrics: TasksQualityMetrics | null
  topDatasets: TopDatasets[] | null
  loading: boolean
  error: string | null
  fetchTasksAnalytics: () => Promise<void>
  setError: (error: string | null) => void
}
