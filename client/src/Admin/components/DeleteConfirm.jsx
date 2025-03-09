const DeleteConfirm = ({ isDeleting, deleteData,title }) => {
  return (
    <dialog id="message_delete_Confirm" className="modal z-50">
      <div className="modal-box bg-base-100 relative w-fit gap-5 p-10 flex items-center flex-col">
        <span>
          <p className="text-lg text-center font-semibold">
            Are you sure you want to delete this {title}?
          </p>
          <p className="text-xs text-center">
            This {title} will be deleted permanently.
          </p>
        </span>
        <div className="grid grid-cols-1 gap-3 w-full">
          <button
            className="btn btn-error disabled:cursor-not-allowed"
            disabled={isDeleting}
            onClick={deleteData}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-md" />
            ) : (
              "Yes, sure"
            )}
          </button>
          <button
            className="btn btn-outline"
            onClick={() =>
              document.getElementById("message_delete_Confirm").close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirm;
