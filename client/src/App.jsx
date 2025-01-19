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
      {authUser != null ? <Home /> : <LoginPage />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
      {/* {authUser && <NewVideoCall />} */}
    </div>
  );
}

export default App;
