import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import axios from "axios";
import UserChatItem from "./UserChatItem";
import Skeleton from "./Skeleton";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/ChatLogics";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    const userInfo = localStorage.getItem("userInfo");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(userInfo).token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      console.log(error, "error from MyChats");
      alert(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`dark:bg-slate-900 bg-white border-4 border-slate-200 rounded-lg sm:w-[40%] sm:flex md:w-[33%] w-full flex-none pl-3 py-5 pr-3.5 ${
        selectedChat ? "hidden" : "flex"
      } flex-col`}
    >
      <div className="flex justify-between ml-2 mb-6 mr-1.5">
        <div className="text-3xl dark:text-white">My Chats</div>
        <div className="flex hover:bg-slate-300 items-center bg-slate-200 px-5 rounded-md">
          <GroupChatModal label={`New Group Chat`}></GroupChatModal>
        </div>
      </div>
      {chats ? (
        <div className="overflow-auto flex flex-col rounded p-2 bg-gray-50 h-full">
          {chats.length == 0 ? (
            <div className="m-auto text-2xl">Search User to Get Started</div>
          ) : (
            chats.map((chat) => {
              if (!chat.isGroupChat) {
                return (
                  <UserChatItem
                    onClick={() => setSelectedChat(chat)}
                    key={chat._id}
                    id={chat._id}
                    latestMessage={chat.latestMessage}
                    isSender={
                      chat.latestMessage
                        ? chat.latestMessage.sender._id != user._id
                        : false
                    }
                    name={getSender(user, chat.users).name}
                    senderName={getSender(user, chat.users).name.split(" ")[0]}
                    isSelected={selectedChat == chat}
                  ></UserChatItem>
                );
              } else {
                return (
                  <UserChatItem
                    onClick={() => setSelectedChat(chat)}
                    key={chat._id}
                    id={chat._id}
                    name={chat.chatName}
                    senderName={
                      chat.latestMessage
                        ? chat.latestMessage.sender.name.split(" ")[0]
                        : ""
                    }
                    isSelected={selectedChat == chat}
                    latestMessage={chat.latestMessage}
                    isSender={
                      chat.latestMessage && user
                        ? chat.latestMessage.sender._id != user._id
                        : false
                    }
                  ></UserChatItem>
                );
              }
              // else {
              //   return <UserChatItem></UserChatItem>;
              // }
            })
          )}
        </div>
      ) : (
        <Skeleton></Skeleton>
      )}
    </div>
  );
};

export default MyChats;
