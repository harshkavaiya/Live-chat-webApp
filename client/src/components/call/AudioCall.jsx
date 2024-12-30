import React, { useState } from "react";
import CallControl from "./CallControl";
import AudioWave from "./audioWave";

const AudioCall = ({ name }) => {
  const caller = [1, 2, 3, 4, 6, 7];
  const [audioStream, setAudioStream] = useState(null);
  // useEffect(() => {
  //   const startVoiceCall = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //       setAudioStream(stream);
  //     } catch (error) {
  //       console.error("Error accessing microphone", error);
  //     }
  //   };

  //   startVoiceCall();
  // }, []);
  return (
    <dialog id="my_modal_2" className="modal">
      <div
        className={`bg-base-200 w-full h-full grid gap-2 sm:gap-4 p-2 overflow-y-auto
        ${
          caller.length === 2
            ? "sm:grid-cols-2 grid-cols-1"
            : "sm:grid-cols-3 grid-cols-2"
        }
        `}
      >
        {caller.map((i, index) => (
          <div
            key={index}
            className="bg-base-100 flex flex-col items-center  rounded-box p-3"
          >
            <div className="w-full flex items-center justify-center gap-2 sm:gap-0 sm:justify-evenly">
              <div className="w-14 h-14 sm:w-24 sm:h-24 bg-black rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1735533673~exp=1735537273~hmac=84847f1fa605ea9435463f9b4ef4bb57da7a30b64601b1076f57fef7e0e73d85&w=360"
                  alt=""
                  className="object-cover"
                />
              </div>
              <h3 className="sm:text-lg sm:font-semibold capitalize">{name}</h3>
            </div>
            <p className="text-xs mt-3">10:12</p>
            <div className="">{/* <AudioWave audioStream={true} /> */}</div>
          </div>
        ))}
      </div>
      <CallControl model={2} />
    </dialog>
  );
};

export default AudioCall;
