import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContex";
import axios from "axios";
import { toast } from 'react-toastify';

const Navbar = ({ url }) => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin } = useContext(AppContext);

  console.log("Navbar API URL:", url); // Debugging

  // Email verification
  const sendVerificationOtp = async () => {
    try {
      console.log("Sending OTP to:", `${url}/api/auth/send-verify-otp`);

      const { data } = await axios.post(`${url}/api/auth/send-verify-otp`, {}, { withCredentials: true });

      console.log("OTP Response:", data);

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Logging out from:", `${url}/api/auth/logout`);

      const { data } = await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true });

      console.log("Logout Response:", data);

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
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
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
