import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

  


const ProgressChart = ({ progress = [] }) => {
  const [isDark, setIsDark] = useState(false);

useEffect(() => {
  const checkTheme = () => {
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  checkTheme();
  const observer = new MutationObserver(checkTheme);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}, []);
const textColor = isDark ? "#ffffff" : "#000000";
const gridColor = isDark ? "#666666" : "#d1d5db";

  return (
    <div className="bg-white dark:bg-[#181818] rounded-xl shadow-md p-6 mt-6 dark:border dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        📈 User Progress
      </h2>

      <ResponsiveContainer width="100%" height={350} >
        <LineChart data={progress} >
          <CartesianGrid
  stroke={gridColor}
  strokeDasharray="3 3"
/>
          <XAxis
  dataKey="day"
  tick={{ fill: textColor, fontSize: 14 }}
  axisLine={{ stroke: textColor }}
  tickLine={{ stroke: textColor }}
/>

<YAxis
  tick={{ fill: textColor, fontSize: 14 }}
  axisLine={{ stroke: textColor }}
  tickLine={{ stroke: textColor }}
/>
          <Tooltip />

          <Line
  type="monotone"
  dataKey="chats"
  stroke={textColor}
  strokeWidth={3}
  dot={{
    fill: textColor,
    stroke: textColor,
    r: 5,
  }}
  activeDot={{
    r: 7,
    fill: textColor,
    stroke: textColor,
  }}
/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;