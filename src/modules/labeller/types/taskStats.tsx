export interface TaskStats {
  // Distribution for Donut Charts
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;

  // Productivity Metrics
  completionRate: number; // e.g., 85%
  averageCompletionTime: string; // e.g., "2d 4h"
  
  // Categorization
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  
  // Weekly Velocity 
  weeklyTrend: {
    date: string;
    completed: number;
    created: number;
  }[];
}