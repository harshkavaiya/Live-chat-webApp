import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import Peer from "peerjs";

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

    get().GetLocalStream();
    // Assign local stream to the `myVideo` element
    const { localStream } = get();
    if (myVideoRef && localStream) {
      myVideoRef.srcObject = localStream;
    }

    // Handle accepted calls
    socket.on("callAccepted", (data) => {
      console.log("Call accepted by:", data.from);
      console.log("remotePeerId", get().remotePeerId);
      console.log("localstream", get().localStream);
      const call = peer.call(get().remotePeerId, get().localStream);
      set({ currentCall: call, isCallInProgress: true });
      console.log("call data", call);
      // Check if peerVideoRef exists and assign remoteStream
      call.on("stream", (remoteStream) => {
        console.log("peerVideoRef is", remoteStream);
        if (peerVideoRef) {
          console.log("Remote stream received.");
          peerVideoRef.srcObject = remoteStream;
        }
      });

      call.on("close", () => {
        console.log("Call closed.");
        set({ isCallInProgress: false, currentCall: null });
        if (peerVideoRef) {
          peerVideoRef.srcObject = null;
        }
      });
    });

    // Handle ended calls
    socket.on("callEnded", (data) => {
      console.log("Call ended by:", data.from);
      get().endCall();
    });
  },

  answerCall: () => {
    const { incomingCall, localStream, peer, socket, peerId } = get();
    console.log("Incoming call:", incomingCall);
    console.log("Local stream:", localStream);

    if (!incomingCall || !localStream) {
      console.error(
        "Cannot accept call: incomingCall or localStream is missing."
      );
      return;
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
    } else {
      console.error("Error: Peer or incoming call is missing.");
    }
  },

  GetLocalStream: () => {
    // Get local media
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        console.log("Local stream obtained successfully.");
        set({ localStream: stream });

        // Set the local video stream for the UI
        if (get().myVideoRef) {
          get().myVideoRef.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert(
          "Failed to access media devices. Please check your camera/microphone permissions."
        );
      });
  },

  incomingCallAnswere: (CallerPeerId) => {
    // console.log("Incoming call from:", CallerPeerId);
    set({ incomingCall: CallerPeerId });

    // If local stream is not available, fetch it
    if (!get().localStream) {
      console.log("Local stream is missing, fetching...", get().localStream);
      get().GetLocalStream(); // Ensure the local stream is ready
    }
  },

  startCall: (remotePeerId) => {
    const { peer, localStream, socket, peerId } = get();

    if (!localStream) {
      console.error("Cannot start call: localStream is not initialized.");
      get().GetLocalStream(); // Fetch the stream if it's missing
      return;
    }

    set({ remotePeerId });
    // const call = peer.call(remotePeerId, localStream); // Create the call
    console.log("Calling peer:", remotePeerId);

    // set({ currentCall: call, isCallInProgress: true });

    socket.emit("callOffer", { to: remotePeerId, from: peerId });
  },

  // Reject a call
  rejectCall: () => {
    const { incomingCall, socket } = get();
    if (incomingCall) {
      socket.emit("callRejected", { to: incomingCall });
      set({ incomingCall: null });
    }
  },

  // End a call
  endCall: () => {
    const {
      currentCall,
      localStream,
      incomingCall,
      socket,
      remotePeerId,
      peerId,
      isCallInProgress,
    } = get();
    if (currentCall != null) {
      currentCall.close();
      set({ currentCall: null });
    }

    if (localStream != null) {
      localStream.getTracks().forEach((track) => track.stop());
      set({ localStream: null });
    }

    incomingCall == null
      ? console.log("Incoming call ended.", incomingCall)
      : console.log("Call ended.incomingcalll", incomingCall);
  },

  endCallByPeer: () => {
    const { incomingCall, socket, remotePeerId, peerId, isCallInProgress } =
      get();
    if (isCallInProgress) {
      socket.emit("endCall", {
        to: incomingCall == null ? remotePeerId : incomingCall,
        from: peerId,
      });
      console.log(isCallInProgress);
      set({ isCallInProgress: false });
      get().endCall();
    }
  },

  // Toggle microphone
  toggleMic: () => {
    const { localStream, isMicOn } = get();
    const audioTrack = localStream
      ?.getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
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
