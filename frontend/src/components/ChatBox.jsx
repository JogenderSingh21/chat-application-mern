import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import back from "../assets/back.svg";
import { ChatState } from "../Context/chatProvider";
import UpdateGroupModal from "./UpdateGroupModal";
import NewSpinner from "./NewSpinner";
import { getSender } from "../config/ChatLogics";
import ScrollableChat from "./ScrollableChat";
import send from "../assets/send.svg";
import io from "socket.io-client";
import Typing from "./Typing";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat[0]._id
      ) {
        //give notification
        console.log("notification recieved");
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
      setFetchAgain(!fetchAgain);
    });
  });

  const sendMessage = async () => {
    if (newMessage && newMessage.trim() != "") {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);

        setFetchAgain(!fetchAgain);
      } catch (error) {
        alert(error);
      }
    } else {
      console.log("trimmed");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="dark:bg-slate-900 bg-white dark:text-white border-4 border-slate-200  rounded-lg grow flex flex-col p-3">
      {/* Header */}
      <div className="flex justify-between p-2 mb-1 items-center h-fit flex-none">
        <button
          onClick={() => setSelectedChat()}
          className="bg-gray-200 p-1 rounded cursor-pointer flex sm:hidden"
        >
          <img className="w-6 h-6" src={back} alt="back"></img>
        </button>
        <div className="flex">
          {selectedChat.isGroupChat ? (
            <></>
          ) : (
            <div className="mr-3">
              <ProfileModal
                user={getSender(user, selectedChat.users)}
                imgg={getSender(user, selectedChat.users).pic}
                size={10}
              ></ProfileModal>
            </div>
          )}
          <h1 className="text-3xl">
            {selectedChat.isGroupChat
              ? selectedChat.chatName.toUpperCase()
              : getSender(user, selectedChat.users).name.toUpperCase()}
          </h1>
        </div>
        <div className="w-fit">
          {selectedChat.isGroupChat ? (
            <UpdateGroupModal
              chat={selectedChat}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col items-stretch justify-end grow w-full dark:bg-black dark:bg-chat-light bg-chat-light bg-repeat-x bg-contain border border-gray-300 text-black rounded p-2 overflow-y-scroll">
        {loading ? (
          <NewSpinner size={14}></NewSpinner>
        ) : (
          <ScrollableChat messages={messages}></ScrollableChat>
        )}
        {istyping ? (
          <div className="flex">
            {!selectedChat.isGroupChat ? (
              <ProfileModal
                user={getSender(user, selectedChat.users)}
                imgg={getSender(user, selectedChat.users).pic}
                size={8}
                mt={2}
                mr={1}
              ></ProfileModal>
            ) : (
              <div className="w-[39px]"></div>
            )}
            <Typing></Typing>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex mt-3">
        <input
          value={newMessage}
          className="w-full px-1 py-1.5 rounded-md bg-transparent border-none outline-none"
          type="text"
          placeholder="Type a Message...."
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              console.log("Enter Pressed");
              sendMessage();
            }
          }}
          onChange={(e) => typingHandler(e)}
        ></input>
        <button
          hidden={newMessage ? newMessage.trim() == "" : true}
          onClick={sendMessage}
          className="rounded-md mx-2 text-white font-bold "
        >
          {/* Send */}
          <img className="w-8" src={send} alt="send"></img>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
