import React, { useState, useEffect } from "react";
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
import progressService from "../../services/progressService";
import { ChevronDown } from "lucide-react";

const ActivityChart = ({ data: initialData }) => {
  const [range, setRange] = useState("30d");
  const [chartData, setChartData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setChartData(initialData);
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchRangeData = async () => {
      try {
        const response = await progressService.getDashboardData(range);
        if (isMounted && response?.data?.studyActivity) {
          setChartData(response.data.studyActivity);
        }
      } catch (error) {
        console.error("Failed to fetch updated chart data", error);
      }
    };

    // If it's the initial 30d render and we already have data, we could technically skip, 
    // but fetching ensures the selected range is applied correctly without stale data.
    fetchRangeData();

    return () => {
      isMounted = false;
    };
  }, [range]);

  const options = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 3 Months" },
  ];

  const selectedLabel = options.find((o) => o.value === range)?.label || "Last 30 Days";

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-lg h-full flex flex-col overflow-visible">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-neutral-200">
          Study Activity
        </h3>

        {/* Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between gap-2 px-3 py-1.5 min-w-[120px] text-sm bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 hover:border-primary transition"
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown size={16} className="flex-shrink-0 text-neutral-400" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-50 overflow-hidden">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setRange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition ${
                    range === option.value
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-neutral-800 mb-4" />

      {/* CHART */}
      <div className="w-full min-h-[260px] sm:min-h-[300px] md:min-h-[350px] flex-1 min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartTheme.colors.axisText, fontSize: 10 }}
              axisLine={{ stroke: chartTheme.colors.grid }}
              tickLine={{ stroke: chartTheme.colors.grid }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: chartTheme.colors.axisText, fontSize: 10 }}
              axisLine={{ stroke: chartTheme.colors.grid }}
              tickLine={{ stroke: chartTheme.colors.grid }}
              width={35}
            />
            <Tooltip
              contentStyle={chartTheme.tooltipStyle}
              labelStyle={{ color: chartTheme.colors.tooltipText, fontWeight: "bold" }}
              itemStyle={{ color: chartTheme.colors.tooltipText }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ color: chartTheme.colors.axisText, fontSize: 11, paddingTop: 4 }}
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
              stroke="#2563EB"
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
      </div>
    </section>
  );
};

export default ActivityChart;