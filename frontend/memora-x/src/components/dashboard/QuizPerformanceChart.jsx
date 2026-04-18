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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dateStr = data.completedAt
      ? new Date(data.completedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

    let scoreColor = "#22C55E";
    if (data.score <= 40) scoreColor = "#EF4444";
    else if (data.score <= 70) scoreColor = "#F59E0B";

    return (
      <div
        style={{
          ...chartTheme.tooltipStyle,
          minWidth: "130px",
        }}
      >
        <p style={{ color: "#fff", margin: 0, fontWeight: 600, fontSize: "12px" }}>
          {data.attempt || "Quiz"}
        </p>
        {dateStr && (
          <p style={{ color: "#a3a3a3", margin: "4px 0 0", fontSize: "11px" }}>
            {dateStr}
          </p>
        )}
        <p
          style={{
            color: scoreColor,
            margin: "4px 0 0",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          Score: {data.score}%
        </p>
      </div>
    );
  }
  return null;
};

const QuizPerformanceChart = ({ data }) => {
  const processedData = (data || []).map((entry, index) => ({
    ...entry,
    uniqueAttempt: `${entry.attempt} (Attempt ${index + 1})`
  }));

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={processedData} margin={{ top: 8, right: 16, left: -6, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
        <XAxis
          dataKey="uniqueAttempt"
          tick={false}
          axisLine={false}
          tickLine={false}
          height={4}
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
          content={<CustomTooltip />}
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