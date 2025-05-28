import { useSectionStore } from "../stores/sectionPinia";

const useOffsetYHandler = async (
  path: string,
  id: string,
  newOffset: object
) => {
  const sectionStore = useSectionStore();
  if (path === "section") {
    const message = await sectionStore.adjustOffsetY(id, newOffset);
    await sectionStore.fetchImages();
    return message;
  } else {
    console.warn(`Unknown path: ${path}`);
  }
};

export { useOffsetYHandler };
