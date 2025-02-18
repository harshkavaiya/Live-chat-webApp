import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

// QRScanner component
const QRScanner = () => {
  const [qrResult, setQrResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const joinGroup = async (inviteLink) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`group/join/${inviteLink}`);
      if (response.data.success) {
        setQrResult("Successfully joined the group!");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error joining the group.");
      console.error("Join Group Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize QR scanner when component mounts
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(videoRef.current, (result) => {
        setQrResult(result); // Update state with the scanned result
        console.log("QR Result", result);

        if (result) {
          joinGroup(result); // Call the joinGroup function with the scanned result (invite link)
          qrScannerRef.current.stop(); // Stop the scanner after successful scan
          toast.success("Successfully joined the group!");
          document.getElementById("Qr_scanner").close();
        }
      });

      qrScannerRef.current.start();

      return () => {
        qrScannerRef.current.stop();
      };
    }
  }, []);

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

          {/* Conditional Loading, Success, Error Messages */}
          {loading && (
            <div className="alert alert-info mb-4">
              <span>Joining group...</span>
            </div>
          )}

          {qrResult && !loading && (
            <div className="alert alert-success mb-4">
              <span>{qrResult}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default QRScanner;
