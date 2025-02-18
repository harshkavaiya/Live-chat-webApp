import { useState, useEffect } from "react";
import {
  
  FiShare2,
  FiCopy,
  FiRefreshCw,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineQrCode } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Qrcode from "./Qrcode";
import toast, { Toaster } from "react-hot-toast";

const GroupLink = ({ img, name, inviteLink }) => {
  const [groupLink] = useState(`https://BaatCheet.com/${inviteLink}`);
  const [copied, setCopied] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationDelay(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(groupLink);
    setCopied(true);
    toast.success("Copied..");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <dialog id="groupLinkModal" className="modal">
        <Toaster />
        <div className="modal-box p-0 rounded-xl text-primary-content">
          <div className=" flex items-center p-4 bg-primary shadow-lg relative">
            <h1 className="text-xl font-medium ml-3">Group link</h1>
            <button
              onClick={() => document.getElementById("groupLinkModal").close()}
              className="btn btn-primary border-none shadow-none absolute right-2"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8 bg-base-100 text-base-content">
            <div
              className={`space-y-8 ${
                !animationDelay ? "animate-slide-up" : "opacity-0"
              }`}
            >
              {/* Group Info */}
              <div className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm">
                <img
                  src={
                    img ||
                    "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                  }
                  className="h-14 w-14 avatar rounded-full "
                />

                <div className="flex-1">
                  <h2 className=" font-medium text-lg mb-1 ">{name}</h2>
                  <Link className="text-sm font-medium text-info-content">
                    {groupLink}
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2  flex flex-col">
                <button className="btn">
                  <FaWhatsapp className="h-5 w-5 " />

                  <span className="font-medium">Send link via BaatCheet</span>
                </button>

                <button className="btn" onClick={handleCopy}>
                  <FiCopy className="h-5 w-5 " />

                  <span className="font-medium">
                    {copied ? "Copied!" : "Copy link"}
                  </span>
                </button>

                <button className="btn">
                  <FiShare2 className="h-5 w-5 " />

                  <span className="font-medium">Share link</span>
                </button>

                <button
                  className="btn"
                  onClick={() =>
                    document.getElementById("QrCode_Modal").showModal()
                  }
                >
                  <MdOutlineQrCode className="h-5 w-5 " />

                  <span className="font-medium">QR code</span>
                </button>

                <button className="btn btn-error">
                  <FiRefreshCw className="h-5 w-5" />

                  <span className="font-medium ">Reset link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <Qrcode  name={name} img={img} inviteLink={inviteLink}/>
    </>
  );
};

export default GroupLink;
