import React from "react";
import { useNavigate } from "react-router-dom";

const CommunityPreview = ({ community = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mt-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold dark:text-white">
          🖼 Community Preview
        </h2>

        <button
          onClick={() => navigate("/community")}
          className="text-blue-600 "
        >
          View All
        </button>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {community.map(post=>(
<div key={post._id}>
<img
  src={post.image}
  className="w-full aspect-square object-cover rounded-xl"
/>

</div>
))}

      </div>

    </div>
  );
};

export default CommunityPreview;