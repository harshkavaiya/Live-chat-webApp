import { useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

const NewPassword = ({ password, setPassword, email, setPage }) => {
  const [confirmpassword, setConfirmpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const UpdatePassword = async () => {
    if (!password) return toast.error("Please Enter Password");
    if (password.length < 6)
      return toast.error("Password Length Must be 6 Digit");
    if (password !== confirmpassword) return toast.error("Password not Match");
    setIsLoading(true);
    let res = await axiosInstance.post("/auth/updatePassword", {
      password,
      email,
    });
    setIsLoading(false);
    if (res.data.success) {
      toast.success("Succesfully Password is Changed");
      setConfirmpassword("");
      setPage("Login");
    } else {
      toast.error(res.data.message);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-primary/10 text-black font-[sans-serif] p-4">
      <h1>Email:{email}</h1>
      <div className="max-w-md w-full mx-auto">
        <div className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">
              Password Change
            </h3>
          </div>
          <div className="">
            <div className="relative flex items-center">
              <input
                name="password"
                value={password}
                type={"text"}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter New password"
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="relative flex items-center">
              <input
                name="confirmpassword"
                value={confirmpassword}
                type={"text"}
                onChange={(e) => setConfirmpassword(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter New Confirm password"
              />
            </div>
          </div>

          <div className="mt-12">
            <button
              type="button"
              className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
              onClick={UpdatePassword}
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
