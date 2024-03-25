import React from "react";

const UserBadgeItem = ({ user, handleDelete, isClosable = true }) => {
  return (
    <div className="flex w-fit bg-violet-500 text-white py-1 px-1.5 space-x-2 items-center rounded mr-2 mb-2">
      <div className="text-sm">{user.name}</div>
      {isClosable && (
        <button onClick={handleDelete} className="flex">
          <svg
            class="w-2 h-2 mt-0.5"
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
      )}
    </div>
  );
};

export default UserBadgeItem;
