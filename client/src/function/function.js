
export const OpenCloseMenu = (ref) => {
  if (ref.current?.classList?.contains("hidden")) {
    ref.current.classList.remove("hidden");
  } else {
    ref.current?.classList?.add("hidden");
  }
};

