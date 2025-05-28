import { axiosInstance } from "./axios_config";

export const getAboutImages = async () => {
  const response = await axiosInstance.get(`/api/about/`);
  if (response.status === 200) {
    return response.data.AboutImages;
  }
  return { error: "Failed to fetch images" };
};

export const getAboutMe = async () => {
  const response = await axiosInstance.get(`/api/about/content`);
  if (response.status === 200) {
    return response.data.content;
  }
  return { error: "Failed to fetch content" };
};

export const updateAboutImage = async (formData, publicID, id) => {
  const response = await axiosInstance.put(`/api/about/`, formData, {
    params: {
      publicID,
      id,
    },
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateAboutMe = async (content, id) => {
  const response = await axiosInstance.put(
    `/api/about/content`,
    { content },
    { params: { id } }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
