import { memo } from "react";
import e1 from "../assets/emoji/e1.png";
import e2 from "../assets/emoji/e2.png";
import e3 from "../assets/emoji/e3.png";
import e4 from "../assets/emoji/e4.png";
import e5 from "../assets/emoji/e5.png";
import e6 from "../assets/emoji/e6.png";
import useMessageStore from "../store/useMessageStore";
import { useQueryClient } from "@tanstack/react-query";

const ReactionEmoji = ({ index }) => {
  const { SendMessageReaction } = useMessageStore();
  const queryClient=useQueryClient()

  const handleReactionSelect = (reaction) => {
    SendMessageReaction({ id: reaction.id, label: reaction.label }, index,queryClient);
  };

  return (
    <div className="flex z-20 gap-x-2 gap-y-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() => handleReactionSelect(reaction)}
          className="transition-transform hover:scale-110 focus:outline-none"
          title={reaction.label}
        >
          <img className="h-8 w-8" src={reaction.emoji} />
        </button>
      ))}
    </div>
  );
};

export const reactions = [
  { id: 1, emoji: e1, label: "Like" },
  { id: 2, emoji: e2, label: "Love" },
  { id: 3, emoji: e3, label: "Haha" },
  { id: 4, emoji: e4, label: "Wow" },
  { id: 5, emoji: e5, label: "Sad" },
  { id: 6, emoji: e6, label: "Pray" },
];

export default memo(ReactionEmoji);
