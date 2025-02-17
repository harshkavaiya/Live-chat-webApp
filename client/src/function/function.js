export const OpenCloseMenu = (ref) => {
  if (ref.current?.classList?.contains("hidden")) {
    ref.current.classList.remove("hidden");
  } else {
    ref.current?.classList?.add("hidden");
  }
};

export const MemeberProfilePic = (data, id) => {
  const member = data.find((m) => m._id === id);
  return member?.profilePic || null;
};
