import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface FormProgressStep {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

interface FormProgressProps {
  steps: FormProgressStep[];
  currentStep: number;
  className?: string;
}

const FormProgress = React.forwardRef<HTMLDivElement, FormProgressProps>(
  ({ steps, currentStep, className }, ref) => {
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {/* Mobile: Compact Progress Bar */}
        <div className="md:hidden space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {steps[currentStep - 1]?.title}
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop: Full Step Indicator */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
            
            {/* Progress Line Active */}
            <div 
              className="absolute top-5 left-0 h-0.5 bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;
                const isPending = stepNumber > currentStep;
                const StepIcon = step.icon;

                return (
                  <div 
                    key={index}
                    className="flex flex-col items-center"
                    style={{ width: `${100 / steps.length}%` }}
                  >
                    {/* Step Circle */}
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                        isCompleted && "bg-primary border-primary text-primary-foreground shadow-primary",
                        isActive && "bg-background border-primary text-primary shadow-lg shadow-primary/20 scale-110",
                        isPending && "bg-muted border-border text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 animate-scale-in" />
                      ) : StepIcon ? (
                        <StepIcon className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{stepNumber}</span>
                      )}
                      
                      {/* Active Pulse Ring */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="mt-3 text-center">
                      <p className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        isCompleted && "text-primary",
                        isActive && "text-foreground",
                        isPending && "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                      {step.description && (
                        <p className={cn(
                          "text-xs mt-0.5 transition-colors duration-300",
                          isCompleted && "text-primary/70",
                          isActive && "text-muted-foreground",
                          isPending && "text-muted-foreground/70"
                        )}>
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FormProgress.displayName = "FormProgress";

export { FormProgress, type FormProgressStep };
