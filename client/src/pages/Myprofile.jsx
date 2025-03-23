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
               "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
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
