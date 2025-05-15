import { ref } from "vue";

export function useUploadHandler() {
  const selectedFiles = ref<File[]>([]);
  const previewUrls = ref<{ file: File; src: string }[]>([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    selectedFiles.value.push(...files); // 儲存原始檔案
    console.log(selectedFiles.value);
    previewUrls.value = selectedFiles.value.map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));
  };

  const handleSingleFileChange = (e) => {
    const files = e.target.files;
    selectedFiles.value = Array.from(files); // 儲存原始檔案
    console.log(selectedFiles.value);
    previewUrls.value = selectedFiles.value.map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));
  };

  const resetUpload = () => {
    previewUrls.value.forEach((preview) => URL.revokeObjectURL(preview.src));
    previewUrls.value = [];
    selectedFiles.value = [];
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      // 模擬 change 事件，將拖放的檔案傳遞給 handleFileChange
      const fakeEvent = { target: { files } };
      handleFileChange(fakeEvent);
    }
  };

  return {
    selectedFiles,
    previewUrls,
    handleFileChange,
    handleSingleFileChange,
    resetUpload,
    handleDragOver,
    handleDrop,
  };
}
