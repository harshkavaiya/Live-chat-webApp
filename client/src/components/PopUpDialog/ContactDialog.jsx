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
                      fullname: i.fullname,
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
                        src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                        alt="user"
                        className="object-cover"
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
