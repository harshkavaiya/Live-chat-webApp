import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import useAuthAdmin from "./store/useAuthAdmin";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthAdmin();
  const Signin = () => {
  
    setUsername();
    setPassword();
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-primary/10 text-black font-[sans-serif] p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">
              Admin Sign in
            </h3>
          </div>

          <div>
            <div className="relative flex items-center">
              <input
                name="username"
                required
                className="bg-transparent w-full text-sm  text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MdOutlineMail className="text-xl cursor-pointer" />
            </div>
          </div>

          <div className="mt-6">
            <div className="relative flex items-center">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter password"
              />
              {showPassword ? (
                <IoEyeOutline
                  className="text-xl cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <IoEyeOffOutline
                  className="text-xl cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4 mt-6">
            <div>
              <button className="text-blue-600 text-sm font-semibold hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="mt-12">
            <button
              type="button"
              className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
              onClick={()=>  login(username, password)}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
