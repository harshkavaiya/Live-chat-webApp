import "./App.css";
import Home from "./pages/Home";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./GlobalStates/ThemeContext";
import LoginPage from "./pages/Login";
import useAuthStore from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { Route, Routes } from "react-router-dom";
import ShowQR from "./components/Group/ShowQR";
import QRScanner from "./components/Group/ScannerQR";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
function App() {
  const { theme } = useContext(ThemeContext);
  const { authUser, loadAuthFromStorage, checkAuth } = useAuthStore();

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
      <Toaster className="z-50" />
      {/* {authUser && authUser._id} */}
      {authUser != null ? <Home /> : <LoginPage />}

      {/* <Routes>
        <Route path="/" element="" />
        <Route path="/Login" element={<LoginPage />} /> 
        <Route path="/qrgroup" element={<ShowQR />} />
        <Route path="/readqr" element={<QRScanner />} />
      </Routes> */}
      {/* <Route path="/Register" element={<Register />} /> */}
      {/* {authUser && <NewVideoCall />} */}
    </div>
  );
}

export default App;
