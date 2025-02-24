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
  Ringing: false,
  setRinging: (Ringing) => {
    set({ Ringing });
  },
  createPeerId: (userId) => {
    let { peer } = get();

    if (peer) {
      peer.destroy();
      set({ peer: null }); // Reset previous peer instance
    }

    if (userId) {
      const newPeer = new Peer(userId);
      set({ peer: newPeer });

      newPeer.on("open", (id) => {
        set({ peerId: id });
      });

      newPeer.on("error", (err) => {
        console.error("PeerJS error:", err);
      });

      // Ensure call events are handled every time a peer is created
      newPeer.on("call", (call) => {
        call.answer(get().localStream);

        call.on("stream", (remoteStream) => {
          if (get().peerVideoRef) {
            get().peerVideoRef.srcObject = remoteStream;
          }
        });

        call.on("close", () => {
          get().endCall();
        });

        set({ currentCall: call, isCallInProgress: true });
      });
    }
  },

  // Initialize Peer and Socket
  initializeVideoCall: (myVideoRef, peerVideoRef) => {
    // Get local media

    const { socket } = useAuthStore.getState();
    set({ myVideoRef, peerVideoRef });
    // Handle accepted calls
    socket.on("callAccepted", (data) => {
      clearTimeout(get().callTimeout); // Clear the timeout if the call is accepted
      const call = get().peer.call(data.from, get().localStream);
      set({ currentCall: call, isCallInProgress: true });

      call.on("stream", (remoteStream) => {
        if (peerVideoRef) {
          peerVideoRef.srcObject = remoteStream;
        }
      });

      call.on("close", () => {
        get().endCall();
      });
    });
  },

  answerCall: async () => {
    const { socket } = useAuthStore.getState();
    let { incomingCall, localStream, peer } = get();

    if (!incomingCall) {
      return;
    }

    if (!localStream) {
      await get().GetLocalStream();
      localStream = get().localStream;
    }

    if (!peer) {
      get().createPeerId(incomingCall);
      peer = get().peer;
    }

    const call = peer.call(incomingCall, localStream);

    call.on("stream", (remoteStream) => {
      if (get().peerVideoRef) {
        get().peerVideoRef.srcObject = remoteStream;
      }
    });

    call.on("close", () => {
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
        video: callType === "video",
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
      get().GetLocalStream();
    }
    set({ incomingCall: CallerPeerId });
  },

  startCall: async (remotePeerId, callType) => {
    set({ callType });

    const { socket } = useAuthStore.getState();
    let { localStream, peerId, peer } = get();

    if (!localStream) {
      await get().GetLocalStream();
      localStream = get().localStream; // Update after fetching
    }

    if (!peer) {
      get().createPeerId(peerId);
      peer = get().peer;
    }

    set({ remotePeerId });

    socket.emit("callOffer", { to: remotePeerId, from: peerId, callType });

    // Set a timeout to automatically reject the call after 10 seconds
    const callTimeout = setTimeout(() => {
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
    if (get().incomingCall) {
      socket.emit("callRejected", { to: get().incomingCall });
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
    const { incomingCall, remotePeerId, peerId } = get();
    socket.emit("endCall", {
      to: incomingCall == null ? remotePeerId : incomingCall,
      from: peerId,
    });

    get().endCall();
  },

  // Toggle microphone
  toggleMic: (mictong) => {
    const { localStream, isMicOn } = get();

    const audioTrack = localStream
      ?.getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = mictong;

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
