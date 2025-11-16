"use client";

import React, { memo, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = {
  name: string;
  personal: number;
  car: number;
  credit: number;
  __idx?: number;
  payloadsRef?: Point[];
};

const weekly: Point[] = [
  { name: "Mon", personal: 60000,  car: 250000, credit: 180000 },
  { name: "Tue", personal: 82000,  car: 295000, credit: 210000 }, // huge jump
  { name: "Wed", personal: 54000,  car: 240000, credit: 165000 }, // deep drop
  { name: "Thu", personal: 96000,  car: 310000, credit: 225000 }, // strong spike
  { name: "Fri", personal: 70000,  car: 270000, credit: 195000 }, // dip
  { name: "Sat", personal: 115000, car: 330000, credit: 245000 }, // highest peak
  { name: "Sun", personal: 68000,  car: 260000, credit: 185000 }, // ends with drop
];


const monthly: Point[] = [
  { name: "Week 1", personal: 400000, car: 300000, credit: 230000 },
  { name: "Week 2", personal: 385000, car: 292000, credit: 225000 },
  { name: "Week 3", personal: 370000, car: 288000, credit: 221000 },
  { name: "Week 4", personal: 355000, car: 283000, credit: 218000 },
];

const yearly: Point[] = [
  { name: "Jan", personal: 600000, car: 420000, credit: 260000 },
  { name: "Feb", personal: 580000, car: 410000, credit: 255000 },
  { name: "Mar", personal: 560000, car: 395000, credit: 250000 },
  { name: "Apr", personal: 540000, car: 380000, credit: 245000 },
  { name: "May", personal: 520000, car: 365000, credit: 240000 },
  { name: "Jun", personal: 500000, car: 350000, credit: 235000 },
  { name: "Jul", personal: 480000, car: 335000, credit: 230000 },
  { name: "Aug", personal: 460000, car: 320000, credit: 225000 },
  { name: "Sep", personal: 440000, car: 305000, credit: 222000 },
  { name: "Oct", personal: 420000, car: 295000, credit: 219000 },
  { name: "Nov", personal: 400000, car: 285000, credit: 216000 },
  { name: "Dec", personal: 380000, car: 275000, credit: 215000 },
];

/** Helpers */
function formatRupee(value: number) {
  return `₹${Number(value).toLocaleString()}`;
}

/** Dark-mode aware tooltip that shows delta vs previous point */
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  // Safe dark detection (SSR-safe)
  const isDark =
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("dark") ||
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  const boxClasses = isDark
    ? "bg-slate-800 text-slate-100 border border-slate-700 shadow-md"
    : "bg-white text-gray-900 border border-gray-200 shadow-md";
  const labelClasses = isDark ? "text-slate-300" : "text-gray-600";

  return (
    <div className={`${boxClasses} rounded-md p-3 text-sm`} style={{ minWidth: 220 }}>
      <div className={`font-semibold mb-1 ${labelClasses}`}>{label}</div>

      <div className="space-y-1">
        {payload.map((p: any) => {
          // p: { name: seriesName, value, stroke, dataKey, payload }
          const seriesName: string = p.name ?? p.dataKey;
          const value: number = p.value;
          const idx: number = p.payload?.__idx ?? 0;
          const all: Point[] | undefined = p.payload?.payloadsRef;

          let deltaText = "";
          let deltaIsIncrease = false;
          if (all && idx > 0) {
            const prev = (all[idx - 1] as any)[p.dataKey] as number;
            const delta = value - prev;
            deltaIsIncrease = delta > 0;
            const sign = delta > 0 ? "+" : "-";
            deltaText = `${sign}₹${Math.abs(delta).toLocaleString()}`;
          }

          const deltaClass = deltaText
            ? deltaIsIncrease
              ? "text-red-400"
              : "text-emerald-400"
            : isDark
            ? "text-slate-300"
            : "text-gray-500";

          return (
            <div key={p.dataKey || seriesName} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ background: p.stroke }} />
                <span className={isDark ? "text-slate-100" : "text-gray-700"}>{seriesName}</span>
              </div>

              <div className="text-sm font-medium flex items-center gap-3">
                <span className={isDark ? "text-slate-100" : "text-gray-900"}>{formatRupee(value)}</span>
                {deltaText ? <span className={`${deltaClass} text-xs font-semibold`}>{deltaText}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DebitReductionChart = memo(function DebitReductionChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const chartData = useMemo(() => {
    if (period === "weekly") return weekly;
    if (period === "yearly") return yearly;
    return monthly;
  }, [period]);

  // enrich data for tooltip delta computation
  const enriched = useMemo(() => chartData.map((d, i) => ({ ...d, __idx: i, payloadsRef: chartData })), [chartData]);

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Debt Reduction Trend</CardTitle>

        <div className="flex items-center space-x-4">
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as "weekly" | "monthly" | "yearly")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enriched}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value: number) => `₹${Math.round(value / 1000)}k`}
              />

              {/* Use our custom tooltip */}
              <Tooltip content={<CustomTooltip />} />

              <Legend />

              <Line
                type="monotone"
                dataKey="personal"
                name="Personal Loan"
                stroke="#14B8A6"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="car"
                name="Car Loan"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="credit"
                name="Credit Card"
                stroke="#A855F7"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export default DebitReductionChart;
