import React from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

const Login = ({
  setPage,
  phone,
  setPhone,
  password,
  setPassword,
  setShowPassword,
  showPassword,
}) => {
  const { login } = useAuthStore();
  const Signin = async () => {
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Enter Valid Mobile Number");

      return;
    }

    let res = await login({ phone, password });

    if (res) {
      setPhone("");
      setPassword("");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-primary/10 text-black font-[sans-serif] p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
          </div>

          <div>
            <div className="relative flex items-center">
              <input
                name="phone"
                required
                className="bg-transparent w-full text-sm  text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter phone"
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <MdOutlineMail className="text-xl cursor-pointer" />
            </div>
          </div>

          <div className="mt-6">
            <div className="relative flex items-center">
              <input
                name="password"
                value={password}
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
              <button
                onClick={() => setPage("Forget")}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
              onClick={Signin}
            >
              Sign in
            </button>
            <p className="text-gray-800 text-sm text-center mt-6">
              Don't have an account{" "}
              <button
                onClick={() => setPage("Register")}
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
