import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-base text-ink outline-none placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
