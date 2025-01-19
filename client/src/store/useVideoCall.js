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

    // Handle accepted calls
    socket.on("callAccepted", (data) => {
      console.log("Call accepted by:", data.from);
      const call = peer.call(get().remotePeerId, get().localStream);
      set({ currentCall: call, isCallInProgress: true });
      // Check if peerVideoRef exists and assign remoteStream
      call.on("stream", (remoteStream) => {
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

    console.log("Accepting call from:", incomingCall);

    // Proceed to get the local stream if not available
    if (!localStream) {
      get().GetLocalStream(); // Ensure we have the local stream
    }
    // Once localStream is available, establish the call
    if (peer && incomingCall) {
      const call = peer.call(incomingCall, localStream); // Create the call

      // Handle the stream once the call is established
      call.on("stream", (remoteStream) => {
        if (get().peerVideoRef) {
          console.log("stream received");
          get().peerVideoRef.srcObject = remoteStream;
        }
      });
      // Set the current call and update the state
      set({ currentCall: call, isCallInProgress: true });

      // Emit an event to notify the server that the call is accepted
      socket.emit("acceptCall", { to: incomingCall, from: peerId });
    } else {
      console.error("Error: Peer or incoming call is missing.");
    }
  },

  // answerCall: () => {
  //   const { incomingCall, localStream, peer, socket, peerId } = get();

  //   // Debugging the values
  //   console.log("Incoming call:", incomingCall);
  //   console.log("Local stream:", localStream);

  //   if (!incomingCall || !localStream) {
  //     console.error(
  //       "Cannot accept call: incomingCall or localStream is missing."
  //     );
  //     return;
  //   }

  //   console.log("Accepting call from:", incomingCall);

  //   // Proceed to get the local stream if not available
  //   if (!localStream) {
  //     get().GetLocalStream(); // This ensures we have the local stream
  //   }
  //   // Once localStream is available, establish the call
  //   if (peer && incomingCall) {
  //     const call = peer.call(incomingCall, localStream); // Create the call

  //     // Handle the stream once the call is established
  //     call.on("stream", (remoteStream) => {
  //       if (get().peerVideoRef.current) {
  //         get().peerVideoRef.current.srcObject = remoteStream;
  //       }
  //     });
  //     // Set the current call and update the state
  //     set({ currentCall: call, isCallInProgress: true });

  //     // Emit an event to notify the server that the call is accepted
  //     socket.emit("acceptCall", { to: incomingCall, from: peerId });
  //   } else {
  //     console.error("Error: Peer or incoming call is missing.");
  //   }
  // },

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
    console.log("Incoming call from:", CallerPeerId);
    set({ incomingCall: CallerPeerId });

    // If local stream is not available, fetch it
    if (!get().localStream) {
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
    const call = peer.call(remotePeerId, localStream); // Create the call
    console.log("Calling peer:", remotePeerId);

    set({ currentCall: call, isCallInProgress: true });

    call.on("stream", (remoteStream) => {
      if (get().peerVideoRef) {
        console.log("Remote stream received, displaying.");
        get().peerVideoRef.srcObject = remoteStream;
      }
    });

    call.on("close", () => {
      console.log("Call closed.");
      set({ isCallInProgress: false, currentCall: null });
    });

    socket.emit("callOffer", { to: remotePeerId, from: peerId });
  },

  // Start a call
  // startCall: (remotePeerId) => {
  //   const { peer, localStream, socket, peerId } = get();
  //   // Check if peer or localStream is undefined
  //   if (!peer || !localStream) {
  //     console.error(
  //       "Cannot start call: peer or localStream is not initialized."
  //     );
  //     return; // Prevent call if peer or localStream is not initialized
  //   }
  //   set({ remotePeerId });
  //   const call = peer.call(remotePeerId, localStream);
  //   console.log("Calling peer:", remotePeerId);

  //   set({ currentCall: call, isCallInProgress: true });

  //   call.on("stream", (remoteStream) => {
  //     if (get().peerVideoRef) {
  //       get().peerVideoRef.srcObject = remoteStream;
  //     }
  //   });

  //   call.on("close", () => {
  //     console.log("Call closed.");
  //     set({ isCallInProgress: false, currentCall: null });
  //   });

  //   socket.emit("callOffer", { to: remotePeerId, from: peerId });
  // },

  // Answer a call
  // answerCall: () => {
  //   const { incomingCall, localStream, peer, socket, peerId } = get();
  //   console.log("accepting call", incomingCall);
  //   if (incomingCall) {
  //     const call = peer.call(incomingCall, localStream);
  //     // const call = peer.current.call(from, localStream.current);
  //     set({ currentCall: call, isCallInProgress: true });
  //     call.on("stream", (remoteStream) => {
  //       if (get().peerVideoRef) {
  //         get().peerVideoRef.srcObject = remoteStream;
  //       }
  //     });
  //     socket.emit("acceptCall", { to: incomingCall, from: peerId });
  //   }
  // },

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
    const { currentCall, localStream, socket, remotePeerId, peerId } = get();
    if (currentCall) {
      currentCall.close();
      set({ currentCall: null });
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      set({ localStream: null });
    }

    set({ isCallInProgress: false });
    socket.emit("endCall", { to: remotePeerId, from: peerId });
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
