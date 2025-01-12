import { memo, useState } from "react";
import e1 from "../assets/emoji/e1.png";
import e2 from "../assets/emoji/e2.png";
import e3 from "../assets/emoji/e3.png";
import e4 from "../assets/emoji/e4.png";
import e5 from "../assets/emoji/e5.png";
import e6 from "../assets/emoji/e6.png";

const ReactionEmoji = () => {
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

  return (
    <div className="flex z-20">
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
  );
};

export default memo(ReactionEmoji);
