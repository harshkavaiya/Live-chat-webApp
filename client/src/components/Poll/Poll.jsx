import { useState } from "react";
import { MdOutlineCheckCircle } from "react-icons/md";
import { FiBarChart2 } from "react-icons/fi";

const Poll = ({ data }) => {
  const { options, pollTitle, votes } = data;
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoted, setIsVoted] = useState(false);

  const totalVotes = options.reduce((sum, option) => sum + option.vote, 0);

  const handleVote = () => {
    if (selectedOption !== null) {
      setIsVoted(true);
    }
  };

  const getPercentage = (vote) => {
    if (totalVotes === 0) return 0;
    return Math.round((vote / totalVotes) * 100);
  };

  return (
    <div className="w-48 sm:w-60 md:w-72 lg:w-80 bg-base-100 text-base-content rounded-lg outline-none border-none p-2">
      <div className="p-1 rounded-xl">
        <h2 className="text-lg font-bold text-center">{pollTitle}</h2>
      </div>
      <div className="p-2 space-y-1">
        {options.map((option, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-lg transition-all border border-primary ${
              isVoted
                ? "cursor-default bg-primary/10"
                : "hover:bg-primary/35 cursor-pointer"
            } ${
              selectedOption === i
                ? "ring-2 ring-primary bg-primary/60 text-primary-content"
                : ""
            }`}
            onClick={() => !isVoted && setSelectedOption(i)}
          >
            <div className="relative  flex items-center justify-between p-1">
              <span className="font-medium">{option.text}</span>
              {isVoted && (
                <span className="text-sm font-semibold">
                  {getPercentage(option.vote)}%
                </span>
              )}
            </div>
            {isVoted && (
              <div
                className="absolute inset-0 bg-primary/20 origin-left transition-transform duration-500 ease-out"
                style={{
                  transform: `scaleX(${getPercentage(option.vote) / 100})`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="px-2 py-2  border-t border-base-300">
        {!isVoted ? (
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className="flex items-center justify-center w-full py-2 px-2 border border-transparent rounded-md  text-sm font-medium text-primary-content bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdOutlineCheckCircle size={20} className="inline-block mr-2" />
            <span>Submit Vote</span>
          </button>
        ) : (
          <div className="flex items-center justify-between text-sm ">
            <span>
              <FiBarChart2 size={20} className="inline-block mr-2 " />
              Total votes: {votes}
            </span>
            <button
              onClick={() => {
                setIsVoted(false);
                setSelectedOption(null);
              }}
              className="text-primary focus:outline-none"
            >
              Vote again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Poll;
