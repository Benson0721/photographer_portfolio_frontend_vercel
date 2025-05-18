import { axiosInstance } from "./axios_config";


export const getDisplayImages = async (topicID) => {
  const response = await axiosInstance.get(`/api/display/`, {
    params: { topicID },
  });
  if (response.status === 200) {
    return response.data.displayImages;
  }
  return { error: "Failed to fetch images" };
};

export const addDisplayImage = async (formData) => {
  const response = await axiosInstance.post(`/api/display/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const deleteDisplayImage = async (publicId, id) => {
  const response = await axiosInstance.delete(`/api/display/`, {
    params: { publicId, id },
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
