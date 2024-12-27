import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import { useContext, useEffect } from "react";
import { ThemeContext } from "./GlobalStates/ThemeContext";
import LoginPage from "./pages/Login";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { theme } = useContext(ThemeContext);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Login" Component={LoginPage} />
        <Route path="/chat/:id" Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;
