// ui/components/Card.tsx
import React from "react";
import { cn } from "@/shared/lib/CommonUtils";

type CardProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export const Card = ({ title, description, children, className }: CardProps) => {
  return (
    <div className={cn("rounded-2xl border p-4 shadow-md bg-white", className)}>
      {title && <h1 className="text-lg font-semibold mb-1">{title}</h1>}
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      {children}
    </div>
  );
};