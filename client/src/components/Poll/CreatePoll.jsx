import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import useMessageStore from "../../store/useMessageStore";

const CreatePoll = () => {
  const [pollTitle, setPollTitle] = useState("");
  const { sendMessage, currentChatingUser } = useMessageStore();
  const [options, setOptions] = useState([
    { id: "1", text: "", vote: 0 },
    { id: "2", text: "", vote: 0 },
  ]);

  const handleCreatPoll = (data) => {
    sendMessage(
      {
        type: "poll",
        data,
      },
      currentChatingUser
    );
    document.getElementById("Create_poll_model").close();
  };

  const addOption = () => {
    setOptions([...options, { id: Date.now().toString(), text: "" }]);
  };

  const removeOption = (id) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const updateOption = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  return (
    <dialog
      id="Create_poll_model"
      className="modal w-full h-full z-20 bg-transparent"
    >
      <div className="modal-box mx-auto bg-base-100 w-full rounded-xl p-0">
        <div className="px-6 py-4 bg-primary text-primary-content rounded-t-xl relative">
          <h2 className="text-2xl font-bold  text-center">Create a New Poll</h2>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-md text-lg btn-circle btn-ghost absolute right-4 top-2">
              ✕
            </button>
          </form>
        </div>
        <form className="p-6 space-y-6">
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text text-xl">Poll Question?</span>
            </div>
            <input
              type="text"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full rounded-xl outline-none focus:outline-none "
            />
          </label>
          <div className="space-y-4">
            <label className=" w-full">
              <div className="label">
                <span className="label-text text-xl">Poll Question?</span>
              </div>
              {options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="input input-bordered w-full rounded-xl outline-none focus:outline-none  my-2"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
                      aria-label="Remove option"
                    >
                      <FaRegTrashAlt className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </label>
          </div>
          <button
            type="button"
            onClick={addOption}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium"
          >
            <FiPlusCircle className="inline-block mr-2 h-5 w-5" />
            Add Option
          </button>
        </form>
        <div className="px-6 py-4 bg-base-100 border-t border-base-300 rounded-b-xl">
          <button
            onClick={() => handleCreatPoll({ pollTitle, options, voted: [] })}
            className="w-full rounded-md btn btn-primary shadow-sm text-lg font-medium hover:bg-primary/90"
          >
            Create Poll
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CreatePoll;
