import { axiosInstance } from "./axios_config";

export const getGalleryImages = async (folderPath = "", category = "") => {
  const response = await axiosInstance.get(`/api/gallery/${folderPath}`, {
    params: {
      category,
    },
  });
  if (response.status === 200) {
    return response.data.galleryImages;
  }
  return { error: "Failed to fetch images" };
};

export const addGalleryImage = async (folderPath, formData, info) => {
  const response = await axiosInstance.post(
    `/api/gallery/${folderPath}`,
    formData,
    {
      params: {
        category: info.category,
        notes: info.notes,
      },
    }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateGalleryImage = async (folderPath, formData) => {
  const response = await axiosInstance.put(
    `/api/gallery/${folderPath}`,
    formData
  );
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const deleteGalleryImage = async (folderPath, publicId, id) => {
  const response = await axiosInstance.delete(`/api/gallery/${folderPath}`, {
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
