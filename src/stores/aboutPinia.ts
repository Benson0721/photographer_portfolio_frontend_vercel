import { defineStore } from "pinia";
import {
  getAboutImages,
  updateAboutImage,
  getAboutMe,
  updateAboutMe,
} from "../apis/About_api";
import { AboutImage } from "../types/apiType";
export const useAboutStore = defineStore("aboutStore", {
  state: () => ({
    aboutImages: [] as AboutImage[],
    aboutMe: "",
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
      const image = await updateAboutImage(formData, publicID, id);
      const newImages = this.aboutImages.map((img) => {
        if (img._id === id) {
          return { ...img, image: image.imageURL };
        }
        return img;
      });
      this.aboutImages = newImages;
      return image;
    },
    async fetchAboutMe() {
      const content = await getAboutMe();
      this.aboutMe = content;
    },
    async updateAboutMe(content: string, id: string) {
      const message = await updateAboutMe(content, id);
      return message;
    },
  },
});
