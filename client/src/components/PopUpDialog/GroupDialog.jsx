import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FiUsers, FiUpload } from "react-icons/fi";
import { MdOutlineCloudUpload } from "react-icons/md";

const GroupDialog = () => {
  const [image, setImage] = useState(null);
  const closeDialog = () => {
    document.getElementById("my_modal_5").close();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set image preview
      };
      reader.readAsDataURL(file); // Convert image file to data URL
    }
  };
  return (
    <dialog id="my_modal_5" className="modal">
      <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
        {/* header */}
        <div className="flex justify-start gap-2 items-center">
          <FaArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={closeDialog}
          />
          <h3 className="font-bold text-lg">Create a new group</h3>
          <FiUsers size={20} className="text-primary" />
        </div>
        {/* group detail*/}
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4 items-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${
                !image && "border"
              }`}
            >
              {image ? (
                <img
                  src={image}
                  alt="Group Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <MdOutlineCloudUpload size={20} />
              )}
            </div>
            <span className="flex w-[81.80%] items-center space-x-4">
              <input
                type="text"
                placeholder="Group Avatar URL (optional)"
                className="input input-bordered w-full"
              />

              <label htmlFor="file-input" className="btn">
                <FiUpload size={15} />
              </label>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label>Group Name</label>
            <input
              type="text"
              placeholder="Enter group name"
              className="input input-bordered"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label>Description</label>
            <textarea
              id="description"
              className="w-full textarea textarea-bordered"
              placeholder="What's this group about?"
              rows={2}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default GroupDialog;
