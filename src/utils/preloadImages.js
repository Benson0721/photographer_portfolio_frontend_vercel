export const preloadImages = async (imageURLs) => {
  //預載圖片
  let total = imageURLs.length;
  return new Promise((resolve) => {
    imageURLs.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = img.onerror = () => {
        total--;
        if (total === 0) {
          resolve();
        }
      };
    });
  });
};
