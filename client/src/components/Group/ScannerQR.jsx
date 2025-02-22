import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";

// QRScanner component
const QRScanner = ({ open, setOpen }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const { authUser } = useAuthStore();
  const { setMessagerUser, messagerUser, setCurrentChatingUser } =
    useMessageStore();
  const joinGroup = async (inviteLink) => {
    try {
      const res = await axiosInstance.post(`group/join/${inviteLink}`, {
        name: authUser.name,
        profilePic: authUser.profilePic,
      });

      if (res.data.success == 2) {
        toast.success(res.data.message);
        let group = messagerUser.find((user) => user._id == res.data.id);
        setCurrentChatingUser(group);
      } else if (res.data.success == 1) {
        toast.success("Successfully joined the group!");
        setMessagerUser([res.data.group, ...messagerUser]);
        setCurrentChatingUser(res.data.group);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Join Group Error:", err);
      document.getElementById("Qr_scanner").close();
      toast.error("Internal Server Error");
    } finally {
      setOpen(false);
      document.getElementById("Qr_scanner").close();
    }
  };

  useEffect(() => {
    // Initialize QR scanner when component mounts

    if (!open) return;

    if (!videoRef?.current) return;

    qrScannerRef.current = new QrScanner(videoRef.current, (result) => {
      console.log("QR Result", result);

      if (result) {
        joinGroup(result); // Call the joinGroup function with the scanned result (invite link)
        qrScannerRef.current.stop(); // Stop the scanner after successful scan
      }
    });

    qrScannerRef.current.start();

    return () => {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
    };
  }, [open]);

  return (
    <dialog id="Qr_scanner" className="modal">
      <div className="modal-box">
        <div className="max-w-md w-full flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold text-center">
            Scan To Join Group
          </h2>

          <div className="w-64 h-64 border relative text-center flex justify-center items-center rounded-lg overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <img
              src="qrPic.gif"
              alt="qr scanner gif"
              className="absolute w-52"
            />
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default QRScanner;
