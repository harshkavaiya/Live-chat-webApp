import { create } from "zustand";

const useMediaStore = create((set, get) => ({
  mediaPreview: false,
  thumbsSwiper: null,
  chatUserMedia: [],
  ischatmediaLoading: false,
  currentMedia: null,
  fetchChatUserMedia: (messages) => {
    set({ ischatmediaLoading: true });
    let media = [];
    messages.forEach((element) => {
      const { type, data } = element;
      if (type == "multiple-file") {
        data.forEach((e) => {
          media.push(e);
        });
      } else if (type == "image" || type == "video") {
        media.push(data[0]);
      }
    });

    let linkedMedia = [];

    media.forEach((element, i) => {
      if (i == 0) {
        linkedMedia.push({ prev: null, current: element, next: i + 1 });
      } else if (i == media.length - 1) {
        linkedMedia.push({ prev: i - 1, current: element, next: null });
      } else {
        linkedMedia.push({
          prev: i - 1,
          current: element,
          next: i + 1,
        });
      }
    });
    set({ ischatmediaLoading: false });
    set({ chatUserMedia: linkedMedia });
  },
  handleMediaPreview: (mediaPreview, data) => {
    if (mediaPreview) {
      get().chatUserMedia.forEach((element) => {
        if (element.current.url == data) {
          set({ currentMedia: element });
          return;
        }
      });
    }
    set({ mediaPreview });
  },
  onNextMedia: () => {
    const current = get().currentMedia;
    const { chatUserMedia } = get();
    if (current.next) {
      set({ currentMedia: chatUserMedia[current.next] });
    }
  },
  onPrevMedia: () => {
    const current = get().currentMedia;
    const { chatUserMedia } = get();

    if (current.prev) {
      set({ currentMedia: chatUserMedia[current.prev] });
    }
  },
  onDynamicMedia: (data) => {
    set({ mediaPreview: true });
    const { chatUserMedia } = get();

    set({ currentMedia: chatUserMedia[data] });
  },
}));

export default useMediaStore;
