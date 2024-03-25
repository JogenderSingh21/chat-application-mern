import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";

const UserChatItem = ({
  name,
  onClick,
  latestMessage,
  isSender,
  senderName,
  id,
}) => {
  const [time, setTime] = useState("");

  const { selectedChat } = ChatState();

  const toTime = (dt) => {
    const d = new Date(dt);
    return `${d.getHours()}:${
      d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    }`;
  };

  const toDate = (dt) => {
    const date = new Date(dt);
    const today = new Date();

    const isToday = date.toDateString() === today.toDateString();
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];

    if (isToday) {
      return toTime(dt);
    } else if (
      today.getDate() - date.getDate() < 7 &&
      date.getDay() < today.getDay()
    ) {
      return dayOfWeek;
    } else {
      return date.toDateString().substring(4);
    }
  };

  useEffect(() => {
    if (latestMessage) {
      setTime(toDate(latestMessage.updatedAt));
    }
  });
  return (
    <div>
      <div
        onClick={onClick}
        className={`p-2 min-h-16 sm:p-2 ${
          (selectedChat ? selectedChat._id == id : false)
            ? "bg-teal-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }  grow mb-2 rounded cursor-pointer`}
      >
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-1 min-w-0 text-left">
            <div className="flex justify-between">
              <p className="text-md font-bold truncate dark:text-white">
                {name}
              </p>
              {latestMessage ? <span className="text-xs">{time}</span> : <></>}
            </div>
            {latestMessage ? (
              <p
                className={`text-sm truncate ${
                  (selectedChat ? selectedChat._id == id : false)
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                <span className="font-semibold ">
                  {isSender ? senderName : "You"}
                  {": "}
                </span>
                {latestMessage.content}
              </p>
            ) : (
              <span className="text-sm">No messages</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatItem;
