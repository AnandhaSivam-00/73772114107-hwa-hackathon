import * as React from "react";
import { cn } from "@/lib/utils";

function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      data-slot="progress"
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-sand",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-olive transition-[width] duration-700 ease-out",
          indicatorClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };