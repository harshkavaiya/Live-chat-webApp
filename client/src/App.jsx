import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./GlobalStates/ThemeContext";
import LoginPage from "./pages/Login";
import useAuthStore from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import VideoCall from "./components/call/VideoCall";

function App() {
  const { theme } = useContext(ThemeContext);
  const { authUser, checkAuth, isLogin, socket } = useAuthStore();

  useEffect(() => {
    if (!socket) {
      checkAuth();
    }
  }, [socket, isLogin]);

  return (
    <div data-theme={theme}>
      <Toaster />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes> */}
      {authUser && <VideoCall />}
      {/* {authUser ? <Home /> : <LoginPage />} */}
    </div>
  );
}

export default App;
