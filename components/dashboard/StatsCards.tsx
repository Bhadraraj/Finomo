"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Debt",
    value: "₹8,45,000",
    change: "-5.2%",
    icon: TrendingDown,
    bgColor: "bg-teal-50 dark:bg-teal-900",
    iconColor: "text-teal-600 dark:text-teal-400",
    textColor: "text-teal-900 dark:text-teal-100",
  },
  {
    title: "Monthly EMI",
    value: "₹39,200",
    change: "+2.1%",
    icon: CreditCard,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-900 dark:text-blue-100",
  },
  {
    title: "AI Savings",
    value: "₹3,500",
    subtext: "per month",
    icon: Sparkles,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-900 dark:text-green-100",
  },
  {
    title: "Credit Score",
    value: "752",
    change: "+12 points",
    icon: TrendingUp,
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    textColor: "text-violet-900 dark:text-violet-100",
  },
];

const StatsCards = memo(function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={cn(
            "p-4 sm:p-6 border-0 transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl",
            stat.bgColor
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium opacity-70",
                  stat.textColor
                )}
              >
                {stat.title}
              </p>

              <p
                className={cn(
                  "text-xl sm:text-lg font-bold mt-1",
                  stat.textColor
                )}
              >
                {stat.value}
              </p>

              {stat.change && (
                <p className={cn("text-xs mt-1 opacity-70", stat.textColor)}>
                  {stat.change}
                </p>
              )}

              {stat.subtext && (
                <p className={cn("text-xs mt-1 opacity-70", stat.textColor)}>
                  {stat.subtext}
                </p>
              )}
            </div>

            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center",
                "bg-white/50 dark:bg-white/10"
              )}
            >
              <stat.icon
                className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.iconColor)}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});

export default StatsCards;
