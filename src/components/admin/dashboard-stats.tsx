import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  FileText, 
  Users, 
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => (
  <Card className="p-6 space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
    </div>
    <div className="flex items-baseline space-x-2">
      <h2 className="text-2xl font-bold">{value}</h2>
      {trend && (
        <span className="text-sm text-green-500 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </span>
      )}
    </div>
  </Card>
);

interface DashboardStatsProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  isLoading?: boolean;
}

export function DashboardStats({
  totalPosts,
  publishedPosts,
  draftPosts,
  totalCategories,
  isLoading = false,
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Posts"
        value={totalPosts}
        icon={<FileText className="w-4 h-4 text-primary" />}
      />
      <StatsCard
        title="Published Posts"
        value={publishedPosts}
        icon={<BookOpen className="w-4 h-4 text-primary" />}
        trend="+5% this week"
      />
      <StatsCard
        title="Draft Posts"
        value={draftPosts}
        icon={<FileText className="w-4 h-4 text-primary" />}
      />
      <StatsCard
        title="Categories"
        value={totalCategories}
        icon={<Users className="w-4 h-4 text-primary" />}
      />
    </div>
  );
}
