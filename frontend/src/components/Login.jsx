import React, { useState } from 'react'
import axios from "axios";
import { InputBox } from './InputBox'
import ToastComponent from './ToastComponent';
import {useNavigate} from "react-router-dom";
import { Spinner } from './Spinner';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [title, setTitle] = useState("");
    const navigate = useNavigate()

    const submitHandler = async() => {
      setLoading(true);
      if(!email || !password){
        setTitle("Alert!!\nPlease Fill required Details");
        setShowToast(true);
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            "Content-type" : "application/json",
          },
        };
        const {data} = await axios.post("http://localhost:5000/api/user/login", {email, password},
          config
        );
        setTitle("Login successful");
        setShowToast(true);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      } catch (error) {
        console.log(error);
        setTitle("Error Occured!");
        setShowToast(true);
        setLoading(false);
      }
    }

  return (
    <div className='flex flex-col space-y-4'>
      <InputBox value={email} label={"Email Address"} placeholder={"Enter your Email Address"} type='email' onChange={(e) => {
        setEmail(e.target.value);
      }}></InputBox>
      <InputBox value={password} label={"Password"} placeholder={"Enter Password"} type={!show?"password":"text"} isPassword={true} onClick={() => {
        setShow(!show);
      }} onChange={(e) => {
        setPassword(e.target.value);
      }}></InputBox>
      <button className='bg-blue-500 p-2 text-white font-bold rounded-md hover:bg-blue-600' onClick={submitHandler}>Login</button>
      <button className='bg-red-500 p-2 text-white font-bold rounded-md hover:bg-red-600' onClick={() => {
        setEmail("guest@example.com");
        setPassword("123456");
      }}>Guest Login using Credentials</button>
      <div className='fixed top-0 right-0' hidden={!showToast}><ToastComponent label={title} setShowToast={setShowToast}></ToastComponent></div> 
      <div hidden={!loading}>
        <Spinner></Spinner>
      </div>
    </div>
  )
}

export default Login
