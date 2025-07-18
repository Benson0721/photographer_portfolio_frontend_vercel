import { axiosInstance } from "./axios_config";

export const getFrontImages = async (category = "") => {
  const response = await axiosInstance.get(`/api/front/`, {
    params: {
      category,
    },
  });
  if (response.status === 200) {
    return response.data.frontImages;
  }
  return { error: "Failed to fetch images" };
};

export const updateFrontImage = async (category, imageURL, public_id) => {
  const response = await axiosInstance.put(`/api/front/`, {
    category,
    imageURL,
    public_id,
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
