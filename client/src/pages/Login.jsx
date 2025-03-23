import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContex";
import { toast } from "react-toastify";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      // Set Axios global config for credentials
      axios.defaults.withCredentials = true;

      let data;
      if (state === "Sign Up") {
        // Register API
        const response = await axios.post(`${url}/api/auth/register`, { name, email, password }, { withCredentials: true });
        data = response.data;
      } else {
        // Login API
        const response = await axios.post(`${url}/api/auth/login`, { email, password }, { withCredentials: true });
        data = response.data;
      }

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Login/Register Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up" ? "Create your account" : "Login to your account"}
        </p>
        
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
              <img className="w-3" src={assets.person_icon} alt="Person Icon" />
              <input
                className="bg-transparent outline-none text-white"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Full Name"
                required
              />
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img className="w-3" src={assets.mail_icon} alt="Mail Icon" />
            <input
              className="bg-transparent flex-1 outline-none text-white "
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email ID"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img className="w-3" src={assets.lock_icon} alt="Lock Icon" />
            <input
              className="bg-[#333A5c] outline-none text-white"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
            />
          </div>

          <button type="button" onClick={() => navigate("/reset-password")} className="mb-4 text-indigo-500">
            Forgot Password?
          </button>

          <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("Login")} className="text-blue-400 cursor-pointer underline">
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span onClick={() => setState("Sign Up")} className="text-blue-400 cursor-pointer underline">
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
