import React, { useState, useEffect } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-5">
      <div className="bg-white w-[30rem] h-fit flex justify-center shadow-md rounded-md p-5">
        <div className="font-semibold text-2xl">WhatsApp</div>
      </div>
      <div className="bg-white w-[30rem] h-fit flex flex-col justify-center shadow-md rounded-md p-5">
        <div className="w-full grid grid-cols-2 mb-5 gap-1">
          <button
            onClick={() => {
              setIsLogin(true);
            }}
            className={`hover:bg-blue-300 rounded-full p-1 font-bold text-gray-700 ${
              isLogin ? "bg-blue-200" : "bg-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
            }}
            className={`hover:bg-blue-300 rounded-full p-1 font-bold text-gray-700 ${
              !isLogin ? "bg-blue-200" : "bg-white"
            }`}
          >
            Sign Up
          </button>
        </div>
        <div className="grid grid-cols-1 px-2">
          <div hidden={!isLogin} className="">
            <Login></Login>
          </div>
          <div hidden={isLogin} className="">
            <Signup></Signup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
