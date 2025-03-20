import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import axiosInstance from "../../lib/axiosInstance";
import useAuthStore from "../../store/useAuthStore";
import { isValidEmail } from "../../function/function";

const Register = ({
  password,
  setPassword,
  setShowPassword,
  showPassword,
  phone,
  setPhone,
  setPage,
  email,
  setEmail,
}) => {
  const [confirmpassword, setConfirmpassword] = useState("");
  const [name, setName] = useState("");
  const { authUser } = useAuthStore();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const SignUp = async () => {
    if (authUser) return;
    if (!name) return toast.error("Please Enter Name");
    if (!email) return toast.error("Please Enter Email");
    if (!isValidEmail(email)) return toast.error("Enter Valid Email");
    if (!phone) return toast.error("Please Enter Phone no");

    if (phone.length != 10) return toast.error("Enter Valid Mobile Number");
    if (!password) return toast.error("Please Enter Password");
    if (password.length < 6)
      return toast.error("Password Length Must be 6 Digit");
    if (password !== confirmpassword) return toast.error("Password not Match");
    let res = await axiosInstance.post("/auth/signup", {
      fullname: name,
      email,
      password,
      phone,
    });

    if (res.data.success) {
      toast.success("SignUp Success");
      setPage("Login");
      setName("");
      setEmail("");
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-primary/10 text-black font-[sans-serif] p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">Sign Up</h3>
          </div>

          <div className="relative flex items-center">
            <input
              name="Name"
              required
              className="bg-transparent w-full text-sm  text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
              placeholder="Enter Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FaUser className="text-xl cursor-pointer" />
          </div>
          <div className="mt-6 relative flex items-center">
            <input
              name="Email"
              required
              className="bg-transparent w-full text-sm  text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
              placeholder="Enter Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MdOutlineMail className="text-xl cursor-pointer" />
          </div>
          <div className="mt-6 relative flex items-center">
            <input
              name="phone"
              required
              className="bg-transparent w-full text-sm  text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
              placeholder="Enter phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                if (value.length <= 10) setPhone(value); // Limit length to 15 digits
              }}
            />
            <IoMdCall className="text-xl cursor-pointer" />
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
          <div className="mt-6">
            <div className="relative flex items-center">
              <input
                name="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => setConfirmpassword(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter Confirm password"
              />
              {showConfirmPassword ? (
                <IoEyeOutline
                  className="text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <IoEyeOffOutline
                  className="text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
              onClick={SignUp}
            >
              Sign Up
            </button>
            <p className="text-gray-800 text-sm text-center mt-6">
              You have an account{" "}
              <button
                onClick={() => setPage("Login")}
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
