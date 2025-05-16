import { ref } from "vue";

export function useUploadHandler() {
  const selectedFiles = ref<File[]>([]);
  const previewUrls = ref<{ file: File; src: string }[]>([]);

  const handleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    selectedFiles.value.push(...Array.from(files)); // 儲存原始檔案
    previewUrls.value = selectedFiles.value.map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));
  };

  const handleSingleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    selectedFiles.value = Array.from(files); // 儲存原始檔案
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

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      // 模擬 change 事件，將拖放的檔案傳遞給 handleFileChange
      const fakeEvent = { target: { files } };
      handleFileChange(fakeEvent as unknown as Event);
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
