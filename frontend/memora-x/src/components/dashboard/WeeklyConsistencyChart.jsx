import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartTheme } from "./chartTheme";

const WeeklyConsistencyChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data || []} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
        <defs>
          <linearGradient id="weeklyConsistencyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartTheme.colors.primary} stopOpacity={0.4} />
            <stop offset="95%" stopColor={chartTheme.colors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
        <XAxis
          dataKey="day"
          tick={{ fill: chartTheme.colors.axisText, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.colors.grid }}
          tickLine={{ stroke: chartTheme.colors.grid }}
        />
        <YAxis
          domain={[0, 5]}
          tick={{ fill: chartTheme.colors.axisText, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.colors.grid }}
          tickLine={{ stroke: chartTheme.colors.grid }}
        />
        <Tooltip
          contentStyle={chartTheme.tooltipStyle}
          labelStyle={{ color: chartTheme.colors.tooltipText }}
          itemStyle={{ color: chartTheme.colors.tooltipText }}
          formatter={(value) => [`${value} sessions`, "Sessions"]}
        />
        <Area
          type="monotone"
          dataKey="sessions"
          stroke={chartTheme.colors.primary}
          fillOpacity={1}
          fill="url(#weeklyConsistencyGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WeeklyConsistencyChart;