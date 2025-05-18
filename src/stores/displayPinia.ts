import { defineStore } from "pinia";
import {
  getDisplayImages,
  addDisplayImage,
  deleteDisplayImage,
} from "../apis/Display_api";
import { DisplayImage } from "../types/apiType";

export const useDisplayStore = defineStore("displayStore", {
  state: () => ({
    displayImages: [] as DisplayImage[],
  }),

  actions: {
    async fetchImages(topicID: string) {
      this.displayImages = await getDisplayImages(topicID);
    },
    async addImages(files: File[], topicID: string) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });
      formData.append(`topicID`, JSON.stringify(topicID));
      const message = await addDisplayImage(formData);
      return message;
    },
    async deleteImage(public_Id: string, id: string) {
      this.displayImages = this.displayImages.filter(
        (image) => image.public_id !== public_Id
      );
      const message = await deleteDisplayImage(public_Id, id);
      return message;
    },
  },
});
