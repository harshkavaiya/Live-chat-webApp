import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axiosInstance from "../../lib/axiosInstance";

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
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            QR Code Scanner
          </h2>

          <video ref={videoRef} className="w-full h-64 border rounded-xl" />

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

          {!loading && !qrResult && !error && (
            <p className="text-center text-gray-600">
              Scan a QR code to join a group.
            </p>
          )}

          {/* Action Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => window.location.reload()} // Reload the scanner if needed
              className="btn btn-primary"
            >
              Restart Scanner
            </button>
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
