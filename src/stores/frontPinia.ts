import { defineStore } from "pinia";
import { updateFrontImage, getFrontImages } from "../apis/Front_api";
import { FrontImage } from "../types/apiType";
export const useFrontStore = defineStore("frontStore", {
  state: () => ({
    frontImages: [] as FrontImage[],
  }),

  actions: {
    async fetchImages(category: string | undefined) {
      this.frontImages = await getFrontImages(category || "All");
    },
    async updateFrontImage(category: string, imageURL: string, public_id: string) {
      const res = await updateFrontImage(category, imageURL, public_id);
      this.frontImages = await getFrontImages(category);
      return res;
    },
  },
});
