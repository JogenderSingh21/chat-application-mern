import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputBox } from "./InputBox";
import searchIcon from "../assets/searchIcon.svg";
import notification from "../assets/notification.svg";
import down from "../assets/down.svg";
import { ChatState } from "../Context/chatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import Skeleton from "./Skeleton";
import UserListItem from "./UserListItem";
import { Spinner } from "./Spinner";

const SideDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const { user, chats, setChats, setSelectedChat } = ChatState();

  const dropdownRef = useRef();
  const sidebarRef = useRef();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (search == "") {
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
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleClickOutsideSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
        setSearch("");
        setSearchResult([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickOutsideSidebar);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleClickOutsideSidebar);
    };
  });

  return (
    <div>
      {/* Button to Toggle Drawer */}
      <div className="text-center w-full bg-white dark:bg-slate-900 dark:text-white py-0.5 border-4 border-slate-200 px-2 flex justify-between items-center">
        <div ref={sidebarRef}>
          <button
            className="text-black flex justify-between items-center bg-slate-50 dark:bg-gray-300 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 rounded-lg text-md font-semibold px-5 py-2 focus:outline-none"
            type="button"
            onClick={toggleDrawer}
          >
            <img className="w-5 mr-2" src={searchIcon} alt="search" />
            <span>Search User</span>
          </button>

          {/* Drawer Component */}
          <div
            id="drawer-example"
            className={`fixed shadow-2xl rounded-r-3xl border-4 border-slate-200 top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
              isDrawerOpen ? "" : "-translate-x-full"
            } bg-white w-80 dark:bg-gray-800`}
            tabIndex="-1"
            aria-labelledby="drawer-label"
          >
            {/* Drawer Header */}
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setSearch("");
                setSearchResult([]);
              }}
              type="button"
              data-drawer-hide="drawer-example"
              aria-controls="drawer-example"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
            <div className="flex items-end">
              <div className="grow">
                <InputBox
                  red={true}
                  label={"Search Users"}
                  placeholder={"type something..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                ></InputBox>
              </div>
              <button
                onClick={handleSearch}
                className="py-1.5 px-2 ml-2 rounded bg-slate-300 hover:bg-slate-300"
              >
                <img className="w-5" src={searchIcon} alt="" />
              </button>
            </div>
            <div className="mt-5 text-black">
              {loading ? (
                <Skeleton></Skeleton>
              ) : (
                searchResult.map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    ></UserListItem>
                  );
                })
              )}
            </div>
          </div>
          {loadingChat && <Spinner></Spinner>}
        </div>
        <h1 className="text-2xl my-1">WhatsApp</h1>
        <div className="flex w-fit items-center">
          <button className="cursor-pointer dark:bg-gray-300 bg-slate-50 hover:bg-gray-200 rounded-lg mr-3 px-2 py-3 h-fit">
            <img className="w-5" src={notification} alt="notification" />
          </button>

          {/* Dropdown Menu */}
          <div className="inline-block text-left" ref={dropdownRef}>
            <div
              onClick={toggleDropdown}
              className="flex cursor-pointer dark:bg-gray-300 bg-slate-50 hover:bg-gray-200 focus:bg-slate-100 rounded-lg py-0.5 my-1.5 px-5"
            >
              {user ? (
                <img
                  className=" rounded-full w-10 h-10 mr-2"
                  src={user.pic}
                  alt=""
                />
              ) : (
                <Spinner></Spinner>
              )}
              <img
                className={`w-3 duration-300 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                src={down}
                alt=""
              />
            </div>

            {/* Dropdowwn Component */}
            {isOpen && (
              <div className="absolute z-10 w-44 right-2.5 h-fit bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-slate-300 dark:bg-gray-700">
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    {/* <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      My Profile
                    </a> */}
                    <ProfileModal
                      label={"My Profile"}
                      user={user}
                    ></ProfileModal>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={logoutHandler}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
