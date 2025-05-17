import { axiosInstance } from "./axios_config";

export const getAlbumImages = async (folderPath = "", category = "") => {
  const response = await axiosInstance.get(`/api/album/${folderPath}`, {
    params: {
      category,
    },
  });
  if (response.status === 200) {
    return response.data.albumImages;
  }
  return { error: "Failed to fetch images" };
};

export const addAlbumImage = async (folderPath, formData, info) => {
  const response = await axiosInstance.post(
    `/api/album/${folderPath}`,
    formData,
    {
      params: {
        category: info.category,
        topic: info.topic,
        notes: info.notes,
      },
    }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateAlbumImage = async (folderPath, formData) => {
  const response = await axiosInstance.put(
    `/api/album/${folderPath}`,
    formData
  );
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const deleteAlbumImage = async (folderPath, publicId, id) => {
  const response = await axiosInstance.delete(`/api/album/${folderPath}`, {
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
