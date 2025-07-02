<script setup lang="ts">
import { useUserStore } from "../../../../stores/userPinia.ts";
import { useUploadHandler } from "../../../../utils/useUploadHandler.ts";
import { useDisplayStore } from "../../../../stores/displayPinia.ts";
import { useWindowSize } from "../../../../utils/useWindowSize.js";
import { imageCompression } from "../../../../utils/imageCompression.js";
import { ref, watch } from "vue";
import BaseDialog from "../../BaseDialog.vue";

const userStore = useUserStore();
const displayStore = useDisplayStore();
const {
  selectedFiles,
  previewUrls,
  handleFileChange,
  resetUpload,
  handleDragOver,
  handleDrop,
} = useUploadHandler();

const props = defineProps({
  curTopicID: String,
});

const dialog = ref(false);
const { device } = useWindowSize();
const successmessage = ref("");
const errormessage = ref("");
const isDialogLoading = ref(false);
const loadingmessage = ref("");

const handleOpen = () => {
  resetUpload();
  errormessage.value = "";
  successmessage.value = "";
};

const handleClose = () => {
  resetUpload();
  successmessage.value = "";
  errormessage.value = "";
  dialog.value = false;
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0)
    return (errormessage.value = "請選擇圖片");
  try {
    loadingmessage.value = "上傳圖片中...";
    isDialogLoading.value = true;
    const compressedFiles = await imageCompression(selectedFiles);
    await displayStore.addImages(compressedFiles, props.curTopicID);
    resetUpload();
    successmessage.value = "新增展示圖片成功";
    await displayStore.fetchImages(props.curTopicID);
    isDialogLoading.value = false;
  } catch (error) {
    console.error("上傳失敗：", error?.response?.data?.message);
    errormessage.value = "新增展示圖片失敗...";
    resetUpload();
    isDialogLoading.value = false;
    await displayStore.fetchImages(props.curTopicID);
  }
};

watch([errormessage, successmessage], () => {
  setTimeout(() => {
    errormessage.value = "";
    successmessage.value = "";
  }, 3000);
});
</script>

<template>
  <BaseDialog
    v-model:dialog="dialog"
    title="新增展示圖片"
    buttonText="新增展示圖片"
    buttonColor="green"
    position="relative"
    :loadingmessage="loadingmessage"
    :successmessage="successmessage"
    :errormessage="errormessage"
    :isDialogLoading="isDialogLoading"
  >
    <template #default>
      <v-card-text v-if="selectedFiles.length > 0">
        以下是你即將新增的圖片
      </v-card-text>
      <v-card-text v-else> 請點擊新增按鈕來新增圖片 </v-card-text>

      <div class="flex gap-1 md:gap-2 flex-wrap my-2">
        <div
          class="carousel__image--editing"
          v-for="(image, index) in previewUrls"
          :key="index"
        >
          <img
            :src="image.src"
            alt="carousel__image__tmp"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </template>

    <template #actions>
      <div
        class="flex flex-col md:flex-row w-full items-center justify-center relative"
      >
        <v-file-input
          prepend-icon=""
          class="w-[50vw] md:w-[20vw] max-w-[400px] h-[50px] mb-4 md:mb-1"
          name="images"
          @change="handleFileChange"
          variant="outlined"
          label="圖片上傳"
          multiple
          show-size
          clip
        >
        </v-file-input>
        <div class="flex justify-center items-center">
          <v-btn text="送出" @click="handleUpload"></v-btn>
          <v-btn text="關閉" @click="handleClose"></v-btn>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
