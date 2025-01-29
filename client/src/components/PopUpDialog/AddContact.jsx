import React from "react";
import { RxCross2 } from "react-icons/rx";

const AddContact = () => {
  const closeDialog = () => {
    document.getElementById("AddContactDialog").close();
  };
  return (
    <dialog id="AddContactDialog" className="modal">
      <div className="modal-box gap-2 w-[90%] h-full sm:h-[75%] flex p-5 bg-base-300 flex-col">
        {/* header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Add new contact</h3>
          <RxCross2
            size={18}
            className="cursor-pointer"
            onClick={closeDialog}
          />
        </div>
        {/* user detail */}
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="input input-bordered"
            placeholder="name"
          />
          <input
            type="text"
            className="input input-bordered"
            placeholder="phone"
          />
          <button className="btn btn-primary">Add</button>
        </div>
      </div>
    </dialog>
  );
};

export default AddContact;
