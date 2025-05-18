import { defineStore } from "pinia";
import {
  getSectionImages,
  updateSectionImage,
  adjustOffsetY,
  updateSectionName,
} from "../apis/Section_Api";
import { SectionImage } from "../types/apiType";
export const useSectionStore = defineStore("sectionStore", {
  state: () => ({
    sectionImages: [] as SectionImage[],
  }),

  actions: {
    async fetchImages() {
      this.sectionImages = await getSectionImages();
    },
    async updateImage(
      files: File[],
      title: string,
      id: string,
      publicID: string
    ) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`image`, file);
      });
      const message = await updateSectionImage(formData, title, id, publicID);
      return message;
    },
    async adjustOffsetY(id: string, offsetY: object) {
      const message = await adjustOffsetY(id, offsetY);
      return message;
    },
    async updateSectionName(id: string, title: string) {
      const message = await updateSectionName(id, title);
      return message;
    },
  },
});
