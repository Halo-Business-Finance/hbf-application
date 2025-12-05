import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "gradient" | "success" | "warning";
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "default", showValue = false, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantClasses = {
    default: "bg-primary",
    gradient: "bg-gradient-primary",
    success: "bg-success",
    warning: "bg-warning",
  };

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 -top-6 text-xs font-medium text-muted-foreground">
          {Math.round(value || 0)}%
        </span>
      )}
    </div>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
