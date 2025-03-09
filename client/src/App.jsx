import "./App.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { Route, Routes } from "react-router-dom";
import UserHome from "./pages/Layout";
import AdminHome from "./Admin/components/Layout";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
function App() {
  return (
    <Routes>
      <Route path="/" Component={UserHome} />
      <Route path="/Admin" Component={AdminHome} />
    </Routes>
  );
}

export default App;
