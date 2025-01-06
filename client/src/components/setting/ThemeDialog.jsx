import React, { useContext } from "react";
import { Themes } from "../../function/Theme";
import { RxCross2 } from "react-icons/rx";
import { ThemeContext } from "../../GlobalStates/ThemeContext";

const ThemeDialog = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <dialog id="theme" className="modal backdrop-blur-sm">
      <div className="modal-box">
        <h3 className="font-bold mb-4 flex justify-between items-center text-lg">
          Choose Your Theme
          <RxCross2
            size={20}
            className="cursor-pointer"
            onClick={() => document.getElementById("theme").close()}
          />
        </h3>

        {/* themes */}

        <div className="grid grid-cols-4 gap-2">
          {Themes.map((t) => (
            <button
              key={t}
              className={`
          group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
            theme === t
              ? "bg-base-300 shadow-primary shadow-2xl"
              : "bg-base-100"
          }`}
              onClick={() => toggleTheme(t)}
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div className="modal-action">
          <form method="dialog" className="w-full">
            <button className="btn w-full">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ThemeDialog;
