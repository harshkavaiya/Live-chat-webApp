import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import io from "socket.io-client";

const VideoCall = () => {
  const [peerId, setPeerId] = useState("");
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [incomingCall, setincomingCall] = useState(null);

  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  const socket = useRef(null);
  const peer = useRef(null);
  const localStream = useRef(null);
  const currentCall = useRef(null);

  useEffect(() => {
    // Initialize PeerJS
    peer.current = new Peer();

    // Handle peer ID after peer is ready
    peer.current.on("open", (id) => {
      setPeerId(id);
      console.log("My Peer ID:", id);
      // Register Peer ID with the server
      socket.current.emit("registerPeerId", id);
    });

    // Setup socket connection
    socket.current = io.connect("http://localhost:3000");

    // Handle incoming call offer
    socket.current.on("callOffer", (data) => {
      setincomingCall(data);
    });

    // Handle call acceptance
    socket.current.on("callAccepted", (data) => {
      console.log("Call accepted by :", data.from);
      const call = peer.current.call(remotePeerId, localStream.current); // Initiate PeerJS call
      currentCall.current = call;
      setIsCallInProgress(true);

      call.on("stream", (remoteStream) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = remoteStream;
        }
      });

      call.on("close", () => {
        console.log("Call has been closed.");
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = null; // Remote video reset
        }
        // if (localStream.current) {
        //   localStream.current.getTracks().forEach((track) => track.stop()); // Local stream stop
        //   localStream.current = null;
        // }
        setIsCallInProgress(false); // UI reset
      });
    });

    socket.current.on("callEnded", (data) => {
      console.log("Call ended by :", data.from);
      if (currentCall.current) {
        currentCall.current.close(); // End PeerJS call if not already closed
        currentCall.current = null;
      }
      // if (localStream.current) {
      //   localStream.current.getTracks().forEach((track) => track.stop());
      //   localStream.current = null;
      // }

      setIsCallInProgress(false);
      setRemotePeerId("");
      setincomingCall(null);
      // Video elements reset
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = null;
      }

      // if (myVideoRef.current) {
      //   myVideoRef.current.srcObject = null;
      // }

      // Call state reset
    });

    // Get local media (video and audio)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

    // Handle incoming call (when another user calls)
    peer.current.on("call", (call) => {
      currentCall.current = call;
      call.answer(localStream.current);
      call.on("stream", (remoteStream) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = remoteStream;
        }
      });
    });

    return () => {
      if (socket.current) {
        socket.current.off("callOffer");
        socket.current.off("callAccepted");
        socket.current.off("callEnded");
        socket.current.disconnect();
      }
      if (peer.current) peer.current.destroy();
    };
  }, []);

  // Start call (offer)
  const startCall = () => {
    if (!remotePeerId) {
      alert("Enter a valid Peer ID");
      return;
    }
    // Send call offer via socket
    socket.current.emit("callOffer", {
      to: remotePeerId,
      from: peerId,
    });
    console.log("Call offer sent to:", remotePeerId);
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
      socket.current.emit("acceptCall", {
        to: from,
        from: peerId,
      });
    }
  };

  const rejectCall = () => {
    setincomingCall(null);
    // Notify caller via socket
    if (incomingCall) {
      socket.current.emit("callRejected", { to: incomingCall.from });
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
    socket.current.emit("endCall", {
      to: incomingCall ? incomingCall.from : remotePeerId,
      from: peerId,
    });

    console.log("Call ended by me");
  };

  return (
    <div>
      <h1>Peer-to-Peer Video Call</h1>
      <div style={{ display: "flex", gap: "100px" }}>
        <video ref={myVideoRef} autoPlay muted />
        {isCallInProgress && <video ref={peerVideoRef} autoPlay />}
      </div>
      <div>
        <p>My Peer ID: {peerId}</p>
        {!isCallInProgress && (
          <>
            <input
              type="text"
              placeholder="Enter Peer ID to call"
              value={remotePeerId}
              onChange={(e) => setRemotePeerId(e.target.value)}
            />
            <button onClick={() => startCall()}>Start Call</button>
          </>
        )}
        {incomingCall && !isCallInProgress && (
          <div>
            <p>Incoming call from: {incomingCall.from}</p>
            <button onClick={answerCall}>Answer</button>
            <button onClick={rejectCall}>Reject call</button>
          </div>
        )}
        {isCallInProgress && <button onClick={endCall}>endcall</button>}
      </div>
    </div>
  );
};

export default VideoCall;
