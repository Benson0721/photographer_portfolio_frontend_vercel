import { axiosInstance } from "./axios_config";

export const getAlbumImages = async () => {
  const response = await axiosInstance.get(`/api/album/`);
  if (response.status === 200) {
    return response.data.albumImages;
  }
  return { error: "Failed to fetch images" };
};

export const addAlbumImage = async (formData, info) => {
  const response = await axiosInstance.post(`/api/album/`, formData, {
    params: {
      topic: info.topic,
      notes: info.notes,
    },
  });

  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateAlbumImage = async (formData) => {
  const response = await axiosInstance.put(`/api/album/`, formData);
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const deleteAlbumImage = async (publicId, id) => {
  const response = await axiosInstance.delete(`/api/album/`, {
    params: {
      publicId,
      id,
    },
  });

  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
