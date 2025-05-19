import { defineStore } from "pinia";
import {
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  addGalleryImages,
} from "../apis/Gallery_api";
import { GalleryImage } from "../types/apiType";
export const useGalleryStore = defineStore("galleryStore", {
  state: () => ({
    galleryImages: [] as GalleryImage[],
  }),

  actions: {
    async fetchImages(category: string | undefined) {
      this.galleryImages = await getGalleryImages(category);
    },
    async addImage(files: File[], category: string) {
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      const message = await addGalleryImages(formData, category);
      return message;
    },
    async updateImage(newData: {
      image: File[];
      category: string;
      notes: string;
      publicID: string;
      id: string;
    }) {
      const path = "portfolio";

      const { image } = newData;
      const formData = new FormData();
      if (image.length > 0) {
        image.forEach((file) => {
          formData.append(`image`, file);
        });
      }
      formData.append("newData", JSON.stringify(newData));
      const res = await updateGalleryImage(formData);
      return res;
    },
    async deleteImage(public_Id: string, id: string) {
      this.galleryImages = this.galleryImages.filter(
        (image) => image.public_id !== public_Id
      );
      const res = await deleteGalleryImage(public_Id, id);
      return res;
    },
  },
});
