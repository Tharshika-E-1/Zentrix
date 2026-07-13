import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const WeeklyActivity = () => {

  const { axios, token } = useAppContext();

  const [activity, setActivity] = useState(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const { data } = await axios.get(
        "/api/dashboard/weekly-activity",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data.success) {
        console.log(data.activity);
        setActivity(data.activity);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

const getColor = (count) => {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";
  if (count <= 2) return "bg-green-200";
  if (count <= 5) return "bg-green-400";
  if (count <= 8) return "bg-green-500";
  return "bg-green-700";
};
  return (
  <div className="bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mt-6">

    <div className="flex items-center gap-2 mb-4">
      <CalendarDays
  size={26}
  className="text-black dark:text-white"
/>
      <h2 className="text-2xl font-bold text-black dark:text-white">
  Weekly Activity
</h2>
      
    </div>
    <p className="text-gray-600 dark:text-white">
  Your activity over the last 7 days
</p>
    <div className="mt-6 overflow-x-auto">

  {/* Header */}
  <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 items-center mb-4 w-full">

    <div></div>

    {days.map((day) => (
      <div
        key={day}
        className="text-center text-sm font-semibold text-gray-500 dark:text-white"
      >
        {day}
      </div>
    ))}

  </div>

  {/* Weeks */}

  {weeks.map((week, weekIndex) => (

    <div
  key={week}
  className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 items-center mb-4 w-full"
>

      <div className="text-sm font-semibold text-gray-500 dark:text-white">
        {week}
      </div>

      {activity?.[weekIndex]?.map((count, dayIndex) => (

        <div className="flex justify-center" key={dayIndex}>
  <div
    title={`${days[dayIndex]}: ${count} prompts`}
    className={`w-7 h-7 rounded-md border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-110 cursor-pointer ${getColor(count)}`}
  />
</div>

      ))}

    </div>

  ))}

</div>

  

<div className="flex items-center justify-end gap-2 mt-6 text-xs text-gray-500 dark:text-white">

  <span>Less</span>

  <div className="w-4 h-4 rounded bg-gray-200"></div>
  <div className="w-4 h-4 rounded bg-green-200"></div>
  <div className="w-4 h-4 rounded bg-green-400"></div>
  <div className="w-4 h-4 rounded bg-green-500"></div>
  <div className="w-4 h-4 rounded bg-green-700"></div>

  <span>More</span>

</div>
    

  </div>
);
};

export default WeeklyActivity;