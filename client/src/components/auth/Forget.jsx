import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";
import { isValidEmail } from "../../function/function";

const Forget = ({ setPage, email, setEmail }) => {
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleForget = async () => {
    setIsLoading(true);
    if (!isValidEmail(email)) return toast.error("Enter Valid Email");
    let res = await axiosInstance.post(`/auth/forget`, { email });
    setIsLoading(false);
    if (res.data.success) {
      toast.success("Otp Send In Email");
      setVerified(true);
    } else {
      toast.error(res.data.message);
    }
  };

  const VerifyOtp = async () => {
    setIsLoading(true);

    let res = await axiosInstance.post(`/auth/OtpVerify`, { otp, email });

    if (res.data.success) {
      toast.success("Verified");
      setOtp("");
      setEmail(email);
      setPage("NewPassword");
    } else {
      toast.error(res.data.message);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-primary/10 text-black font-[sans-serif] p-4">
      <div className="max-w-md w-full mx-auto">
        {verified ? (
          <div className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
            <div className="mb-12">
              <h3 className="text-gray-800 text-3xl font-extrabold">
                Otp Verify
              </h3>
            </div>

            <div className="relative flex items-center">
              <input
                name="otp"
                required
                className="bg-transparent w-full text-sm  text-gray-800 border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <button
                type="button"
                className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
                onClick={VerifyOtp}
              >
                Verify
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
            <div className="mb-12">
              <h3 className="text-gray-800 text-3xl font-extrabold">Sign Up</h3>
            </div>

            <div className="relative flex items-center">
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

            <div className="mt-8">
              <button
                type="button"
                className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
                onClick={handleForget}
              >
                Forget
              </button>
              <p className="text-gray-800 text-sm text-center mt-6">
                You have an account ?
                <button
                  onClick={() => setPage("Login")}
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forget;
