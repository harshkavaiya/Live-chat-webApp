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
import GroupLink from "./components/GroupLink/GroupLink";

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
      {authUser != null ? <Home /> : <LoginPage />}
    </div>
  );
}

export default App;
