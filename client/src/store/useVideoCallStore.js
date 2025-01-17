import { create } from "zustand";
import useAuthStore from "./useAuthStore";

const useVideoCallStore = create((set, get) => ({
  peer: new RTCPeerConnection(),
  myStream: null,
  remoteStream: null,
  handleRequestCall: async ({ offer, id }) => {
    const { peer } = get();
    console.log(offer, id);
    try {
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      useAuthStore
        .getState()
        .socket.emit("call_accept", { answer, id: "676e285fa50bb46cb7b5effd" });
    } catch (e) {
      console.log("error occure in RequestCall", e);
    } finally {
      await get().getUserMedia();
    }
  },
  handleAccpetedCall: async (answer) => {
    try {
      const { peer } = get();
      await peer.setRemoteDescription(answer);
    } catch (e) {
      console.log("error occure in Accpeted Call", e);
    }
  },
  callUser: async (id) => {
    const { peer } = get();
    try {
      let offer = await peer.createOffer();

      await peer.setLocalDescription(offer);
      useAuthStore.getState().socket.emit("call_user", { id, offer });
      await get().getUserMedia();
    } catch (e) {
      console.log("error occure in Call User", e);
    }
  },
  getUserMedia: async () => {
    try {
      let myStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      get().sendStream(myStream);
      set({ myStream });
    } catch (e) {
      console.log("error occure in gerUsermedia", e);
    }
  },
  sendStream: (stream) => {
    const { peer } = get();
    try {
      const tracks = stream.getTracks();
      for (const track of tracks) {
        peer.addTrack(track, stream);
      }
    } catch (e) {
      console.log("error occure in SendStream", e);
    }
  },
  trackRemoteStream: (e) => {
    const streams = e.streams;
    if (streams.length > 0) {
      set({ remoteStream: streams[0] });
    }
  },
  handleNegotiation: (id) => {
    const { peer } = get();
    try {
      const localoffer = peer.localDescription;
      useAuthStore
        .getState()
        .socket.emit("call_user", { id, offer: localoffer });
    } catch (e) {
      console.log("error occure in RequestCall", e);
    }
  },
  handleIceCandidate: (candidate) => {
    const { peer } = get();
    peer.addIceCandidate(new RTCIceCandidate(candidate));
  },
}));

export default useVideoCallStore;
