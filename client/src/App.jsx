import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import { useContext } from "react";
import { ThemeContext } from "./GlobalStates/ThemeContext";

function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/chat/:id" Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;
