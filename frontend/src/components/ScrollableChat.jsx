import React, { useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/chatProvider";
import {
  diffDates,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isShowDate,
} from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const toDate = (dt) => {
    const date = new Date(dt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else if (
      today.getDate() - date.getDate() < 7 &&
      date.getDay() < today.getDay()
    ) {
      return dayOfWeek;
    } else {
      return date.toDateString().substring(4);
    }
  };

  const toTime = (dt) => {
    const d = new Date(dt);
    return `${d.getHours()}:${
      d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    }`;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const dtt = toDate(m.updatedAt);
          return (
            <>
              <div
                hidden={!isShowDate(messages, m, i)}
                className="w-fit px-3 py-1 my-3 bg-gray-600 text-white rounded mx-auto"
              >
                {dtt}
              </div>
              <div
                className=" items-end"
                style={{ display: "flex" }}
                key={m._id}
              >
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id) ||
                  diffDates(messages, m, i, user._id)) && (
                  <ProfileModal
                    user={m.sender}
                    imgg={m.sender.pic}
                    size={8}
                    mt={2}
                    mr={1}
                  ></ProfileModal>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#d9fdd3" : "white"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 4 : 10,
                    borderRadius: "20px",
                    maxWidth: "75%",
                  }}
                  className=" break-words relative flex items-end"
                >
                  <div className="ml-4 my-1.5">{m.content}</div>
                  <div className="mx-3 text-[10px] font-semibold text-gray-500">
                    {toTime(m.updatedAt)}
                  </div>
                </span>
              </div>
            </>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
