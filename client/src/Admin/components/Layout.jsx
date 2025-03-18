import { Toaster } from "react-hot-toast";
import Home from "../Home";
import LoginPage from "../Login";
import useAuthAdmin from "../store/useAuthAdmin";
import { useContext } from "react";
import { ThemeContext } from "../../GlobalStates/ThemeContext";

const Layout = () => {
  const { user } = useAuthAdmin();
  const { theme } = useContext(ThemeContext);
  return (
    <div data-theme={theme}>
      <Toaster />
      {user ? <Home /> : <LoginPage />}
    </div>
  );
};

export default Layout;
