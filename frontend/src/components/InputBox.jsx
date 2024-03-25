import show from "../assets/show.svg";
import hide from "../assets/hide.svg";
import { useEffect, useState } from "react";

export function InputBox({
  red = false,
  label,
  value = "",
  placeholder,
  type = "text",
  onChange,
  isPassword = false,
  onClick,
}) {
  return (
    <div>
      <div className="text-md font-medium text-left py-2">
        {label}
        {type == "file" ? (
          ""
        ) : (
          <span hidden={red} className="text-red-500">
            *
          </span>
        )}
      </div>
      <div className="flex">
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-black bg-blue-50 px-2 py-1 border rounded border-slate-200"
          type={type}
          required=""
        />
        {isPassword ? (
          <img
            className="w-6 ml-2 cursor-pointer"
            onClick={onClick}
            src={type == "password" ? show : hide}
            alt=""
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
