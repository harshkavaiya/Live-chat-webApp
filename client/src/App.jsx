import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/chat/:id" Component={ChatPage} />
      </Routes>
    </>
  );
}

export default App;
