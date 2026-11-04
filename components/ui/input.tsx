import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-xl border-2 border-ink bg-paper px-3 text-base text-ink outline-none placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
