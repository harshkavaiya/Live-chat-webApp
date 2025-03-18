import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Forget from "../components/auth/Forget";
import NewPassword from "../components/auth/NewPassword";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [page, setPage] = useState("Login");
  const [email, setEmail] = useState("");

  const RenderPage = () => {
    switch (page) {
      case "Login":
        return (
          <Login
            setPage={setPage}
            setPassword={setPassword}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setShowPassword={setShowPassword}
            showPassword={showPassword}
          />
        );

      case "Register":
        return (
          <Register
            password={password}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
            showPassword={showPassword}
            phone={phone}
            setPhone={setPhone}
            setPage={setPage}
            email={email}
            setEmail={setEmail}
          />
        );

      case "Forget":
        return <Forget setPage={setPage} email={email} setEmail={setEmail} />;

      case "NewPassword":
        return (
          <NewPassword
            setPage={setPage}
            password={password}
            email={email}
            setPassword={setPassword}
          />
        );
    }
  };
  return <>{RenderPage()}</>;
};

export default LoginPage;
