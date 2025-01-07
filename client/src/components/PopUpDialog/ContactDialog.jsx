import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import useContactList from "../../store/useContactList";

const ContactDialog = () => {
  const { getContactsList, isOpenDialog, setDialogOpen, contacts, isloading } =
    useContactList();
  const closeDialog = () => {
    setDialogOpen(false);
    document.getElementById("my_modal_4").close();
  };
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (isOpenDialog && contacts.length === 0) {
      getContactsList();
    }
  }, [isOpenDialog, contacts, getContactsList]);

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const fullNameMatch = contact.fullname
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      const phoneNumberMatch = contact.phone
        ? contact.phone.includes(debouncedSearchQuery)
        : false;
      return fullNameMatch || phoneNumberMatch;
    });
  }, [contacts, debouncedSearchQuery]);
  return (
    <dialog id="my_modal_4" className="modal">
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
                {filteredContacts.length} contacts
              </div>
            </span>
          </span>
          <span className="w-8 h-8 rounded-full grid place-items-center sm:hover:bg-base-300 cursor-pointer">
            <FaPlus size={20} />
          </span>
        </div>
        {/* search bar */}
        <div className="relative">
          <IoMdSearch size={20} className="absolute inset-y-0 h-full left-4" />
          <input
            type="search"
            className="input w-full input-bordered pl-12"
            placeholder="Search Name or Phone Number"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {/* all Contacts show here */}
        <div className="overflow-y-auto scroll-smooth relative h-full flex flex-col gap-1 py-2 mt-1">
          {filteredContacts.length === 0 ? (
            <p className="text-center inset-x-0 inset-y-1/2 absolute">
              No contacts found
            </p>
          ) : (
            filteredContacts.map((i, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-center p-1 rounded-btn sm:hover:bg-primary/10 cursor-pointer"
              >
                <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                    alt="user"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-px">
                  <p className="font-semibold">{i.fullname}</p>
                  <p className="text-sm">bio</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </dialog>
  );
};

export default ContactDialog;
