import { cn } from '@/lib/utils';

interface AdUnitProps {
  className?: string;
  format: 'banner' | 'sidebar' | 'in-article';
  placeholder?: boolean;
}

export default function AdUnit({ className, format, placeholder = false }: AdUnitProps) {
  const formats = {
    'banner': 'h-[90px] w-full', // Leaderboard banner (728x90)
    'sidebar': 'h-[600px] w-[300px]', // Large skyscraper
    'in-article': 'h-[250px] w-full md:w-[728px]', // In-article ad
  };

  return (
    <div className={cn(
      'bg-muted/20 flex items-center justify-center mx-auto',
      formats[format],
      className
    )}>
      {placeholder && (
        <p className="text-muted-foreground text-sm">Advertisement</p>
      )}
      {/* Replace this div with actual ad code in production */}
    </div>
  );
}
