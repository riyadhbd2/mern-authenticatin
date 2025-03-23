import { Route, Routes } from "react-router-dom";
import EmailVerify from "./pages/EmailVerify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer} from 'react-toastify';

const App = () => {
  const url = `${import.meta.env.VITE_BACKEND_BASEURL}`;
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home  url={url}/>} />
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/email-verify" element={<EmailVerify url={url} />} />
        <Route path="/reset-password" element={<ResetPassword url={url} />} />
      </Routes>
    </div>
  );
};

export default App;
