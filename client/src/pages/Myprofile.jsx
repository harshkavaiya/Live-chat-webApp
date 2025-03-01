import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { LuCamera } from "react-icons/lu";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

const Myprofile = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const [nameedit, setNameEdit] = useState(false);
  const [Aboutedit, setAboutEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState(authUser.profilePic);
  const [newImage, setNewImage] = useState(null);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [userName, setUserName] = useState(authUser.fullname);
  const [About, setAbout] = useState(authUser.desc || "About You");

  const onChangePhoto = (e) => {
    e.preventDefault();
    setNewImage(e.target.files[0]);
    document.getElementById("image_preview_modal").showModal();
  };

  const handleUploadPhoto = async () => {
    setIsProfileUploading(true);
    let form = new FormData();

    form.append("file", newImage);
    form.append("upload_preset", `Real-time-chat-image`);
    let res = await axios.post(
      `https://api.cloudinary.com/v1_1/dr9twts2b/image/upload`,
      form
    );

    let update = await axiosInstance.put(`auth/update-profile`, {
      profilePic: res.data.secure_url,
    });
    if (update.data.success) {
      document.getElementById("image_preview_modal").close();
      toast.success("Profile Image is Changed");
      setProfilePicture(update.data.updatedUser.profilePic);
      setAuthUser(update.data.updatedUser);
    } else {
      toast.error(update.data.message);
    }
    setIsProfileUploading(false);
  };

  const handleUpdateInfo = async () => {
    let res = await axiosInstance.put(`/auth/update-info`, {
      fullname: userName,
      desc: About,
    });
    if (res.data.success) {
      setUserName(res.data.updatedUser.fullname);
      setAbout(res.data.updatedUser.desc);
      setAuthUser(res.data.updatedUser);
    }
  };
  return (
    <div className="flex flex-col h-full overflow-y-auto no-select">
      {/* profile text */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>
      {/* user profile */}
      <div className="flex justify-center border-b pb-10 mb-5 items-center">
        <div className="rounded-full relative  sm:w-[10rem] sm:h-[10rem] w-[7rem] h-[7rem]">
          {/* Display the profile image or uploaded image */}
          <img
            src={
              profilePicture ||
              "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
            }
            alt="myprofile"
            className="object-cover w-full h-full rounded-full"
          />
          <label
            htmlFor="file-upload"
            className="absolute bg-primary text-primary-content h-9 w-9 sm:h-10 sm:w-10 z-30 rounded-full  cursor-pointer right-0 bottom-0 flex items-center justify-center"
          >
            <LuCamera className="" size={20} />
          </label>

          <input
            type="file"
            id="file-upload"
            accept="image/*"
            className="hidden"
            onChange={onChangePhoto}
          />
        </div>
      </div>

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
                onClick={() => {
                  setNameEdit(!nameedit);
                }}
              />
            ) : (
              <>
                <p className="absolute text-sm top-1/2 right-10 transform -translate-y-1/2">
                  {25 - userName.length}
                </p>
                <FaCheck
                  size={20}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    handleUpdateInfo();
                    setNameEdit(!nameedit);
                  }}
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
                  onClick={() => {
                    handleUpdateInfo();
                    setAboutEdit(!Aboutedit);
                  }}
                />
              </>
            )}
          </span>
        </div>
      </div>

      <dialog id="image_preview_modal" className="modal">
        <div className="modal-box">
          <img src={newImage && URL.createObjectURL(newImage)} />
          <div className="flex items-center justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                setNewImage(null);
                document.getElementById("image_preview_modal").close();
              }}
              className="btn outline-none border-none"
            >
              Close
            </button>
            <button
              onClick={handleUploadPhoto}
              className="btn btn-md btn-primary"
            >
              Upload
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Myprofile;
