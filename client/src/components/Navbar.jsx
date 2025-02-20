import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContex";
import axios from "axios";

const Navbar = () => {

  const navigate = useNavigate();

  const { userData, setUserData, setIsLoggedin } = useContext(AppContext);

  // email verify function
  const sendVerificationOtp = async() =>{
    try {

      axios.defaults.withCredentials = true;

      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/send-verify-otp`)

      if (data.success) {
        navigate('/email-verify')
        alert(data.message)
      } else{
        alert(data.message)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  // logout function
  const logout = async() =>{
    try {

      axios.defaults.withCredentials = true

      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/logout`)

      data.success && setIsLoggedin(false)
      data.success && setUserData(false)

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify email
                </li>
              )}
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border  border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
