import { axiosInstance } from "./axios_config";

export const getSectionImages = async () => {
  const response = await axiosInstance.get(`/api/section/`);
  if (response.status === 200) {
    return response.data.sectionImages;
  }
  return { error: "Failed to fetch images" };
};

export const updateSectionImage = async (formData, title, id, publicID) => {
  const response = await axiosInstance.put(`/api/section/`, formData, {
    params: {
      title,
      id,
      publicID,
    },
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const adjustOffsetY = async (id, offsetY) => {
  const response = await axiosInstance.patch(`/api/section/`, {
    offsetY,
    id,
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateSectionName = async (id, title) => {
  const response = await axiosInstance.patch(`/api/section/name`, {
    id,
    title,
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
