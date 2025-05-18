import { defineStore } from "pinia";
import { getAboutImages, updateAboutImage } from "../apis/About_api";
import { AboutImage } from "../types/apiType";
export const useAboutStore = defineStore("aboutStore", {
  state: () => ({
    aboutImages: [] as AboutImage[],
  }),

  actions: {
    async fetchImages() {
      const images = await getAboutImages();
      this.aboutImages = images;
    },
    async updateImage(files: File[], publicID: string, id: string) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`image`, file);
      });
      const message = await updateAboutImage(formData, publicID, id);
      return message;
    },
  },
});
