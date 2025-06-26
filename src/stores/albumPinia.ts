import { defineStore } from "pinia";
import {
  getAlbumImages,
  updateAlbumImage,
  deleteAlbumImage,
  addAlbumImage,
} from "../apis/Album_api";

import { AlbumImage } from "../types/apiType";
export const useAlbumStore = defineStore("albumStore", {
  state: () => ({
    albumImages: [] as AlbumImage[],
  }),

  actions: {
    async fetchImages() {
      this.albumImages = await getAlbumImages();
    },
    async addImage(files: File[], topic: string, notes: string) {
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      const message = await addAlbumImage(formData, {
        topic,
        notes,
      });
      return message;
    },
    async updateImage(newData: {
      image: File[];
      topic: string;
      notes: string;
      publicID: string;
      id: string;
    }) {
      const { image } = newData;
      const formData = new FormData();
      if (image.length > 0) {
        image.forEach((file) => {
          formData.append(`image`, file);
        });
      }
      formData.append("newData", JSON.stringify(newData));
      const res = await updateAlbumImage(formData);
      return res;
    },
    async deleteImage(public_Id: string, id: string) {
      this.albumImages = this.albumImages.filter(
        (image) => image.public_id !== public_Id
      );
      const res = await deleteAlbumImage(public_Id, id);
      return res;
    },
  },
});
