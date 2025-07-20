"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  gradient?: boolean;
  color?: "primary" | "success" | "warning" | "error";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  gradient = false,
  color = "primary",
}) => {
  const cardClass = gradient ? "stat-card-primary" : "stat-card-secondary";
  const textColor = gradient ? "text-white" : "text-foreground";
  const iconColor = gradient ? "text-white/80" : "text-primary";
  const descriptionColor = gradient ? "text-white/70" : "text-muted-foreground";

  return (
    <div className={cn(cardClass, "p-6")}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className={cn("text-sm font-medium", textColor)}>{title}</h3>
        {Icon && (
          <Icon className={cn("h-5 w-5", iconColor)} />
        )}
      </div>
      <div>
        <div className={cn("text-3xl font-bold", textColor)}>{value}</div>
        {description && (
          <p className={cn("text-xs", descriptionColor)}>{description}</p>
        )}
      </div>
    </div>
  );
}; 