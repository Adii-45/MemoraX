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

const getScoreColor = (score) => {
  if (score >= 80) return chartTheme.colors.success;
  if (score >= 60) return chartTheme.colors.warning;
  return chartTheme.colors.danger;
};

const QuizPerformanceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data || []} margin={{ top: 8, right: 16, left: -6, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
        <XAxis
          dataKey="attempt"
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
          contentStyle={chartTheme.tooltipStyle}
          labelStyle={{ color: chartTheme.colors.tooltipText }}
          itemStyle={{ color: chartTheme.colors.tooltipText }}
          formatter={(value) => [`${value}%`, "Score"]}
          labelFormatter={(label, payload) => {
            const subject = payload?.[0]?.payload?.subject;
            return subject ? `${label} • ${subject}` : label;
          }}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {(data || []).map((entry) => (
            <Cell key={entry.attempt} fill={getScoreColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default QuizPerformanceChart;