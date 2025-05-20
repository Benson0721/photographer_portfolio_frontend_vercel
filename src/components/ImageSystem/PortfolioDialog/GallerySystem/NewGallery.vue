<script setup>
import { useUserStore } from "../../../../stores/userPinia.ts";
import { useUploadHandler } from "../../../../utils/useUploadHandler.ts";
import { useGalleryStore } from "../../../../stores/galleryPinia.ts";
import { ref } from "vue";
import { useWindowSize } from "../../../../utils/useWindowSize.js";
import DialogLoading from "../../../../components/DialogLoading.vue";
const userStore = useUserStore();
const galleryStore = useGalleryStore();
const {
  selectedFiles,
  previewUrls,
  handleFileChange,
  resetUpload,
  handleDragOver,
  handleDrop,
} = useUploadHandler();

const categorys = ref([
  "Architecture",
  "Landscape",
  "Portrait",
  "Motorcycle",
  "Others",
  "Album",
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
const handleUpload = async () => {
  if (selectedFiles.value.length === 0 || !selectCategory.value)
    return (errormessage.value = "請選擇主題及上傳圖片");
  try {
    loadingmessage.value = "上傳圖片中...";
    isDialogLoading.value = true;
    const message = await galleryStore.addImage(
      selectedFiles.value,
      selectCategory.value
    );
    resetUpload();
    successmessage.value = message;
    galleryStore.fetchImages(selectCategory.value);
    isDialogLoading.value = false;
  } catch (error) {
    console.error(error);
    isDialogLoading.value = false;
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    galleryStore.fetchImages(selectCategory.value);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};
</script>

<template>
  <div>
    <v-btn
      color="surface-variant"
      text="新增圖片"
      variant="flat"
      :disabled="!userStore.isEditing"
      class="bg-green-500"
      @click="handleOpen"
      :class="!userStore.isEditing ? 'hidden' : 'block'"
    ></v-btn>

    <v-dialog
      v-model="dialog"
      :max-width="device !== 'mobile' ? '60vw' : '100vw'"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <v-card title="新增圖片" class="p-1 md:p-4 relative">
        <DialogLoading
          :isLoading="isDialogLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />

        <v-card-text v-if="selectedFiles.length > 0">
          以下是你即將新增的圖片(單張圖片大小請勿超過10MB)
        </v-card-text>
        <v-card-text v-else> 請點擊新增按鈕來新增圖片 </v-card-text>
        <div class="flex gap-1 md:gap-2 flex-wrap my-2">
          <div
            class="carousel__image--editing"
            v-for="(image, index) in previewUrls"
            :key="index"
            v-if="selectedFiles"
          >
            <img
              :src="image.src"
              alt="carousel__image__tmp"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <v-card-actions class="flex flex-col md:flex-row">
          <v-spacer></v-spacer>

          <v-select
            label="選擇主題"
            :items="categorys"
            variant="outlined"
            v-model="selectCategory"
            class="w-full"
          ></v-select>
          <div
            class="flex h-auto flex-col md:flex-row items-center relative"
            :class="selectedFiles.length > 0 ? 'w-full' : 'w-[300px]'"
          >
            <v-file-input
              class="w-full h-auto"
              name="images"
              @change="handleFileChange"
              variant="outlined"
              label="圖片上傳"
              multiple
              show-size
              clip
              prepend-icon=""
            >
            </v-file-input>
          </div>
          <div class="flex gap-2 mb-5">
            <v-btn text="送出" @click="handleUpload"></v-btn>
            <v-btn text="關閉" @click="dialog = false"></v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
