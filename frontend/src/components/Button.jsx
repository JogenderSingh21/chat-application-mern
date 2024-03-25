import React from 'react'

const Button = ({ label, isLogin, onClick }) => {
  return (
    <button onClick={onClick} className={`hover:bg-blue-300 rounded-full p-1 font-bold text-gray-700`}>
        {label}
    </button>
  )
}

export default Button
