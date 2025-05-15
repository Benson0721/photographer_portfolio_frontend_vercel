import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || window.location.origin;

export const getFrontImages = async (category = "") => {
  const response = await axios.get(`${baseURL}/api/topic/front/`, {
    params: {
      category,
    },
  });
  if (response.status === 200) {
    return response.data.frontImage[0];
  }
  return { error: "Failed to fetch images" };
};

export const updateFrontImage = async (category, imageURL) => {
  const response = await axios.put(`${baseURL}/api/topic/front/`, {
    category,
    imageURL,
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
