import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContex";
import axios from "axios";

const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const {isLoggedin, userData, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  const inputRefs = React.useRef([])

  // to go to next array automatically
  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus();
    }
  }

  // to come to to previous array for backspace key
  const handleKeyDown =(e, index) =>{
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  // to paste the otp in the otp form
  const handlePaste = (e) =>{
    const paste = e.clipboardData.getData('text')
    const pasteArrafy = paste.split('');
    pasteArrafy.forEach((char, index)=>{
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  // function for the OTP verify
  const onSubmitHandler = async(e) =>{
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');

      const {data} = await axios.post("http://localhost:6007/api/auth/verify-account", {otp})
      if (data.success) {
        alert(data.message);
        getUserData();
        navigate('/');
      } else{
        alert(error.message)
      }
    } catch (error) {
      alert(error.message)
    }
  } 


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm=w-32 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl front font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id</p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
            <input className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" type="text" maxLength='1' required key={index} ref={(e) => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e)=>handleKeyDown(e, index)}/>
        
          ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Verify Email</button>
      </form>
    </div>
  );
};

export default EmailVerify;
