<script setup>
import { useUploadHandler } from "../../../../utils/useUploadHandler.ts";
import { useGalleryStore } from "../../../../stores/galleryPinia.ts";
import { ref } from "vue";
import { useWindowSize } from "../../../../utils/useWindowSize.js";
import BaseDialog from "../../../../components/BaseDialog.vue";
import { imageCompression } from "../../../../utils/imageCompression.js";

const props = defineProps({
  category: {
    type: String,
    default: "",
  },
});

const galleryStore = useGalleryStore();
const { selectedFiles, previewUrls, handleFileChange, resetUpload } =
  useUploadHandler();

const categorys = ref([
  "Architecture",
  "Landscape",
  "Portrait",
  "Motorcycle",
  "Others",
]);

const dialog = ref(false);
const { device } = useWindowSize();
const selectCategory = ref("");
const successmessage = ref("");
const errormessage = ref("");
const isDialogLoading = ref(false);
const loadingmessage = ref("");

const handleOpen = () => {
  dialog.value = true;
  successmessage.value = "";
  errormessage.value = "";
  resetUpload();
};

const resetMode = () => {
  selectCategory.value = "";
  previewUrls.value = [];
  selectedFiles.value = [];
  errormessage.value = "";
  successmessage.value = "";
  loadingmessage.value = "";
  isDialogLoading.value = false;
};
const handleClose = () => {
  resetMode();
  dialog.value = false;
};
const handleUpload = async () => {
  if (selectedFiles.value.length === 0 || !selectCategory.value)
    return (errormessage.value = "請選擇主題及上傳圖片");
  try {
    loadingmessage.value = "上傳圖片中...";
    isDialogLoading.value = true;
    const compressedFiles = await imageCompression(selectedFiles);
    const message = await galleryStore.addImage(
      compressedFiles,
      selectCategory.value
    );
    resetUpload();
    successmessage.value = message;
    if (props.category === selectCategory.value) {
      galleryStore.fetchImages(selectCategory.value);
    }
    isDialogLoading.value = false;
  } catch (error) {
    console.error(error);
    isDialogLoading.value = false;
    errormessage.value = "上傳失敗...";
    resetUpload();
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};
</script>

<template>
  <div>
    <BaseDialog
      v-model:dialog="dialog"
      :width="device !== 'mobile' ? '60vw' : '60vw'"
      title="新增圖片"
      color="secondary"
      buttonText="新增圖片"
      buttonColor="success"
      position="relative"
      :isDialogLoading="isDialogLoading"
      :loadingmessage="loadingmessage"
      :errormessage="errormessage"
      :successmessage="successmessage"
    >
      <template #default>
        <v-card-text v-if="selectedFiles.length > 0">
          以下是你即將新增的圖片
        </v-card-text>
        <v-card-text v-else> 請點擊新增按鈕來新增圖片 </v-card-text>

        <div class="flex gap-1 md:gap-2 flex-wrap my-2 w-full">
          <div class="flex flex-col flex-1 gap-2">
            <v-select
              label="選擇主題"
              :items="categorys"
              variant="outlined"
              v-model="selectCategory"
              class="w-full"
            />
            <v-file-input
              class="w-full h-auto mt-4"
              name="images"
              @change="handleFileChange"
              variant="outlined"
              label="圖片上傳"
              multiple
              show-size
              clip
              prepend-icon=""
            />
          </div>
          <div v-if="selectedFiles" class="flex flex-1 justify-center">
            <div
              v-for="(image, index) in previewUrls"
              :key="index"
              class="flex justify-center"
            >
              <img
                :src="image.src"
                alt="carousel__image__tmp"
                class="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </template>

      <template #actions>
        <div class="flex justify-center items-center">
          <v-btn text="送出" @click="handleUpload"></v-btn>
          <v-btn text="關閉" @click="handleClose"></v-btn>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>
