import React, { useEffect, useState } from "react";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatisticsCards from "../components/dashboard/StatisticsCards";
import LearningStreak from "../components/dashboard/LearningStreak";
import ProgressChart from "../components/dashboard/ProgressChart";
import CommunityPreview from "../components/dashboard/CommunityPreview";
import { useAppContext } from "../context/AppContext";
import WeeklyActivity from "../components/dashboard/WeeklyActivity";
import Account from "../components/settings/Account";

const Dashboard = () => {
    const { axios, token } = useAppContext();

const [dashboard, setDashboard] = useState(null);
console.log(dashboard);
const fetchDashboard = async () => {
  try {
    const { data } = await axios.get("/api/dashboard", {
      headers: {
        Authorization: token,
      },
    });

    if (data.success) {
      setDashboard(data);
    }
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  fetchDashboard();
}, []);
if (!dashboard) {
  
  return (
    <div className="flex items-center justify-center h-screen">
      Loading Dashboard...
    </div>
  );
}
console.log("Dashboard Data:", dashboard);
console.log("Pinned:", dashboard?.pinned);
console.log(dashboard.community);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f] p-8">
      

      <Account />

      <WelcomeCard dashboard={dashboard} />

      <StatisticsCards dashboard={dashboard} />

      <LearningStreak dashboard={dashboard} />

      <ProgressChart progress={dashboard.progress} />
      <WeeklyActivity />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

  

  

</div>

      <CommunityPreview
    community={dashboard.community}
/>

    </div>
  );
};

export default Dashboard;