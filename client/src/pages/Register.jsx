import React from "react";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Section with Illustration */}
      <div className="w-1/2 h-screen bg-slate-600 flex items-center justify-center">
        <img
          src="https://img.freepik.com/free-vector/mansplaining-concept-illustration_114360-8948.jpg?t=st=1737950959~exp=1737954559~hmac=d4cec4620b51d2125835017de52e77b5df814958ea06ca9c736c8a8adb639787&w=740"
          alt="Decorative illustration"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Section with Form */}
      <div className="w-1/2 p-5 flex flex-col justify-center">
        <div className="self-end absolute top-5 right-5">
          <span className="text-sm text-gray-600">You have an account? </span>
          <Link
            href="/Login"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Sign in
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>

          <p className="text-sm text-gray-600 mb-6">Sign up to Open account</p>

          <div className="grid grid-cols-1 mb-6">
            <button className="w-full btn btn-outline">
              <FaGoogle />
              Google
            </button>
          </div>

          <div className="divider">
            <p className="text-xs">Or continue with email or mobile</p>
          </div>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="example@gmail.com OR +91 9999999999"
              className="w-full px-4 py-2 input input-bordered placeholder:text-primary"
            />
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full px-4 py-2 input input-bordered placeholder:text-primary"
            />
            <button className="w-full btn btn-primary py-2">
              Start trading
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
