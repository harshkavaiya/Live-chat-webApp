import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useContactList from "../../store/useContactList";
import toast from "react-hot-toast";

const AddContact = () => {
  const { AddContact, isAddLoading } = useContactList();
  const [newUser, setNewUser] = useState({
    savedName: "",
    phone: "",
  });
  const closeDialog = () => {
    document.getElementById("AddContactDialog").close();
  };
  const addusers = (e) => {
    e.preventDefault();
    if (newUser.savedName && newUser.phone) {
      AddContact(newUser.savedName, newUser.phone);
    } else {
      toast.error("Both filed required", { id: "field" });
    }
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
        <form onSubmit={addusers} className="flex flex-col gap-2">
          <input
            type="text"
            className="input input-bordered"
            value={newUser.savedName}
            onChange={(e) =>
              setNewUser({ ...newUser, savedName: e.target.value })
            }
            placeholder="name"
          />
          <input
            type="text"
            className="input input-bordered"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="phone"
          />

          <button type="submit" className="btn btn-primary">
            {isAddLoading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "add"
            )}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddContact;
