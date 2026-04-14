import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { chartTheme } from "./chartTheme";

const barColors = [
  chartTheme.colors.primary,
  chartTheme.colors.secondary,
  chartTheme.colors.tertiary,
];

const FeatureUsageChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={data || []} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
        <XAxis
          dataKey="feature"
          tick={{ fill: chartTheme.colors.axisText, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.colors.grid }}
          tickLine={{ stroke: chartTheme.colors.grid }}
        />
        <YAxis
          tick={{ fill: chartTheme.colors.axisText, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.colors.grid }}
          tickLine={{ stroke: chartTheme.colors.grid }}
        />
        <Tooltip
          contentStyle={chartTheme.tooltipStyle}
          labelStyle={{ color: chartTheme.colors.tooltipText }}
          itemStyle={{ color: chartTheme.colors.tooltipText }}
          formatter={(value) => [`${value}`, "Usage Count"]}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {(data || []).map((entry, index) => (
            <Cell key={entry.feature} fill={barColors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeatureUsageChart;