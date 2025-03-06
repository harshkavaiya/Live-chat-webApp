import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./Home";
import LoginPage from "../pages/Login";
import { ThemeContext } from "../GlobalStates/ThemeContext";
import useAuthStore from "../store/useAuthStore";

const Layout = () => {
  const { theme } = useContext(ThemeContext);
  const { authUser, loadAuthFromStorage, checkAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadAuthFromStorage();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !authUser) {
      console.log("authUser is null, calling checkAuth...");
      checkAuth();
    }
  }, [authUser, isInitialized]);

  return (
    <div data-theme={theme}>
      <Toaster
        toastOptions={{
          duration: 1000,
          style: {
            zIndex: 9999,
          },
        }}
      />
      {authUser != null ? <Home /> : <LoginPage />}
    </div>
  );
};

export default Layout;
