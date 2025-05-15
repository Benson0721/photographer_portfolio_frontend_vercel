import { axiosInstance } from "./axios_config";

export const getAboutImages = async (folderPath) => {
  const response = await axiosInstance.get(`/api/about/${folderPath}`);
  if (response.status === 200) {
    return response.data.AboutImages;
  }
  return { error: "Failed to fetch images" };
};

export const updateAboutImage = async (folderPath, formData, publicID, id) => {
  const response = await axiosInstance.put(
    `/api/about/${folderPath}`,
    formData,
    {
      params: {
        publicID,
        id,
      },
    }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
