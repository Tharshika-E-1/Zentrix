import React from "react";
import { Flame } from "lucide-react";

const LearningStreak = ({ dashboard }) => {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mt-6">

      <div className="flex items-center gap-3 mb-5">
        <Flame className="text-orange-500" />
        <h2 className="text-xl font-bold dark:text-white">
          Daily Learning Streak
        </h2>
      </div>

      <div className="grid grid-cols-3 text-center">

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
        
  {dashboard?.streak || 0}
</h1>
         
          <p className="text-gray-500 dark:text-white">
            Current
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {dashboard?.bestStreak ?? 0}
          </h1>
          <p className="text-gray-500 dark:text-white">
            Best
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {dashboard?.nextBadge ?? 0}
          </h1>
          <p className="text-gray-500 dark:text-white">
            Next Badge
          </p>
        </div>

      </div>

    </div>
  );
};

export default LearningStreak;