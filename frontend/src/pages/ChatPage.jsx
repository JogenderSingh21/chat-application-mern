import React, { useEffect, useState } from "react";
import axios from "axios";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../Context/chatProvider";

const ChatPage = () => {
  const { selectedChat, setSelectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        // Add your functionality here when "esc" key is pressed
        setSelectedChat();
        console.log("Escape key pressed");
      }
    };

    // Adding event listener when the component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup function to remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col ">
      <SideDrawer></SideDrawer>
      <div className="flex grow max-h-[89vh] m-2 space-x-2">
        <MyChats fetchAgain={fetchAgain}></MyChats>
        {selectedChat ? (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          ></ChatBox>
        ) : (
          <div className="grow hidden sm:flex items-center justify-center">
            <div className="py-3 px-5 w-fit text-4xl text-gray-800 rounded">
              Click on User to start Chatting
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
