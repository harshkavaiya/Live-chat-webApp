import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import useContactList from "../../store/useContactList";
import useSearch from "../../function/SearchFunc";

const AddUserGroup = ({
  isOpen,
  setIsOpenDialog,
  selectedUsers,
  setSelectedUsers,
}) => {
  const { getContactsList, contacts } = useContactList();
  const { searchQuery, filteredData, handleSearchChange } = useSearch(contacts);
  const closeDialog = () => {
    setIsOpenDialog(false);
    document.getElementById("addUsers").close();
  };

  useEffect(() => {
    if (isOpen && contacts.length === 0) {
      getContactsList();
    }
  }, [contacts, isOpen, getContactsList]);

  const handleUserClick = (userId, userFullname) => {
    if (selectedUsers.some((user) => user.id === userId)) {
      setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        { id: userId, fullname: userFullname },
      ]);
    }
  };

  return (
    <dialog id="addUsers" className="modal">
      <div className="modal-box w-[90%] h-full sm:h-[75%] flex p-5 bg-base-300 flex-col">
        {/* header */}
        <div className="flex justify-between gap-2 items-center ">
          <h3 className="font-bold text-lg">Add users to group</h3>
          <RxCross2
            size={18}
            className="cursor-pointer"
            onClick={closeDialog}
          />
        </div>
        {/* search bar */}
        <div className="relative my-2">
          <IoMdSearch size={20} className="absolute inset-y-0 h-full left-4" />
          <input
            type="search"
            className="input w-full input-bordered pl-12"
            placeholder="Search name or phone number"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {/* user list */}
        <div className="overflow-y-auto mb-11">
          {filteredData.length === 0 ? (
            <p className="text-center inset-x-0 inset-y-1/2 absolute">
              No contacts found
            </p>
          ) : (
            filteredData.map((contact) => (
              <div
                key={contact._id}
                onClick={() => handleUserClick(contact._id, contact.fullname)}
                className="flex items-center  justify-between border-b border-base-100 cursor-pointer sm:hover:bg-primary/5 sm:rounded-lg p-1 sm:p-2 pr-4"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-px">
                    <p className="font-semibold">{contact.fullname}</p>
                    <p className="text-sm">bio</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary text-primary-content"
                  checked={selectedUsers.some(
                    (user) => user.id === contact._id
                  )}
                  readOnly
                />
              </div>
            ))
          )}
        </div>
        <div className="w-full p-4 pb-3  absolute bottom-0 left-0">
          <button className="btn w-full btn-primary" onClick={closeDialog}>
            Done
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button></button>
      </form>
    </dialog>
  );
};

export default AddUserGroup;
