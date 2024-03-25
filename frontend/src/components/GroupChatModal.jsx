import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/chatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ label }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, setChats, chats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert(error);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("already exist");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Please fill all the feilds");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setShowModal(false);
      console.log("New Group Chat Created!");
    } catch (error) {
      alert("Failed to Create the Chat!");
      console.log(error);
    }
  };

  return (
    <>
      <button
        className=" flex items-center"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {label} <span className="text-3xl ml-3 pb-1.5 ">+</span>
      </button>
      {showModal ? (
        <>
          <div className="cursor-default flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-50">
            <div className="relative my-6 mx-auto w-[26rem] sm:w-[32rem]">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">Create Group Chat</h3>
                  <button
                    className="bg-transparent border-0 hover:text-red-500 text-black float-right p-3 rounded-full cursor-pointer"
                    onClick={() => {
                      setShowModal(false);
                      setSearch("");
                      setSearchResult([]);
                      setSelectedUsers([]);
                    }}
                  >
                    <svg
                      class="w-3 h-3 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}

                <div className="flex flex-col space-y-3 px-6 pt-6">
                  <input
                    onChange={(e) => setGroupChatName(e.target.value)}
                    placeholder={"Chat Name"}
                    className="w-full p-2 border rounded border-slate-200"
                    required=""
                  />
                  <input
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={"Add Users eg: User1, User2"}
                    className="w-full p-2 border rounded border-slate-200"
                    required=""
                  />
                  <div className="flex flex-wrap ">
                    {selectedUsers.map((u) => {
                      return (
                        <UserBadgeItem
                          key={u._id}
                          user={u}
                          handleDelete={() => handleDelete(u)}
                        ></UserBadgeItem>
                      );
                    })}
                  </div>
                  {search == "" ? (
                    <></>
                  ) : loading ? (
                    <div className="md text-gray-700 font-semibold">
                      Loading...
                    </div>
                  ) : (
                    <div>
                      {searchResult?.slice(0, 4).map((user) => {
                        if (!selectedUsers.includes(user)) {
                          return (
                            <UserListItem
                              key={user._id}
                              user={user}
                              handleFunction={() => handleGroup(user)}
                            ></UserListItem>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end px-6 pb-3 pt-3">
                  <button
                    className="text-white bg-blue-500 rounded-md hover:bg-blue-700 font-bold uppercase px-5 py-3 text-sm outline-none focus:outline-none"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Create Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default GroupChatModal;
