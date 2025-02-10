import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FiUsers, FiUpload } from "react-icons/fi";
import { MdOutlineCloudUpload } from "react-icons/md";
import AddUserGroup from "./AddUserGroup";
import axiosInstance from "../../lib/axiosInstance";

const GroupDialog = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    selectedUsers: [],
  });

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpenDialog] = useState(false);

  const closeDialog = () => document.getElementById("my_modal_5").close();
  const userDialog = () => {
    setIsOpenDialog(true);
    document.getElementById("addUsers").showModal();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateGroup = async () => {
    if (!formData.groupName.trim()) {
      alert("Group Name is required!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.groupName);
    data.append("description", formData.description);
    data.append(
      "members",
      JSON.stringify(formData.selectedUsers.map((u) => u.id))
    );
    if (file) data.append("photo", file);

    try {
      const response = await axiosInstance.post("/group/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Group created:", response.data);
      alert("Group successfully created!");
      closeDialog();
    } catch (error) {
      console.error(
        "Error creating group:",
        error.response?.data || error.message
      );
      alert(
        "Failed to create group: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <dialog id="my_modal_5" className="modal">
      <AddUserGroup
        isOpen={isOpen}
        setIsOpenDialog={setIsOpenDialog}
        selectedUsers={formData.selectedUsers}
        setSelectedUsers={(users) =>
          setFormData({ ...formData, selectedUsers: users })
        }
      />

      <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
        {/* Header */}
        <div className="flex justify-start gap-2 items-center">
          <FaArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={closeDialog}
          />
          <h3 className="font-bold text-lg">Create a new group</h3>
          <FiUsers size={20} className="text-primary" />
        </div>

        {/* Group Details */}
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
                <MdOutlineCloudUpload size={22} />
              )}
            </div>
            <label htmlFor="file-input" className="btn">
              <FiUpload size={15} />
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            name="groupName"
            placeholder="Enter group name"
            className="input input-bordered"
            value={formData.groupName}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="What's this group about?"
            className="w-full textarea textarea-bordered"
            rows={2}
            value={formData.description}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-3 gap-2">
            {formData.selectedUsers.map((user) => (
              <p key={user.id} className="text-center">
                {user.fullname}
              </p>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-5 fixed w-full left-0 p-5 bottom-0">
          <button className="btn btn-error flex-1" onClick={closeDialog}>
            Cancel
          </button>
          <button className="btn btn-outline flex-1" onClick={userDialog}>
            Add Users
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleCreateGroup}
          >
            Create Group
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default GroupDialog;
