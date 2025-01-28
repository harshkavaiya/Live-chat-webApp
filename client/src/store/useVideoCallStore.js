import { create } from "zustand";
import useAuthStore from "./useAuthStore";

const useVideoCallStore = create((set, get) => ({
  peer: new RTCPeerConnection(),
  myStream: null,
  remoteStream: null,
  isCalling: false, // New state to track if a call is ongoing
  callUser: async (id) => {
    const { peer } = get();

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      // Emit the offer to the server
      useAuthStore.getState().socket.emit("call_user", { id, offer });

      // Request user media (local stream)
      await get().getUserMedia();
    } catch (e) {
      console.error("Error occurred in callUser:", e);
    } finally {
      // Reset calling state after attempting to call
    }
  },
  handleRequestCall: async (data) => {
    const { id, offer } = data;
    const { peer } = get();

    try {
      console.log("Handling incoming offer...", data);

      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      // Emit the answer back to the caller
      useAuthStore.getState().socket.emit("call_accept", { answer, id });

      // Request user media (local stream)
      await get().getUserMedia();
    } catch (e) {
      console.error("Error occurred in handleRequestCall:", e);
    } finally {
    }
  },

  handleAcceptedCall: async (answer) => {
    const { peer } = get();

    try {
      console.log(answer, "connected calls");
      await peer.setRemoteDescription(answer);
    } catch (e) {
      console.error("Error occurred in handleAcceptedCall:", e);
    }
  },

  handleNegotiatiton: async () => {
    if (useAuthStore.getState().authUser?._id == "676ccfa646ccd0eedd02d05c")
      return;
    console.log(useAuthStore.getState().authUser);
    await get().callUser("676ccfa646ccd0eedd02d05c");
    
  },

  getUserMedia: async () => {
    try {
      // Check if stream already exists before requesting
      if (get().myStream) return;

      const myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      get().sendStream(myStream);

      set({ myStream });
    } catch (e) {
      console.error("Error occurred in getUserMedia:", e);
    }
  },

  sendStream: (stream) => {
    const { peer } = get();
    try {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        peer.addTrack(track, stream);
      });
    } catch (e) {
      console.error("Error occurred in sendStream:", e);
    }
  },

  trackRemoteStream: (e) => {
    const streams = e.streams;
    if (streams.length > 0) {
      set({ remoteStream: streams[0] });
    }
  },

  cleanup: () => {
    const { peer, myStream } = get();

    // Close the peer connection and stop tracks to clean up
    if (peer) {
      peer.close();
    }

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }

    set({
      peer: new RTCPeerConnection(),
      myStream: null,
      remoteStream: null,
    });
  },
}));

export default useVideoCallStore;
