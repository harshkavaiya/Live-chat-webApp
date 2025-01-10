import { useEffect, useRef } from "react";

export const OpenCloseMenu = (ref) => {
  if (ref.current?.classList?.contains("hidden")) {
    ref.current.classList.remove("hidden");
  } else {
    ref.current?.classList?.add("hidden");
  }
};

export const useOutSideClick = (callback) => {
  const ref = useRef();
  const handleClick = (e) => {
    if (ref?.current && ref.current.contains(e.target)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    //pending
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref]);
  return ref;
};
