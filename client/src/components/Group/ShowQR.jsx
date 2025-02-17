import React, { useEffect, useState } from "react";
import QRCode from "qrcode"; // Default import for qrcode
import useContactList from "../../store/useContactList";

const ShowQR = () => {
  const { groups, getGroupMessages } = useContactList();
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (groups.length === 0) {
      console.log("not found groups fetching...");
      getGroupMessages();
    }
    console.log("Groups", groups);
    
  }, [groups]);

  useEffect(() => {
    if (groups[0]?.inviteLink) {
      const qrcode =groups[0];
      
      QRCode.toDataURL(qrcode.inviteLink)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code", err);
        });
    }
  }, [groups,getGroupMessages]);

  if (!groups) return <div>Loading...</div>;

  return (
    <div>
      <h1>{groups.name}</h1>
      <p>{groups.description}</p>
      <img src={groups.photo} alt="Group Photo" />
      <h3>Invite Link QR Code</h3>
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="QR Code"className="w-96 h-96" />
      ) : (
        <div>Generating QR code...</div>
      )}
    </div>
  );
};

export default ShowQR;
