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

const QuizPerformanceChart = ({ data }) => {
  const processedData = (data || []).map((entry, index) => ({
    ...entry,
    uniqueAttempt: `${entry.attempt} (Attempt ${index + 1})`
  }));

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={processedData} margin={{ top: 8, right: 16, left: -6, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
        <XAxis
          dataKey="uniqueAttempt"
          tick={{ fill: chartTheme.colors.axisText, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.colors.grid }}
          tickLine={{ stroke: chartTheme.colors.grid }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tick={{ fill: chartTheme.colors.axisText, fontSize: 11 }}
          axisLine={{ stroke: chartTheme.colors.grid }}
          tickLine={{ stroke: chartTheme.colors.grid }}
        />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          contentStyle={chartTheme.tooltipStyle}
          labelStyle={{ color: chartTheme.colors.tooltipText, fontWeight: "bold" }}
          itemStyle={{ color: chartTheme.colors.tooltipText }}
          formatter={(value) => [`${value}%`, "Score"]}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {processedData.map((entry, index) => {
            let color = "#22C55E";
            if (entry.score <= 40) color = "#EF4444";
            else if (entry.score <= 70) color = "#F59E0B";

            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default QuizPerformanceChart;