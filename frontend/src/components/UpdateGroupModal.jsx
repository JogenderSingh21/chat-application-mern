import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import show from "../assets/show.svg";
import NewSpinner from "./NewSpinner";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, chat }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, setSelectedChat } = ChatState();

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

  const handleRemove = async (user1) => {
    if (chat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        {
          chatId: chat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      //   fetchMessages();
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (chat.users.find((u) => u._id === user1._id)) {
      alert("User Already in group!");
      return;
    }

    if (chat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupadd`,
        {
          chatId: chat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        {
          chatId: chat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert(error);
      console.log(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <img className="w-6" src={show}></img>
      </button>
      {showModal ? (
        <>
          <div className="text-black cursor-default flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-50">
            <div className="relative my-6 mx-auto w-[26rem] sm:w-[32rem]">
              <div className="overflow-hidden border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {loading && <NewSpinner></NewSpinner>}
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">{chat.chatName}</h3>
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
                  <div className="flex flex-wrap ">
                    {chat.users.map((u) => {
                      if (u._id == user._id) {
                        return (
                          <UserBadgeItem
                            key={u._id}
                            user={{ name: `${u.name} (You)` }}
                            isClosable={false}
                          ></UserBadgeItem>
                        );
                      } else {
                        return (
                          <UserBadgeItem
                            key={u._id}
                            user={u}
                            handleDelete={() => handleRemove(u)}
                            isClosable={chat.groupAdmin._id == user._id}
                          ></UserBadgeItem>
                        );
                      }
                    })}
                  </div>
                  <div className="flex">
                    <input
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                      placeholder={"Chat Name"}
                      className="w-full p-2 border rounded-s border-slate-200"
                      required=""
                    />
                    <button
                      onClick={handleRename}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-e px-5 w-32"
                    >
                      {renameLoading ? (
                        <svg
                          aria-hidden="true"
                          role="status"
                          class="inline w-4 h-4 me-3 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                  {chat.groupAdmin._id == user._id && (
                    <input
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder={"Add Users to the Group"}
                      className="w-full p-2 border rounded border-slate-200"
                      required=""
                    />
                  )}

                  {search == "" ? (
                    <></>
                  ) : loading ? (
                    <div className="md text-gray-700 font-semibold">
                      Loading...
                    </div>
                  ) : (
                    <div>
                      {searchResult?.slice(0, 4).map((use) => {
                        if (!chat.users.find((u) => u._id === use._id)) {
                          return (
                            <UserListItem
                              key={use._id}
                              user={use}
                              handleFunction={() => handleAddUser(use)}
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
                    className="text-white bg-red-500 rounded-md hover:bg-red-700 font-bold uppercase px-5 py-3 text-sm outline-none focus:outline-none"
                    type="button"
                    onClick={() => handleRemove(user)}
                  >
                    Leave Group
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

export default UpdateGroupModal;
