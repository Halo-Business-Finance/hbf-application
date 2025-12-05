import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  isActive?: boolean;
  direction?: "forward" | "backward";
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ title, description, icon: Icon, children, className, isActive = true, direction = "forward", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          isActive ? (direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left") : "hidden",
          className
        )}
        {...props}
      >
        {/* Section Header */}
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-5">
          {children}
        </div>
      </div>
    );
  }
);

FormSection.displayName = "FormSection";

// Form Row Component for consistent grid layouts
interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ cols = 2, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          cols === 1 && "grid-cols-1",
          cols === 2 && "grid-cols-1 md:grid-cols-2",
          cols === 3 && "grid-cols-1 md:grid-cols-3",
          cols === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormRow.displayName = "FormRow";

export { FormSection, FormRow };
