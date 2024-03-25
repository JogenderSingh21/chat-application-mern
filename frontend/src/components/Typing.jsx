import React from "react";

const Typing = () => {
  return (
    <div className="flex w-fit space-x-1 justify-center bg-white pr-4 pl-3 pt-3.5 pb-3 mt-2 ml-1 rounded-full">
      <span className="sr-only">Loading...</span>
      <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce "></div>
      <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.30s]"></div>
    </div>
  );
};

export default Typing;
