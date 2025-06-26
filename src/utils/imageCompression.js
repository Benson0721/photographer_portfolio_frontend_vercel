import browserImageCompression from "browser-image-compression";
export const imageCompression = async (selectedFiles) => {
  const compressedFiles = await Promise.all(
    selectedFiles.value.map(async (file) => {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 3000,
        useWebWorker: true,
      };
      return await browserImageCompression(file, options);
    })
  );
  return compressedFiles;
};
