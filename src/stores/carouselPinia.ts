import { defineStore } from "pinia";
import {
  getCarouselImages,
  addCarouselImage,
  adjustCarouselOrder,
  deleteCarouselImage,
} from "../apis/Carousel_Api";
import { CarouselImage } from "../types/apiType";

export const useCarouselStore = defineStore("carouselStore", {
  state: () => ({
    carouselImages: [] as CarouselImage[],
  }),
  getters: {
    sortedImages: (state) => {
      return [...state.carouselImages].sort((a, b) => a.order - b.order);
    },
  },
  actions: {
    async fetchImages() {
      this.carouselImages = await getCarouselImages();
    },
    async addImages(files: File[]) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });
      const res = await addCarouselImage(formData);
      return res;
    },
    async adjustOrder(newOrderArray: CarouselImage[]) {
      this.carouselImages = newOrderArray;
      const res = await adjustCarouselOrder(newOrderArray);
      return res;
    },
    async deleteImage(public_Id: string, id: string) {
      this.carouselImages = this.carouselImages.filter(
        (image) => image.public_id !== public_Id
      );
      const res = await deleteCarouselImage(public_Id, id);
      return res;
    },
  },
});
