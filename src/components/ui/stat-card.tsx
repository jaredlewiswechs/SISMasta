import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { type LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; positive: boolean };
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

function StatCard({ title, value, icon: Icon, description, trend, iconColor, iconBg, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}% from last week
              </p>
            )}
          </div>
          <div className={cn("rounded-lg p-3", iconBg || "bg-indigo-50")}>
            <Icon className={cn("h-6 w-6", iconColor || "text-indigo-600")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
