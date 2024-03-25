import React, { useEffect, useState } from 'react'
import axios from "axios";
import { InputBox } from './InputBox'
import ToastComponent from './ToastComponent';
import { Spinner } from './Spinner';
import {useNavigate} from "react-router-dom";

const Signup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState("");
    const [valu, setValu] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [title, setTitle] = useState("");
    const navigate = useNavigate()

    const submitHandler = async() => {
      setLoading(true);
      if(!name || !email || !password){
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
        const {data} = await axios.post("http://localhost:5000/api/user", {name, email, password, pic},
        config
        );
        setTitle("Registration successful");
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

    const postImage = (pics) => {
      setLoading(true);
      if(pics===undefined){
        setTitle("Alert!!\nPlease Upload a Image")
        setShowToast(true);
        return
      }
      if(pics.type === "image/jpeg" || pics.type === "image/png"){
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dld8hdhpd");
        fetch("https://api.cloudinary.com/v1_1/dld8hdhpd/image/upload", {
          method: "post",
          body: data,
        }).then(response => response.json())
        .then(data => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        }).catch(error => {
          console.log(error);
          setLoading(false);
        })
      } else{
        setShowToast(true);
        return;
      }
    }

    // useEffect(() => {
    //   setShowToast(true);
    // }, [])

  return (
    <div className='flex flex-col space-y-4'>
      <InputBox value={name} label={"Name"} placeholder={"Enter your name"} onChange={(e) => {
        setName(e.target.value)
      }}></InputBox>
      <InputBox value={email} label={"Email Address"} placeholder={"Enter your Email Address"} type='email' onChange={(e) => {
        setEmail(e.target.value);
      }}></InputBox>
      <InputBox value={password} label={"Password"} placeholder={"Enter Password"} type={!show?"password":"text"} isPassword={true} onClick={() => {
        setShow(!show);
      }} onChange={(e) => {
        setPassword(e.target.value);
      }}></InputBox>
      <InputBox value={valu} label={"Upload Your Picture"} type="file" onChange={(e) => {
        setValu(e.target.value);
        postImage(e.target.files[0]);
      }} ></InputBox>
      <button disabled={loading} className='bg-blue-500 p-2 text-white font-bold rounded-md hover:bg-blue-600' onClick={submitHandler}>Sign Up</button>
      <div className='fixed top-0 right-0' hidden={!showToast}><ToastComponent label={title} setShowToast={setShowToast}></ToastComponent></div>
      <div hidden={!loading}>
        <Spinner></Spinner>
      </div>
    </div>
  )
}

export default Signup
