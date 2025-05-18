import { defineStore } from "pinia";
import {
  getAlbumImages,
  updateAlbumImage,
  deleteAlbumImage,
  addAlbumImage,
} from "../apis/Album_api";
import { updateFrontImage, getFrontImages } from "../apis/Front_api";
import { AlbumImage, FrontImage } from "../types/apiType";
export const useAlbumStore = defineStore("albumStore", {
  state: () => ({
    albumImages: [] as AlbumImage[],
    frontImages: [] as FrontImage[],
  }),

  actions: {
    async fetchImages(category: string | undefined) {
      this.albumImages = await getAlbumImages(category);
      this.frontImages = await getFrontImages(category || "All");
    },
    async addImage(
      files: File[],
      category: string,
      topic: string,
      notes: string
    ) {
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      const message = await addAlbumImage(formData, {
        category,
        topic,
        notes,
      });
      console.log(message);
      return message;
    },
    async updateImage(newData: {
      image: File[];
      category: string;
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
      console.log(res);
      return res;
    },
    async updateFrontImage(category: string, imageURL: string) {
      const res = await updateFrontImage(category, imageURL);
      this.frontImages = await getFrontImages(category);
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
