
import { axiosInstance } from "./axios_config";

export const getCarouselImages = async () => {
  const response = await axiosInstance.get(`/api/carousel/`);
  if (response.status === 200) {
    return response.data.carouselImages;
  }
  return { error: "Failed to fetch images" };
};

export const addCarouselImage = async (formData) => {
  const response = await axiosInstance.post(`/api/carousel/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const adjustCarouselOrder = async (newOrderArray) => {
  const response = await axiosInstance.patch(`/api/carousel/`, newOrderArray);
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};

export const deleteCarouselImage = async (publicId, id) => {
  const response = await axiosInstance.delete(`/api/carousel/`, {
    params: { publicId, id },
  });
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};
