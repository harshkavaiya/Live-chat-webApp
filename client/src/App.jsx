import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./GlobalStates/ThemeContext";
import LoginPage from "./pages/Login";
import useAuthStore from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
// import VideoCall from "./components/call/VideoCall";
import NewVideoCall from "./components/call/NewVideoCall";
<<<<<<< HEAD
import HVidoeCall from "./components/call/HVideoCall";
=======
import Register from "./pages/Register";
>>>>>>> cfe108375e28ad0f408a5ee02d67b405c43f6a46

function App() {
  const { theme } = useContext(ThemeContext);
  const { authUser, loadAuthFromStorage, checkAuth, isLogin, socket } =
    useAuthStore();

  // useEffect(() => {
  //   if (!socket && !authUser) {
  //     console.log("authUser is null, calling checkAuth...");
  //     checkAuth();
  //   }
  // }, [socket, authUser]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load user from session storage and then check authentication
    loadAuthFromStorage();
    setIsInitialized(true); // Mark as initialized
  }, []);

  useEffect(() => {
    if (isInitialized && !authUser) {
      console.log("authUser is null, calling checkAuth...");
      checkAuth();
    }
  }, [authUser, isInitialized]);

  return (
    <div data-theme={theme}>
      <Toaster />
      {authUser && authUser._id}
      {/* {authUser != null ? <Home /> : <LoginPage />} */}
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
<<<<<<< HEAD
      </Routes> */}
      <HVidoeCall />
=======
        <Route path="/Register" element={<Register />} />
      </Routes>
>>>>>>> cfe108375e28ad0f408a5ee02d67b405c43f6a46
      {/* {authUser && <NewVideoCall />} */}
    </div>
  );
}

export default App;
