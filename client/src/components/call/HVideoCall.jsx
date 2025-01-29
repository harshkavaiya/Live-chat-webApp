import { useCallback, useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCallStore from "../../store/useVideoCallStore";
import CallAcceptpopup from "./CallAcceptpopup";
import CallControl from "./CallControl";
import { GoDotFill } from "react-icons/go";

const VideoCall = () => {
  const { socket } = useAuthStore();
  const [isCall, setIsCall] = useState(false);
  const [isCallAccept, setIsCallAccept] = useState(false);
  const [stream, setStream] = useState(null);
  const [activeDot, setActiveDot] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const localRef = useRef();
  const remoteRef = useRef();
  const {
    callUser,
    handleRequestCall,
    cleanup,
    handleAcceptedCall,

    myStream,
    peer,
    trackRemoteStream,
    remoteStream,
    isCalling,
    setIsCalling,
    handleNegotiatiton,
  } = useVideoCallStore();

  useEffect(() => {
    if (socket) {
      socket.on("receive_call_popup", (id) => {
        setIsCall(true), setReceiver(id);
      });
      socket.on("receive_call_popup_accept", () => {
        callUser("676ccfa646ccd0eedd02d05c");
        setStream(null);
      });
      socket.on("receive_call_popup_rejected", () => {
        setIsCall(false);
        setReceiver(null);
        setStream(null);
        setIsCallAccept(false);
        cleanup();
      });
      socket.on("request_call", handleRequestCall);
      socket.on("call_accepted", handleAcceptedCall);
      socket.on("call_end", () => {
        console.log("end");
        setIsCall(false);
        setStream(null);
        setIsCallAccept(false);
        setReceiver(null);
        cleanup();
      });
      peer.addEventListener("track", trackRemoteStream);
      peer.addEventListener("icegatheringstatechange", handleNegotiatiton);
      peer.addEventListener("negotiationneeded", handleNegotiatiton);
      return () => {
        socket.off("receive_call_popup");
        socket.off("receive_call_popup_accept");
        socket.off("receive_call_popup_rejected");
        socket.off("request_call");
        socket.off("call_accepted");
        socket.off("call_end");
        peer.removeEventListener("track", trackRemoteStream);
        peer.removeEventListener("icegatheringstatechange", handleNegotiatiton);
        peer.removeEventListener("negotiationneeded", handleNegotiatiton);
      };
    }
  }, [
    peer,
    socket,
    handleRequestCall,
    handleAcceptedCall,
    trackRemoteStream,
    callUser,
  ]);

  const handleRequestUser = useCallback(async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setStream(myStream);
    setIsCalling(true);
    setReceiver("676ccfa646ccd0eedd02d05c");
    socket.emit("request_call_popup", "676ccfa646ccd0eedd02d05c");
  });

  useEffect(() => {
    if (socket) {
      if (isCallAccept) {
        socket.emit("request_call_popup_accept", receiver);
        setIsCall(false);
      }
    }
  }, [isCallAccept]);

  useEffect(() => {
    if (!isCall) return;
    const timer = setTimeout(() => {
      handleEndCall(socket);
    }, 5000);

    // Cleanup the timer when the component unmounts or the timer is cleared
    return () => clearTimeout(timer);
  }, [isCall, stream]); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (isCalling) {
      const interval = setInterval(() => {
        setActiveDot((prev) => (prev + 1) % 3);
        if (isCallAccept) {
          setIsCalling(false);
          setStream(null);
          clearInterval(interval);
        }
      }, 400);
      return () => {
        clearInterval(interval);
      };
    } else {
      setActiveDot(0);
    }
  }, [isCalling, isCallAccept]);

  const handleEndCall = useCallback((socket) => {
    if (socket) {
      cleanup();
      socket.emit("call_end", "676ccfa646ccd0eedd02d05c");
      setIsCall(false);
      setStream(null);
      setIsCallAccept(false);
      setReceiver(null);
    }
  }, []);

  useEffect(() => {
    if (localRef.current && myStream) {
      localRef.current.srcObject = myStream;
    }
    if (localRef.current && stream && !myStream) {
      localRef.current.srcObject = stream;
    }
  }, [myStream, stream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <dialog id="my_modal_1" className="modal overflow-hidden modal-open">
      <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
        {/* Video Screen */}

        <button
          className="w-20 h-16 bg-primary disabled:bg-base-300"
          onClick={handleRequestUser}
        >
          Call
        </button>
        <button
          className="w-20 h-16 bg-primary disabled:bg-base-300"
          onClick={() => handleEndCall(socket)}
        >
          end
        </button>
        {isCall && (
          <CallAcceptpopup
            setIsCallAccept={setIsCallAccept}
            setIsCall={setIsCall}
            receiver={receiver}
          />
        )}
        <div className="w-full h-full sm:h-screen flex sm:gap-1">
          <div className="w-auto h-10 bg-base-100 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
            <h3 className="font-bold text-base">Hardik</h3>
          </div>
          {isCalling && (
            <div className="flex items-center justify-center absolute z-20 top-4 left-1/2 transform -translate-x-1/2 gap-2 bg-primary backdrop-blur-sm bg-opacity-20 shadow-lg rounded-btn w-auto h-10 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <GoDotFill
                  key={i}
                  size={activeDot === i ? 30 : 20}
                  className={`transition-all duration-300 ${
                    activeDot === i
                      ? "text-primary -translate-y-1"
                      : "text-gray-700"
                  }`}
                />
              ))}
            </div>
          )}

          {/* <div>
            {isCalling && <p>Calling...</p>}
            <h3>My Video</h3>
            {stream && (
              <ReactPlayer
                url={stream}
                playing={true}
                muted={true}
                width="100%"
                height="100%"
              />
            )}
            <ReactPlayer
              url={myStream}
              playing={true}
              muted={true}
              width="100%"
              height="100%"
            />
          </div> */}
          {/* {remoteStream && (
            <div>
              <h3>Remote Video</h3>
              <ReactPlayer
                url={remoteStream}
                playing={true}
                width="100%"
                height="100%"
              />
            </div>
          )} */}

          <video
            // Video 1
            ref={localRef}
            autoPlay
            muted
            className={`transition-all z-10 duration-500 ease-in-out sm:h-auto ${
              isCalling
                ? "sm:w-1/2 w-36 h-36 rounded-box sm:rounded-none absolute sm:static bottom-32 right-5 scale-90 sm:scale-100"
                : "w-full h-full scale-100"
            }  sm:rounded-r-box object-cover`}
          />

          <video
            // Video 2
            ref={remoteRef}
            autoPlay
            className={`w-full h-full sm:h-auto z-0 ${
              isCallAccept && "hidden"
            } sm:w-1/2 object-cover sm:rounded-l-box`}
          />
        </div>
        {myStream && <CallControl model={1} handleEndCall={handleEndCall} />}
      </div>
    </dialog>
  );
};

export default VideoCall;
