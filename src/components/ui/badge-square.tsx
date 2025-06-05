import { cn } from "@/lib/utils";

interface BadgeSquareProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
}

export function BadgeSquare({ className, color = "#000000", ...props }: BadgeSquareProps) {
  return (
    <div
      className={cn("w-3 h-3 rounded-sm", className)}
      style={{ backgroundColor: color }}
      {...props}
    />
  );
}
