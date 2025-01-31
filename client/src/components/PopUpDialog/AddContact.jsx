import React from "react";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useContactList from "../../store/useContactList";

const AddContact = () => {
  const {
    savedName,
    phone,
    isAddLoading,
    setSavedData,
    AddContact,
    clearInputFields,
  } = useContactList();

  const closeDialog = () => {
    clearInputFields(); // Reset state on close
    document.getElementById("AddContactDialog").close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AddContact(); // Add contact directly from Zustand store
  };

  return (
    <dialog id="AddContactDialog" className="modal">
      <div className="modal-box gap-2 w-[90%] h-full sm:h-[75%] flex p-5 bg-base-300 flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Add new contact</h3>
          <RxCross2
            size={18}
            className="cursor-pointer"
            onClick={closeDialog}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            className="input input-bordered"
            value={savedName}
            onChange={(e) => setSavedData(e.target.value, phone)}
            placeholder="Name"
          />
          <input
            type="text"
            className="input input-bordered"
            value={phone}
            onChange={(e) => setSavedData(savedName, e.target.value)}
            placeholder="Phone"
          />

          <button type="submit" className="btn btn-primary">
            {isAddLoading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddContact;
