import { useEffect, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState();
  const { login, authUser, isLogin } = useAuthStore();
  const navigate = useNavigate();
  const Signin = () => {
    login({ phone, password });
  };
  // useEffect(() => {
  //   if (isLogin && authUser) return navigate("/");
  // }, [isLogin]);

  return (
    <div className="flex justify-center items-center text-black font-[sans-serif] p-4">
      <div className="max-w-md w-full mx-auto">
        <form className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
          </div>

          <div>
            <div className="relative flex items-center">
              <input
                name="phone"
                required
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter phone"
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <MdOutlineMail className="text-xl" />
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
                  className="text-xl"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <IoEyeOffOutline
                  className="text-xl"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm text-gray-800"
              >
                Remember me
              </label>
            </div>
            <div>
              <Link className="text-blue-600 text-sm font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <button
              type="button"
              className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
              onClick={Signin}
            >
              Sign in
            </button>
            <p className="text-gray-800 text-sm text-center mt-6">
              Don't have an account{" "}
              <a
                href="/Register"
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
