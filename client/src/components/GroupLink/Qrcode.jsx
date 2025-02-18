import { useState } from "react";
import { FiShare2, FiMoreVertical } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import QRCode from "react-qr-code";

const Qrcode = ({ img, name, inviteLink }) => {
  const [groupLink] = useState(`https://chat.whatsapp.com/${inviteLink}`);

  return (
    <dialog id="QrCode_Modal" className="modal">
      <div className="modal-box p-0">
        <div className="flex justify-between text-primary-content items-center p-2 shadow-lg bg-primary">
          <div className="flex items-center ml-4">
            <h1 className="text-xl font-medium capitalize">QR Code</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary shadow-none">
              <FiShare2 className="h-5 w-5" />
            </button>
            <button className="btn btn-primary shadow-none">
              <FiMoreVertical className="h-5 w-5" />
            </button>

            <button
              onClick={() => document.getElementById("QrCode_Modal").close()}
              className="btn btn-primary shadow-none"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center p-2 space-y-2">
          <img
            src={
              img ||
              "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
            }
            className="h-14 w-14 avatar rounded-full "
          />

          <div className="text-center">
            <h2 className="text-xl font-medium">{name}</h2>
            <p className=" text-sm">BaatCheet group</p>
          </div>
          <div className="p-6 rounded-lg">
            <QRCode
              value={groupLink}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>

          <p className=" text-center max-w-sm my-2">
            This group QR code is private. If it is shared with someone, they
            can scan it with their BaatCheet camera to join this group.
          </p>
        </div>
      </div>
    </dialog>
  );
};

export default Qrcode;
