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
  }, [groups]);

  useEffect(() => {
    if (groups.inviteLink) {
      QRCode.toDataURL(groups.inviteLink)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code", err);
        });
    }
  }, [groups]);

  if (!groups) return <div>Loading...</div>;

  return (
    <div>
      <h1>{groups.name}</h1>
      <p>{groups.description}</p>
      <img src={groups.photo} alt="Group Photo" />
      <h3>Invite Link QR Code</h3>
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="QR Code" />
      ) : (
        <div>Generating QR code...</div>
      )}
    </div>
  );
};

export default ShowQR;
