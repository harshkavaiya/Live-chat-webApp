import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <div data-theme="dark">
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/chat/:id" Component={ChatPage} />
        <Route path="/profile/:id" Component={Profile} />
      </Routes>
    </div>
  );
}

export default App;
