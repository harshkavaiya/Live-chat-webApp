import { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FiUsers, FiUpload } from "react-icons/fi";
import { MdOutlineCloudUpload } from "react-icons/md";
import AddUserGroup from "./AddUserGroup";
import axiosInstance from "../../lib/axiosInstance";
import useMessageStore from "../../store/useMessageStore";

const GroupDialog = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    selectedUsers: [],
  });
  const {messagerUser,setMessagerUser}=useMessageStore(

  )
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [groupType, setGroupType] = useState("");
  const [isOpen, setIsOpenDialog] = useState(false);

  const closeDialog = () => {
    setFormData({ groupName: "", description: "", selectedUsers: [] });
    setPhoto(null);
    setGroupType("");
    document.getElementById("my_modal_5").close();
  };

  const userDialog = () => {
    setIsOpenDialog(true);
    document.getElementById("addUsers").showModal();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPhoto(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateGroup = async () => {
    if (!formData.groupName) {
      alert("Group name is required!");
      return;
    }

    const data = {
      name: formData.groupName,
      description: formData.description,
      type: groupType,
      photo,
      members: JSON.stringify(formData.selectedUsers.map((user) => user.id)),
    };

    try {
      const response = await axiosInstance.post("/group/create", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.data.success) {
        alert(response.data.message);
        return;
      }

      setMessagerUser([response.data.groupInfo, ...messagerUser]);
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
          <div className="flex justify-center items-center">
            <div
              onClick={() => fileInputRef.current.click()}
              className={`w-20 h-20 rounded-full flex items-center cursor-pointer justify-center overflow-hidden border`}
            >
              {photo ? (
                <img
                  src={photo}
                  alt="Group Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <MdOutlineCloudUpload size={22} />
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <input
            type="text"
            name="groupName"
            placeholder="Enter group name"
            className="input input-bordered focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            value={formData.groupName}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="What's this group about?"
            className="w-full textarea textarea-bordered focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            rows={2}
            value={formData.description}
            onChange={handleInputChange}
          />
          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label htmlFor="groupType" className="text-sm">
                Select group type
              </label>
              <select
                className="select select-bordered w-full border py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                id="groupType"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
              >
                <option value="" disabled>
                  Choose Type
                </option>
                <option value="private">🔒 Private</option>
                <option value="public">🌍 Public</option>
              </select>
            </div>
            <div className="w-1/4">
              <label className="text-sm">Selected Users</label>
              <input
                type="text"
                value={formData.selectedUsers.length}
                className="input input-bordered text-center w-full"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex bg-base-100 items-center gap-5 fixed w-full left-0 px-5 pb-5 pt-1 bottom-0">
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
