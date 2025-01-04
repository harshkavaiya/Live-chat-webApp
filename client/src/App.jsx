import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./GlobalStates/ThemeContext";
import LoginPage from "./pages/Login";
import useAuthStore from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useContext(ThemeContext);
  const { authUser, checkAuth, isLogin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      if (!isLogin || !authUser) {
        navigate("/Login");
      }
    };

    authenticate();
  }, [checkAuth, isLogin, authUser]);

  return (
    <div data-theme={theme}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
