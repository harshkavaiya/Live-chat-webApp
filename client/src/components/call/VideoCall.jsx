import React, { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import Peer from "peerjs";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";

const VideoCall = ({ name, remoteID, setRemoteId }) => {
  const { socket, authUser } = useAuthStore();
  const [peerId, setPeerId] = useState("");
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [incomingCall, setincomingCall] = useState(null);
  const { initializeVideoCall } = useVideoCall();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  useEffect(() => {
    const myVideoReff = document.getElementById("myVideo");
    const peerVideoReff = document.getElementById("peerVideo");
    initializeVideoCall(myVideoReff, peerVideoReff);
    console.log("Video call initialized");
  }, [initializeVideoCall]);

  const Socket = useRef(null);
  const peer = useRef(null);
  const localStream = useRef(null);
  const currentCall = useRef(null);
  useEffect(() => {
    // let userId = authUser._id;
    // if (!userId) {
    //   let userId = "USER_" + Math.floor(Math.random() * 1000);
    //   localStorage.setItem("peerID", userId);
    // }
    // // Initialize PeerJS
    // peer.current = new Peer(userId);
    // // Handle peer ID after peer is ready
    // peer.current.on("open", (id) => {
    //   setPeerId(id);
    //   // Register Peer ID with the server
    //   Socket.current.emit("registerPeerId", id);
    //   console.log("My Peer ID:", id);
    // });
    // peer.current.on("disconnected", () => {
    //   console.log("PeerJS disconnected. Trying to reconnect...");
    //   peer.current.reconnect(); // Attempt to reconnect
    // });
    // peer.current.on("close", () => {
    //   console.log("PeerJS connection closed. Reinitializing...");
    //   peer.current = new Peer(userId); // Reinitialize PeerJS
    // });
    // peer.current.on("error", (err) => {
    //   console.error("PeerJS error:", err);
    // });
    // // Setup socket connection
    // Socket.current = socket;
    // // Handle call acceptance
    // Socket.current.on("callAccepted", (data) => {
    //   console.log("Call accepted by :", data.from);
    //   const call = peer.current.call(remoteID, localStream.current); // Initiate PeerJS call
    //   currentCall.current = call;
    //   setIsCallInProgress(true);
    //   call.on("stream", (remoteStream) => {
    //     if (peerVideoRef.current) {
    //       peerVideoRef.current.srcObject = remoteStream;
    //     }
    //   });
    // call.on("close", () => {
    //   console.log("Call has been closed.");
    //   if (peerVideoRef.current) {
    //     peerVideoRef.current.srcObject = null; // Remote video reset
    //   }
    // if (localStream.current) {
    //   localStream.current.getTracks().forEach((track) => track.stop()); // Local stream stop
    //   localStream.current = null;
    // }
    //     setIsCallInProgress(false); // UI reset
    //   });
    // });
    // Socket.current.on("callEnded", (data) => {
    //   console.log("Call ended by :", data.from);
    //   if (currentCall.current) {
    //     currentCall.current.close(); // End PeerJS call if not already closed
    //     currentCall.current = null;
    //   }
    // if (localStream.current) {
    //   localStream.current.getTracks().forEach((track) => track.stop());
    //   localStream.current = null;
    // }
    // setIsCallInProgress(false);
    // setRemoteId("");
    // setincomingCall(null);
    // // Video elements reset
    // if (peerVideoRef.current) {
    //   peerVideoRef.current.srcObject = null;
    // }
    // if (myVideoRef.current) {
    //   myVideoRef.current.srcObject = null;
    // }
    // Call state reset
  });

  // // Get local media (video and audio)
  // navigator.mediaDevices
  //   .getUserMedia({
  //     video: {
  //       width: { ideal: 1280, max: 1920 },
  //       height: { ideal: 720, max: 1080 },
  //       frameRate: { ideal: 30, max: 60 },
  //     },
  //     audio: {
  //       echoCancellation: true, // Reduces echo in audio
  //       noiseSuppression: true, // Suppress background noise
  //     },
  //   })
  //   .then((stream) => {
  //     localStream.current = stream;
  //   if (myVideoRef.current) {
  //     myVideoRef.current.srcObject = stream;
  //   }
  // })
  // .catch((err) => {
  //   console.error("Error accessing media devices:", err);
  // });

  // // Handle incoming call (when another user calls)
  // peer.current.on("call", (call) => {
  //   currentCall.current = call;
  //   call.answer(localStream.current);
  //   call.on("stream", (remoteStream) => {
  //     if (peerVideoRef.current) {
  //       peerVideoRef.current.srcObject = remoteStream;
  //     }
  //   });
  // });

  //   return () => {
  //     if (Socket.current) {
  //       Socket.current.off("callOffer");
  //       Socket.current.off("callAccepted");
  //       Socket.current.off("callEnded");
  //       Socket.current.disconnect();
  //     }
  //     if (peer.current) peer.current.destroy();
  //   };
  // }, []);

  const switchCamera = async () => {
    const videoTrack = localStream.current
      ?.getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      const currentConstraints = videoTrack.getConstraints();
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      // Switch between front and rear camera
      const currentDeviceId = currentConstraints.deviceId?.exact;
      const nextDeviceIndex =
        (videoDevices.findIndex(
          (device) => device.deviceId === currentDeviceId
        ) +
          1) %
        videoDevices.length;
      const nextDeviceId = videoDevices[nextDeviceIndex]?.deviceId;

      if (nextDeviceId) {
        // Get new stream with the switched camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: nextDeviceId } },
          audio: isMicOn,
        });

        // Replace tracks in the peer connection
        if (currentCall.current) {
          const newVideoTrack = stream.getVideoTracks()[0];
          const sender = currentCall.current.peerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
          if (sender && newVideoTrack) {
            sender.replaceTrack(newVideoTrack);
          }
        }

        // Update the local stream
        localStream.current.getTracks().forEach((track) => track.stop()); // Stop old tracks
        localStream.current = stream;

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      }
    }
  };

  const toggleMic = () => {
    const audioTrack = localStream.current
      ?.getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);

      // Replace the audio track in the peer connection
      const sender = currentCall.current.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "audio");
      if (sender) {
        sender.replaceTrack(audioTrack);
      }
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStream.current
      ?.getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  // Answer incoming call
  const answerCall = () => {
    if (incomingCall) {
      const { from } = incomingCall;
      const call = peer.current.call(from, localStream.current);
      currentCall.current = call;
      setIsCallInProgress(true);

      call.on("stream", (remoteStream) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = remoteStream;
        }
      });

      // Notify caller that the call is accepted
      Socket.current.emit("acceptCall", {
        to: from,
        from: peerId,
      });
    }
  };

  const rejectCall = () => {
    setincomingCall(null);
    // Notify caller via socket
    if (incomingCall) {
      Socket.current.emit("callRejected", { to: incomingCall.from });
    }
  };

  const endCall = () => {
    if (currentCall.current) {
      currentCall.current.close(); // End PeerJS call
      currentCall.current = null; // Reset reference
    }
    // if (localStream.current) {
    //   localStream.current.getTracks().forEach((track) => track.stop()); // Stop local media tracks
    // }
    setIsCallInProgress(false);
    incomingCall && setincomingCall(null);
    Socket.current.emit("endCall", {
      to: incomingCall ? incomingCall.from : remoteID,
      from: peerId,
    });

    console.log("Call ended by me");
  };

  return (
    <dialog id="my_modal_1" className="modal overflow-hidden">
      <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
        {/* Video Screen */}
        <div className="w-full h-full sm:h-screen flex sm:gap-1">
          <div className="w-auto h-10 bg-base-100 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
            <h3 className="font-bold text-base">{name}</h3>
          </div>

          <video
            // Video 1
            ref={myVideoRef}
            id="myVideo"
            autoPlay
            className="h-full sm:h-auto sm:w-1/2 sm:rounded-r-box object-cover"
          />

          <video
            // Video 2
            ref={peerVideoRef}
            id="peerVideo"
            autoPlay
            className="w-36 h-36 sm:h-auto sm:w-1/2 object-cover sm:rounded-r-box rounded-box absolute sm:static bottom-32 right-5"
          />
        </div>

        <CallControl model={1} />
      </div>
    </dialog>
  );
};

export default VideoCall;
