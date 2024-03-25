import React from "react";

const Skeleton = () => {
  return (
    <div role="status" className="animate-pulse w-full">
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;
