import { defineStore } from "pinia";
import {
  getTopicImages,
  updateTopicImage,
  deleteTopicImage,
  addTopicImage,
} from "../apis/Topic_api";
import { updateFrontImage, getFrontImages } from "../apis/Front_api";
import { TopicImage, FrontImage } from "../types/apiType";
export const useTopicStore = defineStore("topicStore", {
  state: () => ({
    topicImages: [] as TopicImage[],
    frontImage: {} as FrontImage,
  }),

  actions: {
    async fetchImages(category: string | undefined) {
      const folderPath = `portfolio`;
      this.topicImages = await getTopicImages(folderPath, category);
      this.frontImage = await getFrontImages(category || "All");
    },
    async addImage(
      files: File[],
      category: string,
      topic: string,
      notes: string
    ) {
      const path = "portfolio";
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      const message = await addTopicImage(path, formData, {
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
      const path = "portfolio";

      const { image } = newData;
      const formData = new FormData();
      image.forEach((file) => {
        formData.append(`image`, file);
      });

      formData.append("newData", JSON.stringify(newData));
      const res = await updateTopicImage(path, formData);
      console.log(res);
      return res;
    },
    async updateFrontImage(category: string, imageURL: string) {
      const res = await updateFrontImage(category, imageURL);
      this.frontImage = await getFrontImages(category || "All");
      return res;
    },
    async deleteImage(public_Id: string, id: string) {
      this.topicImages = this.topicImages.filter(
        (image) => image.public_id !== public_Id
      );
      const sectionPath = "portfolio";
      const res = await deleteTopicImage(sectionPath, public_Id, id);
      return res;
    },
  },
});
