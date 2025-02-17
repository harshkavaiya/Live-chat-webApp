import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import axios from 'axios'; // Import axios for API calls
import axiosInstance from '../../lib/axiosInstance';

// QRScanner component
const QRScanner = () => {
  const [qrResult, setQrResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null); // Reference to the video element
  const qrScannerRef = useRef(null); // Reference to the QR scanner instance

  const joinGroup = async (inviteLink) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`group/join/${inviteLink}`); 
      
      if (response.data.success) {
        setQrResult('Successfully joined the group!');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error joining the group.');
      console.error('Join Group Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize QR scanner when component mounts
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(videoRef.current, (result) => {
        setQrResult(result); // Update state with the scanned result
console.log("QR Result",result);

        if (result) {
          joinGroup(result); // Call the joinGroup function with the scanned result (invite link)
          qrScannerRef.current.stop(); // Stop the scanner after successful scan
        }
      });

      qrScannerRef.current.start(); // Start scanning

      // Cleanup on unmount
      return () => {
        qrScannerRef.current.stop();
      };
    }
  }, []);

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video ref={videoRef} style={{ width: '100%' }}></video> {/* Video feed */}
      {loading && <p>Joining group...</p>}
      {qrResult && !loading && <p>{qrResult}</p>} {/* Display success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
      {!loading && !qrResult && !error && <p>Scan a QR code to join a group.</p>}
    </div>
  );
};

export default QRScanner;
