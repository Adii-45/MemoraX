import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartTheme } from "./chartTheme";

const ActivityChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
        <XAxis
          dataKey="date"
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
          labelStyle={{ color: chartTheme.colors.tooltipText, fontWeight: "bold" }}
          itemStyle={{ color: chartTheme.colors.tooltipText }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ color: chartTheme.colors.axisText, fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="uploads"
          name="Uploads"
          stroke="#22C55E"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="flashcards"
          name="Flashcards"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="quizzes"
          name="Quizzes"
          stroke="#A855F7"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;