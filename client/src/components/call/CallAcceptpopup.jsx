import useAuthStore from "../../store/useAuthStore";

const CallAcceptpopup = ({ setIsCallAccept, setIsCall, receiver }) => {
  const { socket } = useAuthStore();
  return (
    <>
      <dialog className={`modal modal-open`}>
        <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
          <p>call from : {receiver}</p>
          <button className="btn" onClick={() => setIsCallAccept(true)}>
            accept
          </button>
          <button
            onClick={() => {
              socket.emit("request_call_popup_rejected", receiver);
              setIsCall(false);
            }}
            className="btn"
          >
            reject
          </button>
        </div>
      </dialog>
    </>
  );
};

export default CallAcceptpopup;
