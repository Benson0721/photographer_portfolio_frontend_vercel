import { axiosInstance } from "./axios_config";

export const getSectionImages = async (folderPath) => {
  const response = await axiosInstance.get(`/api/section/${folderPath}`);
  if (response.status === 200) {
    return response.data.sectionImages;
  }
  return { error: "Failed to fetch images" };
};

export const updateSectionImage = async (
  folderPath,
  formData,
  title,
  id,
  publicID
) => {
  const response = await axiosInstance.put(
    `/api/section/${folderPath}`,
    formData,
    {
      params: {
        title,
        id,
        publicID,
      },
    }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const adjustOffsetY = async (folderPath, id, offsetY) => {
  const response = await axiosInstance.patch(`/api/section/${folderPath}`, {
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
