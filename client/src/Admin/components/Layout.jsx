import { Toaster } from "react-hot-toast";
import Home from "../Home";
import LoginPage from "../Login";
import useAuthAdmin from "../store/useAuthAdmin";

const Layout = () => {
  const { user } = useAuthAdmin();
  return (
    <div>
      <Toaster />
      {user ? <Home /> : <LoginPage />}
    </div>
  );
};

export default Layout;
