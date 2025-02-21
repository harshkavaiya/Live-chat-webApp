import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import Peer from "peerjs";
import toast from "react-hot-toast";

const useVideoCall = create((set, get) => ({
  peer: null,
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
    let { peer } = get();

    if (peer) {
      console.log("Destroying previous peer instance:", peer.id);
      peer.destroy();
      set({ peer: null }); // Reset previous peer instance
    }

    if (userId) {
      const newPeer = new Peer(userId);
      set({ peer: newPeer });

      newPeer.on("open", (id) => {
        set({ peerId: id });
        console.log("My Peer ID:", id);
      });

      newPeer.on("error", (err) => {
        console.error("PeerJS error:", err);
      });

      // Ensure call events are handled every time a peer is created
      newPeer.on("call", (call) => {
        console.log("Receiving call...", call);
        call.answer(get().localStream);

        call.on("stream", (remoteStream) => {
          console.log("Received remote stream", remoteStream);
          if (get().peerVideoRef) {
            get().peerVideoRef.srcObject = remoteStream;
          }
        });

        call.on("close", () => {
          console.log("Call closed.");
          get().endCall();
        });

        set({ currentCall: call, isCallInProgress: true });
      });
    } else {
      console.log("User ID is null");
    }
},

  // Initialize Peer and Socket
  initializeVideoCall: (myVideoRef, peerVideoRef) => {
    // Get local media
    const { peer } = get();
    const { socket } = useAuthStore.getState();

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
    set({ myVideoRef, peerVideoRef });
  },

  answerCall: async () => {
    const { socket } = useAuthStore.getState();
    let { incomingCall, localStream, peer } = get();

    if (!incomingCall) {
      console.error("No incoming call to answer.");
      return;
    }

    if (!localStream) {
      console.log("Fetching local stream before answering...");
      await get().GetLocalStream();
      localStream = get().localStream;
    }

    console.log("Answering call from:", incomingCall);

    if (!peer) {
      console.error("Peer instance is missing. Creating new...");
      get().createPeerId(incomingCall);
      peer = get().peer;
    }

    const call = peer.call(incomingCall, localStream);

    call.on("stream", (remoteStream) => {
      console.log("Remote stream received");
      if (get().peerVideoRef) {
        get().peerVideoRef.srcObject = remoteStream;
      }
    });

    call.on("close", () => {
      console.log("Call ended.");
      get().endCall();
    });

    set({ currentCall: call, isCallInProgress: true });
    socket.emit("acceptCall", { to: incomingCall, from: peer.id });
    clearTimeout(get().callTimeout);
},

  GetLocalStream: async () => {
    const { callType, myVideoRef } = get();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video" ? true : false,
        audio: true,
      });
      set({ localStream: stream });
      console.log("Local stream initialized");
      // Set the local video stream for the UI
      if (myVideoRef) {
        myVideoRef.srcObject = stream;
        set({ myVideoRef });
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

  startCall: async (remotePeerId, callType) => {
    set({ callType });

    const { socket } = useAuthStore.getState();
    let { localStream, peerId, peer } = get();

    if (!localStream) {
      console.log("Fetching local stream before starting the call...");
      await get().GetLocalStream();
      localStream = get().localStream; // Update after fetching
    }

    if (!peer) {
      console.error("Peer instance is missing. Creating a new one...");
      get().createPeerId(peerId);
      peer = get().peer;
    }

    set({ remotePeerId });

    console.log("Calling peer:", remotePeerId);
    socket.emit("callOffer", { to: remotePeerId, from: peerId, callType });

    // Set a timeout to automatically reject the call after 10 seconds
    const callTimeout = setTimeout(() => {
      console.log("Call timed out - no answer received");
      socket.emit("callRejected", { to: remotePeerId });
      set({ incomingCall: null });
      get().endCall();
      toast.error("Call timed out - No response received.");
    }, 10000);

    set({ callTimeout });
},


  // Reject a call
  rejectCall: () => {
    const { socket } = useAuthStore.getState();
    const { incomingCall } = get();
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

    set({
      currentCall: null,
      incomingCall: null,
      isCallInProgress: false,
      peerVideoRef,
      myVideoRef,
    });
  },
  setIncomming: (incomingCall) => set({ incomingCall }),

  endCallByPeer: () => {
    const { socket } = useAuthStore.getState();
    const { incomingCall, remotePeerId, peerId, isCallInProgress } = get();
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
