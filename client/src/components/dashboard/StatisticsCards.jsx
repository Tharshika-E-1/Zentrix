import React from "react";
import {
  MessageSquare,
  Pin,
  Gem,
  FileText,
} from "lucide-react";

const StatisticsCards = ({ dashboard }) => {
  const cards = [
    {
      title: "Total Chats",
      value: dashboard?.totalChats || 0,
      icon: <MessageSquare size={28} />,
    },
    {
      title: "Pinned Chats",
      value: dashboard?.pinnedChats || 0,
      icon: <Pin size={28} />,
    },
    {
      title: "Credits",
      value: dashboard?.credits || 0,
      icon: <Gem size={28} />,
    },
    {
      title: "PDFs",
      value: dashboard?.pdfs || 0,
      icon: <FileText size={28} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 dark:text-white">{card.title}</p>

              <h2 className="text-3xl font-bold mt-3 dark:text-white dark:text-white">
                {card.value}
              </h2>
            </div>

            <div className="text-black dark:text-white ">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;