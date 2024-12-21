import { useState } from "react";
import { MdOutlineCheckCircle } from "react-icons/md";
import { FiBarChart2 } from "react-icons/fi";

const Poll = () => {
  const [options, setOptions] = useState([
    { id: 1, text: "React", votes: 0 },
    { id: 2, text: "Vue", votes: 0 },
    { id: 3, text: "Angular", votes: 0 },
    { id: 4, text: "Svelte", votes: 0 },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoted, setIsVoted] = useState(false);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (selectedOption !== null) {
      setOptions(
        options.map((option) =>
          option.id === selectedOption
            ? { ...option, votes: option.votes + 1 }
            : option
        )
      );
      setIsVoted(true);
    }
  };

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-primary text-primary-content">
        <h2 className="text-2xl font-bold text-center">
          What's your favorite frontend framework?
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={`relative overflow-hidden rounded-lg transition-all ${
              isVoted
                ? "bg-gray-100 cursor-default"
                : "hover:bg-gray-100 cursor-pointer"
            } ${selectedOption === option.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => !isVoted && setSelectedOption(option.id)}
          >
            <div className="relative z-10 flex items-center justify-between p-4">
              <span className="font-medium">{option.text}</span>
              {isVoted && (
                <span className="text-sm font-semibold">
                  {getPercentage(option.votes)}%
                </span>
              )}
            </div>
            {isVoted && (
              <div
                className="absolute inset-0 bg-primary/20 origin-left transition-transform duration-500 ease-out"
                style={{
                  transform: `scaleX(${getPercentage(option.votes) / 100})`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="px-6 py-4  border-t border-base-300">
        {!isVoted ? (
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-content bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdOutlineCheckCircle className="inline-block mr-2 h-5 w-5" />
            Submit Vote
          </button>
        ) : (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              <FiBarChart2 className="inline-block mr-2 h-5 w-5" />
              Total votes: {totalVotes}
            </span>
            <button
              onClick={() => {
                setIsVoted(false);
                setSelectedOption(null);
              }}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
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
