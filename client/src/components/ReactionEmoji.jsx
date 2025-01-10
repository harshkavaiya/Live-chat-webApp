import { memo, useEffect, useState } from "react";
import e1 from "../assets/emoji/e1.png";
import e2 from "../assets/emoji/e2.png";
import e3 from "../assets/emoji/e3.png";
import e4 from "../assets/emoji/e4.png";
import e5 from "../assets/emoji/e5.png";
import e6 from "../assets/emoji/e6.png";
const ReactionEmoji = ({ position, ref, setPosition }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);

  const reactions = [
    { id: 1, emoji: e1, label: "Like" },
    { id: 2, emoji: e2, label: "Love" },
    { id: 3, emoji: e3, label: "Haha" },
    { id: 4, emoji: e4, label: "Wow" },
    { id: 5, emoji: e5, label: "Sad" },
    { id: 6, emoji: e6, label: "Pray" },
  ];

  const handleReactionSelect = (reaction) => {
    setSelectedReaction(reaction);
    setIsOpen(false);
  };

  const handleOutSideClick = (e) => {
    if (ref?.current && ref.current?.contains(e?.target)) {
      setPosition({ x: 0, y: 0, open: false });
      console.log("yes");
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutSideClick);
    //pending
    return () => {
      document.removeEventListener("click", handleOutSideClick);
    };
  }, []);

  return (
    position.open && (
      <div
        ref={ref}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-106%, -120%)",
        }}
        className="absolute w-full mb-2 z-10 p-2 flex items-center justify-center gap-1 "
      >
        <div className="bg-base-100 h-fit rounded-full px-2 shadow-lg border">
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => handleReactionSelect(reaction)}
              className="transition-transform hover:scale-110 focus:outline-none"
              title={reaction.label}
            >
              <img className="h-10 w-10" src={reaction.emoji} />
            </button>
          ))}
        </div>
      </div>
    )
  );
};

export default memo(ReactionEmoji);
