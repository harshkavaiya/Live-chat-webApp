import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import Peer from "peerjs";
import toast from "react-hot-toast";

const useVideoCall = create((set, get) => ({
  peer: null,
  socket: null,
  localStream: null,
  currentCall: null,
  peerId: "",
  isCallInProgress: false,
  incomingCall: null,
  isMicOn: true,
  isCameraOn: true,
  remotePeerId: "",
  myVideoRef: null,
  peerVideoRef: null,
  callTimeout: null,
  callType: null,

  createPeerId: (userId) => {
    const { peer } = get();
    const { socket } = useAuthStore.getState();
    set({ socket });
    if (peer) {
      console.log("Peer already exists:", peer.id);
      peer.destroy();
    }
    if (userId) {
      const newPeer = new Peer(userId);
      set({ peer: newPeer });

      newPeer.on("open", (id) => {
        set({ peerId: id });
        console.log("My Peer ID:", id);
      });

      newPeer.on("error", (err) => {
        if (err.type === "unavailable-id") {
          console.log("ID is already taken, retrying with a new ID...");
        } else {
          console.error("PeerJS error:", err);
        }
      });
    } else {
      console.log("User ID is null");
    }
  },

  // Initialize Peer and Socket
  initializeVideoCall: (myVideoRef, peerVideoRef) => {
    // Get local media

    set({ myVideoRef, peerVideoRef });
    const { peer, socket } = get();

    // Handle accepted calls
    socket.on("callAccepted", (data) => {
      console.log("Call accepted by:", data.from);
      clearTimeout(get().callTimeout); // Clear the timeout if the call is accepted
      const call = peer.call(get().remotePeerId, get().localStream);
      set({ currentCall: call, isCallInProgress: true });
      console.log("call data", call);
      // Check if peerVideoRef exists and assign remoteStream
      call.on("stream", (remoteStream) => {
        console.log("peerVideoRef is", remoteStream);
        // console.log("initializeVideoCall", peerVideoRef);
        if (peerVideoRef) {
          console.log("Remote stream received.");
          peerVideoRef.srcObject = remoteStream;
        }
      });

      call.on("close", () => {
        console.log("Call closed.");
        get().endCall();
      });
    });
  },

  answerCall: () => {
    const { incomingCall, localStream, peer, socket, peerId } = get();
    // console.log("Incoming call:", incomingCall);
    console.log("Local stream:", localStream);

    if (!incomingCall || !localStream) {
      console.error(
        "Cannot accept call: incomingCall or localStream is missing."
      );
    }

    console.log("Accepting call from:", peerId);

    // Proceed to get the local stream if not available
    if (!localStream) {
      get().GetLocalStream(); // Ensure we have the local stream
    }
    // Once localStream is available, establish the call
    if (peer && incomingCall) {
      const call = peer.call(incomingCall, localStream); // Create the call

      peer.on("call", (call) => {
        console.log("localStream", localStream);
        call.answer(localStream);

        // Handle the stream once the call is established
        call.on("stream", (remoteStream) => {
          console.log("stream-received", remoteStream);
          get().peerVideoRef.srcObject = remoteStream;
        });
      });
      // Set the current call and update the state
      set({ currentCall: call, isCallInProgress: true });

      // Emit an event to notify the server that the call is accepted
      socket.emit("acceptCall", { to: incomingCall, from: peerId });
      // Clear the call timeout once the call is accepted
      clearTimeout(get().callTimeout);
    } else {
      console.error("Error: Peer or incoming call is missing.");
    }
  },

  GetLocalStream: async () => {
    const { callType } = get();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video" ? true : false,
        audio: true,
      });
      set({ localStream: stream });
      console.log("Local stream initialized");
      // Set the local video stream for the UI
      if (get().myVideoRef) {
        get().myVideoRef.srcObject = stream;
      }
    } catch (error) {
      console.error("Failed to get local stream:", error);
      alert("Please allow access to camera and microphone.");
    }
  },

  incomingCallAnswere: (CallerPeerId, callType) => {
    set({ callType });
    // If local stream is not available, fetch it
    if (!get().localStream) {
      console.log("Local stream is missing, fetching...", get().localStream);
      get().GetLocalStream();
    }
    set({ incomingCall: CallerPeerId });
    console.log("Incoming Call Set:", get().incomingCall);
  },

  startCall: (remotePeerId, callType) => {
    set({ callType });
    const { localStream, socket, peerId } = get();

    if (!localStream) {
      console.log("Cannot start call: localStream is not initialized.");
      get().GetLocalStream(); // Fetch the stream if it's missing
    }

    set({ remotePeerId });
    // const call = peer.call(remotePeerId, localStream); // Create the call
    console.log("Calling peer:", remotePeerId);

    // set({ currentCall: call, isCallInProgress: true });

    socket.emit("callOffer", { to: remotePeerId, from: peerId, callType });
    // Set a timeout to automatically reject the call after 15 seconds
    // if (get().incomingCall) {
    const callTimeout = setTimeout(() => {
      console.log("Call timed out - no answer received");
      socket.emit("callRejected", { to: remotePeerId });
      set({ incomingCall: null });
      get().endCall(); // End the call on both sides
      document.getElementById("my_modal_1").close();
      toast.error("Call timed out - No response received.");
    }, 10000); // 15 seconds

    // Save the timeout ID so we can clear it if the call is answered before timeout
    set({ callTimeout });
    // }
  },

  // Reject a call
  rejectCall: () => {
    const { incomingCall, socket } = get();
    if (incomingCall) {
      console.log("reject call by me");
      socket.emit("callRejected", { to: incomingCall });
      set({ incomingCall: null });
      get().endCall();
    }
  },

  // End a call
  endCall: () => {
    const { currentCall, localStream, incomingCall, peerVideoRef, myVideoRef } =
      get();

    if (currentCall) {
      currentCall.close();
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      set({ localStream: null });
    }

    if (peerVideoRef) {
      peerVideoRef.srcObject = null;
    }

    if (myVideoRef) {
      myVideoRef.srcObject = null;
    }

    set({ currentCall: null, incomingCall: null, isCallInProgress: false });
  },
  setIncomming: (incomingCall) => set({ incomingCall }),

  endCallByPeer: () => {
    const { incomingCall, socket, remotePeerId, peerId, isCallInProgress } =
      get();
    // if (isCallInProgress) {
    socket.emit("endCall", {
      to: incomingCall == null ? remotePeerId : incomingCall,
      from: peerId,
    });
    // }

    get().endCall();
  },

  // Toggle microphone
  toggleMic: (mictong) => {
    const { localStream, isMicOn } = get();
    console.log("mic local-", localStream, "mic-", isMicOn);
    const audioTrack = localStream
      ?.getTracks()
      .find((track) => track.kind === "audio");
    console.log("auditrack", audioTrack);
    if (audioTrack) {
      audioTrack.enabled = mictong;
      console.log("mic is : ", mictong);
      set({ isMicOn: audioTrack.enabled });
    }
  },

  // Toggle camera
  toggleCamera: () => {
    const { localStream, isCameraOn } = get();
    const videoTrack = localStream
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      set({ isCameraOn: videoTrack.enabled });
    }
  },
}));

export default useVideoCall;
