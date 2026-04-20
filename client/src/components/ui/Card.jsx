import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, glass = true, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 p-6 shadow-xl",
        glass ? "bg-zinc-900/40 backdrop-blur-lg" : "bg-zinc-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-xl font-semibold leading-none tracking-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-zinc-400", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center pt-4 mt-4 border-t border-zinc-800/50", className)} {...props}>
      {children}
    </div>
  );
}
