import { useState, useRef } from "react";
import { FaCamera, FaCross } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import useAuthStore from "../store/useAuthStore";
import useProfileUpdate from "../store/useProfileUpdate";

const Myprofile = () => {
  const { authUser } = useAuthStore.getState();
  const { updateProfile, loading } = useProfileUpdate();
  const [menuOpen, setMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [Edit, setEdit] = useState(false);
  const [userName, setUserName] = useState(authUser.fullname);
  const [About, setAbout] = useState(authUser.about);
  const [Email, setEmail] = useState(authUser.email);
  const [profileImage, setProfileImage] = useState(authUser?.profilePic);
  const [Basepic, setBasepic] = useState(null);

  const fileInputRef = useRef(null);

  const menuHandler = (e) => {
    const { clientX, clientY } = e;
    setPosition({ top: clientY, left: clientX });
    setMenu(!menuOpen);
  };

  const submitData = () => {
    setEdit(!Edit);
    const isProfileChanged =
      userName !== authUser.fullname ||
      Email !== authUser.email ||
      About !== authUser.about ||
      profileImage !== authUser.profilePic ||
      Basepic !== null;

    if (isProfileChanged && Edit) {
      updateProfile(userName, Email, About, Basepic);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
        const reader = new FileReader();
        reader.onloadend = () => {
          // setBasepic(reader.result);
          compressImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("File size should not exceed 2MB.");
      }
    }
  };

  const compressImage = async (base64Str) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxWidth = 500; // Set max width
      const scaleSize = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleSize;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // Reduce quality
      setBasepic(compressedBase64);
    };
  };

  // Trigger the file input click using the ref
  const handleChangeProfilePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const closeEdit = () => {
    setEdit(false);
    setUserName(authUser.fullname);
    setEmail(authUser.email);
    setAbout(authUser.about);
    setProfileImage(authUser.profilePic);
    setBasepic(null);
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto select-none"
      onClick={menuOpen ? () => setMenu(false) : undefined}
    >
      {/* profile text */}
      <div className="p-2 flex items-center  justify-between">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <div className="flex items-center gap-2">
          {Edit && (
            <button
              className={`btn p-2 rounded-full min-h-0 h-10 w-10 border-none btn-circle bg-secondary/80
              `}
              onClick={closeEdit}
            >
              <IoMdClose size={20} />
            </button>
          )}
          <button
            className={`btn p-2 rounded-full min-h-0 h-10 w-10 border-none ${
              Edit ? "btn-circle bg-secondary/80" : "btn-ghost"
            }`}
            onClick={submitData}
            disabled={loading}
          >
            {!Edit ? (
              <GoPencil size={19} />
            ) : loading ? (
              <LuLoaderCircle
                size={20}
                className="animate-spin loading-spinner"
              />
            ) : (
              <FaCheck size={20} />
            )}
          </button>
        </div>
      </div>
      {/* user profile */}
      <div className="flex justify-center border-b pb-4 mb-4 items-center">
        <div className="rounded-full relative overflow-hidden w-[7rem] h-[7rem]">
          <span
            className={`w-full h-full flex flex-col hover:opacity-100 items-center justify-center rounded-full bg-primary-content/60 cursor-pointer opacity-0 ${
              menuOpen && "opacity-100"
            } absolute gap-1`}
            onClick={Edit ? menuHandler : undefined}
          >
            <FaCamera size={15} className="text-white" />
            <p className="text-center font-normal text-white">
              {Edit ? "CHANGE PROFILE PHOTO" : "ENABLE EDIT MODE"}
            </p>
          </span>
          {/* Display the profile image or uploaded image */}
          <img
            src={
              profileImage ||
              "data:image/png;base64,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"
            }
            alt="myprofile"
            className="object-cover object-center w-full h-full"
          />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      {/* File input for uploading photo */}
      {Edit && menuOpen && (
        <ul
          className="menu z-20 absolute bg-base-200 gap-1 rounded-box w-48"
          style={{
            top: position.top + 10,
            left: position.left - 65,
          }}
        >
          <li>
            <label
              htmlFor="file-upload"
              className="flex items-center cursor-pointer"
              onClick={handleChangeProfilePhotoClick}
            >
              <FaFolder size={20} />
              Upload photo
            </label>
          </li>
          <li>
            <span
              className="text-red-500"
              onClick={() => {
                setProfileImage("");
                setBasepic(null);
              }}
            >
              <MdDelete size={22} />
              Remove
            </span>
          </li>
        </ul>
      )}

      {/* inputs field */}
      <div className="flex flex-col gap-3 px-4 sm:mb-0 mb-24">
        <div className="flex gap-2 flex-col">
          <p className="text-sm text-primary">Your Name</p>
          <span className="w-full flex relative">
            <input
              type="text"
              readOnly={!Edit}
              maxLength={25}
              className={`input w-full px-3 input-bordered cursor-default bg-transparent 
                ${Edit ? "focus-visible:outline" : "focus-visible:outline-none"}
                 `}
              value={userName}
              placeholder="User Name"
              onChange={(e) => setUserName(e.target.value)}
            />
            {Edit && (
              <p className="absolute text-sm top-1/2 right-3 transform -translate-y-1/2">
                {25 - userName.length}
              </p>
            )}
          </span>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="text-sm text-primary">Your Email</p>
          <span className="w-full flex relative">
            <input
              type="email"
              readOnly={!Edit}
              maxLength={30}
              className={`input w-full pl-3 pr-7 input-bordered cursor-default bg-transparent 
                ${Edit ? "focus-visible:outline" : "focus-visible:outline-none"}
                 `}
              value={Email}
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {Edit && (
              <p className="absolute text-sm top-1/2 right-3 transform -translate-y-1/2">
                {30 - Email.length}
              </p>
            )}
          </span>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="text-sm text-primary">Your Phone</p>
          <span className="w-full flex relative">
            <input
              type="text"
              readOnly={true}
              className={`input w-full cursor-not-allowed input-disabled px-3 input-bordered bg-transparent 
                ${Edit ? "focus-visible:outline" : "focus-visible:outline-none"}
                 `}
              value={authUser?.phone}
              placeholder="Your phone number"
            />
          </span>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="text-sm text-primary">About</p>
          <span className="w-full flex relative">
            <textarea
              readOnly={!Edit}
              maxLength={50}
              className={`input w-full px-3 pr-8 input-bordered truncate cursor-default resize-none break-words whitespace-pre-wrap bg-transparent 
                ${Edit ? "focus-visible:outline" : "focus-visible:outline-none"}
                 `}
              value={About}
              placeholder="Type something about you"
              onChange={(e) => setAbout(e.target.value)}
            />

            {Edit && (
              <p className="absolute text-sm top-1/2 right-3 transform -translate-y-1/2">
                {50 - About.length}
              </p>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
