import { axiosInstance } from "./axios_config";

export const getGalleryImages = async (category = "") => {
  const response = await axiosInstance.get(`/api/gallery/`, {
    params: {
      category,
    },
  });
  if (response.status === 200) {
    return response.data.galleryImages;
  }
  return { error: "Failed to fetch images" };
};

export const addGalleryImage = async (formData, info) => {
  const response = await axiosInstance.post(`/api/gallery/`, formData, {
    params: {
      category: info.category,
      notes: info.notes,
    },
  });

  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateGalleryImage = async (formData) => {
  const response = await axiosInstance.put(`/api/gallery/`, formData);
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const deleteGalleryImage = async (publicId, id) => {
  const response = await axiosInstance.delete(`/api/gallery/`, {
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
