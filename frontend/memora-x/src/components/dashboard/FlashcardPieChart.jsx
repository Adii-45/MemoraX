import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartTheme } from "./chartTheme";

const pieColors = ["#22c55e", "#64748b"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={chartTheme.tooltipStyle}>
        <p style={{ color: chartTheme.colors.tooltipText, margin: 0, fontWeight: 500 }}>
          {payload[0].name}
        </p>
        <p style={{ color: chartTheme.colors.tooltipText, margin: 0, marginTop: "4px" }}>
          {payload[0].value} cards
        </p>
      </div>
    );
  }
  return null;
};

const FlashcardPieChart = ({ data }) => {
  let reviewedCount = 0;
  let notReviewedCount = 0;
  let totalCards = 0;

  if (Array.isArray(data)) {
    // Raw card array (shouldn't happen from dashboard, but defensive)
    reviewedCount = data.filter((card) => {
      if (card.isReviewed !== undefined) return card.isReviewed === true;
      if (card.reviewCount !== undefined) return card.reviewCount > 0;
      return false;
    }).length;
    notReviewedCount = data.length - reviewedCount;
    totalCards = data.length;
  } else if (data) {
    // Stats object from API
    if (data.reviewedCards !== undefined) {
      // New API shape
      reviewedCount = data.reviewedCards || 0;
      notReviewedCount = data.notReviewedCards || 0;
      totalCards = data.totalCards || (reviewedCount + notReviewedCount);
    } else {
      // Legacy API shape fallback
      reviewedCount = (data.mastered || 0) + (data.learning || 0);
      notReviewedCount = data.notStarted || 0;
      totalCards = reviewedCount + notReviewedCount;
    }
  }

  const chartData = [
    { name: "Reviewed", value: reviewedCount },
    { name: "Not Reviewed", value: notReviewedCount },
  ];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="75%"
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={pieColors[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ color: chartTheme.colors.axisText, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-white leading-none">
          {totalCards}
        </span>
        <span className="text-xs text-neutral-400 mt-1">Total Cards</span>
      </div>
    </div>
  );
};

export default FlashcardPieChart;