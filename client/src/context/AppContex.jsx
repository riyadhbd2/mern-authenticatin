import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  //   Function to determine loggedin or not
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/is-auth`
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  //Function to get user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/user/data`);
      data.success ? setUserData(data.userData) : alert(data.message);
      console.log(data);
      console.log(userData);
    } catch (error) {
      alert(error.message);
    }
  };

  const value = {
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
