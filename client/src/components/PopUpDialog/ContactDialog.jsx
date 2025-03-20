import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import useContactList from "../../store/useContactList";
import useSearch from "../../function/SearchFunc";
import AddContact from "./AddContact";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";

const ContactDialog = () => {
  const {
    getContactsList,
    isOpenDialog,
    setDialogOpen,
    contacts,
    deleteuserContact,
    isloading,
  } = useContactList();
  const { selectUsertoChat } = useMessageStore();
  const { authUser } = useAuthStore();
  const { searchQuery, filteredData, handleSearchChange } = useSearch(contacts);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const closeDialog = () => {
    setDialogOpen(false);
    document.getElementById("my_modal_4").close();
  };
  const Addcontact = () => {
    document.getElementById("AddContactDialog").showModal();
  };
  const deleteContact = (userId) => {
    document.getElementById("deleteConfirm").showModal();
    // `userId` ko state mein store karo, jisse confirm button pe use kar sake
    setConfirmDeleteId(userId);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      deleteuserContact(confirmDeleteId); // Confirm ke baad delete function ko call karo
      document.getElementById("deleteConfirm").close(); // Modal band karo
    }
  };
  useEffect(() => {
    if (isOpenDialog && contacts.length === 0) {
      getContactsList();
    }
  }, [isOpenDialog, contacts, getContactsList]);

  return (
    <>
      <AddContact />
      <dialog id="my_modal_4" className="modal z-0">
        <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
          {/* header */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <FaArrowLeft
                size={18}
                className="cursor-pointer"
                onClick={closeDialog}
              />
              <span className="flex flex-col items-center justify-center">
                <h3 className="font-bold text-lg">Contacts</h3>
                <div className="badge badge-ghost rounded-btn text-xs">
                  {filteredData.length} contacts
                </div>
              </span>
            </span>
            <span
              className="w-8 h-8 rounded-full grid place-items-center sm:hover:bg-base-300 cursor-pointer"
              onClick={Addcontact}
            >
              <FaPlus size={20} />
            </span>
          </div>
          {/* search bar */}
          <div className="relative">
            <IoMdSearch
              size={20}
              className="absolute inset-y-0 h-full left-4"
            />
            <input
              type="search"
              className="input w-full input-bordered pl-12"
              placeholder="Search name or phone number"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* all Contacts show here */}
          <div className="overflow-y-auto scroll-smooth relative h-full flex flex-col gap-1 py-2 mt-1">
            {isloading ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AiOutlineLoading3Quarters size={30} className="animate-spin" />
              </div>
            ) : filteredData.length === 0 ? (
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                No contacts found
              </p>
            ) : (
              filteredData.map((i, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    selectUsertoChat({
                      _id: i._id,
                      phone: i.phone,
                      email: i.email,
                      fullname: i.savedName,
                      profilePic: i.profilePic,
                      savedName: i.savedName,
                      sender: authUser._id,
                      receiver: i._id,
                      type: "Single",
                      lastMessage: null,
                      lastMessageTime: new Date(),
                      lastMessageType: null,
                    });
                    document.getElementById("my_modal_4").close();
                  }}
                  className="flex  items-center justify-between p-1 rounded-btn sm:hover:bg-primary/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                      <img
                        src={
                          i.profilePic ||
                          "data:image/png;base64,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"
                        }
                        alt="user"
                        className="object-cover w-full h-full object-center"
                      />
                    </div>
                    <div className="flex flex-col gap-px">
                      <p className="font-semibold">{i.savedName}</p>
                      <p className="text-sm">{i.about}</p>
                    </div>
                  </div>
                  <div className="sm:mr-3" onClick={() => deleteContact(i._id)}>
                    <MdDelete size={22} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </dialog>
      <dialog id="deleteConfirm" className="modal">
        <div className="modal-box bg-base-100 relative w-fit gap-5 p-10 flex items-center flex-col">
          <span>
            <p className="text-lg text-center font-semibold">
              Are you sure you want to delete this contact?
            </p>
            <p className="text-xs text-center">
              This contact will be deleted permanently.
            </p>
          </span>
          <div className="grid grid-cols-1 gap-3 w-full">
            <button className="btn btn-error" onClick={handleDeleteConfirm}>
              Yes, sure
            </button>
            <button
              className="btn btn-outline"
              onClick={() => document.getElementById("deleteConfirm").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ContactDialog;
