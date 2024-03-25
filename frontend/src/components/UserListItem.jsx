import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div>
      <div
        onClick={handleFunction}
        class="p-2 sm:p-2 bg-gray-200 hover:bg-teal-500 hover:text-white w-full mb-2 rounded cursor-pointer"
      >
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src={user.pic} alt="Pic" />
          </div>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-sm font-bold truncate dark:text-white">
              {user.name.toUpperCase()}
            </p>
            <p class="text-sm truncate ">
              <span className="font-semibold ">Email: </span>
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
