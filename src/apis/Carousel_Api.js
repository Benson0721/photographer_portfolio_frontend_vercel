
import { axiosInstance } from "./axios_config";

export const getCarouselImages = async (folderPath) => {
  const response = await axiosInstance.get(`/api/carousel/${folderPath}`);
  if (response.status === 200) {
    return response.data.carouselImages;
  }
  return { error: "Failed to fetch images" };
};

export const addCarouselImage = async (folderPath, formData) => {
  const response = await axiosInstance.post(
    `/api/carousel/${folderPath}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const adjustCarouselOrder = async (folderPath, newOrderArray) => {
  const response = await axiosInstance.patch(
    `/api/carousel/${folderPath}`,
    newOrderArray
  );
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};

export const deleteCarouselImage = async (folderPath, publicId, id) => {
  const response = await axiosInstance.delete(`/api/carousel/${folderPath}`, {
    params: { publicId, id },
  });
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};
