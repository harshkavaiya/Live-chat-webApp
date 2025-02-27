import { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";

const Myprofile = () => {
  const [menuOpen, setMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [nameedit, setnameEdit] = useState(false);
  const [Aboutedit, setAboutEdit] = useState(false);
  const [userName, setUserName] = useState("User");
  const [About, setAbout] = useState("Hi, I'm using this app very happily!");
  const [profileImage, setProfileImage] = useState(
    "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
  );

  const fileInputRef = useRef(null);

  const menuHandler = (e) => {
    const { clientX, clientY } = e;
    setPosition({ top: clientY, left: clientX });
    setMenu(!menuOpen);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("File size should not exceed 2MB.");
      }
    }
  };

  // Trigger the file input click using the ref
  const handleChangeProfilePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto no-select"
      onClick={menuOpen ? () => setMenu(false) : undefined}
    >
      {/* profile text */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>
      {/* user profile */}
      <div className="flex justify-center border-b pb-10 mb-5 items-center">
        <div className="rounded-full relative overflow-hidden sm:w-[10rem] sm:h-[10rem] w-[7rem] h-[7rem]">
          <span
            className={`w-full h-full flex flex-col hover:opacity-100 items-center justify-center rounded-full bg-opacity-30 bg-secondary cursor-pointer opacity-0 ${
              menuOpen && "opacity-100"
            } absolute gap-1 sm:gap-5`}
            onClick={menuHandler}
          >
            <FaCamera size={25} className="text-primary-content" />
            <p className="sm:text-base text-center font-semibold text-primary-content">
              CHANGE PROFILE PHOTO
            </p>
          </span>
          {/* Display the profile image or uploaded image */}
          <img
            src={profileImage}
            alt="myprofile"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* File input for uploading photo */}
      {menuOpen && (
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
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </li>
          <li>
            <a className="text-red-500">
              <MdDelete size={22} />
              Remove
            </a>
          </li>
        </ul>
      )}

      {/* inputs field */}
      <div className="flex flex-col gap-10 px-4">
        <div className="flex gap-2 flex-col">
          <p className="text-sm text-primary">Your Name</p>
          <span className="w-full flex relative">
            <input
              type="text"
              readOnly={!nameedit}
              maxLength={25}
              className={`input w-full px-3 cursor-default bg-transparent 
                ${
                  nameedit
                    ? "input-bordered focus-visible:outline"
                    : "border-none focus-visible:outline-none"
                }
                 `}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            {!nameedit ? (
              <GoPencil
                size={20}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setnameEdit(!nameedit)}
              />
            ) : (
              <>
                <p className="absolute text-sm top-1/2 right-10 transform -translate-y-1/2">
                  {25 - userName.length}
                </p>
                <FaCheck
                  size={20}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setnameEdit(!nameedit)}
                />
              </>
            )}
          </span>
          <p className="text-sm text-primary font-light">
            This is not your username and pin it is shown only as your display
            name
          </p>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="text-sm text-primary">About</p>
          <span className="w-full flex relative">
            <input
              type="text"
              readOnly={!Aboutedit}
              maxLength={50}
              className={`input w-full px-3 pr-8 truncate cursor-default bg-transparent 
                ${
                  Aboutedit
                    ? "input-bordered focus-visible:outline"
                    : "border-none focus-visible:outline-none"
                }
                 `}
              value={About}
              onChange={(e) => setAbout(e.target.value)}
            />

            {!Aboutedit ? (
              <GoPencil
                size={20}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setAboutEdit(!Aboutedit)}
              />
            ) : (
              <>
                <p className="absolute text-sm top-1/2 right-10 transform -translate-y-1/2">
                  {50 - About.length}
                </p>
                <FaCheck
                  size={20}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setAboutEdit(!Aboutedit)}
                />
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
