import React, { useEffect, useRef, useState } from "react";
import show from "../assets/show.svg";

const ProfileModal = ({ label = null, user, imgg, size, mt, mr }) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        setShowModal(true);
      }
    };

    document.addEventListener("click", handleClickOutsideSidebar);

    return () => {
      document.removeEventListener("click", handleClickOutsideSidebar);
    };
  });

  return (
    <>
      {imgg ? (
        <button onClick={() => setShowModal(true)} ref={buttonRef}>
          <img
            className={`w-${size} h-${size} rounded-full mt-${mt} mr-${mr}`}
            src={imgg}
          ></img>
        </button>
      ) : (
        <button
          className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-gray-600 dark:hover:text-white rounded"
          type="button"
          onClick={() => setShowModal(true)}
          ref={buttonRef}
        >
          {label}
        </button>
      )}
      {showModal ? (
        <>
          <div className="text-black flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-50">
            <div className="relative my-6 mx-auto w-[26rem] sm:w-[32rem]">
              <div
                ref={modalRef}
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
              >
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">
                    {user ? user.name.toUpperCase() : "No Data"}
                  </h3>
                  <button
                    className="bg-transparent border-0 hover:text-red-500 text-black float-right p-3 rounded-full"
                    onClick={() => setShowModal(false)}
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
                {user ? (
                  <div className="relative p-6 flex flex-col items-center">
                    <a href={user.pic} target="_blank">
                      <img
                        className="w-48 h-48 rounded-full border-4 border-slate-300 cursor-pointer hover:shadow-md hover:shadow-blue-200 "
                        src={user.pic}
                        alt="Profile Picture"
                      />
                    </a>
                    <div className="text-2xl mt-8">
                      <span className="font-bold">Email:</span>{" "}
                      <span className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
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

export default ProfileModal;
