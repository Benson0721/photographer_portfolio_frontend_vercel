<script setup lang="ts">
import BaseDialog from "../../../BaseDialog.vue";
import UploadArea from "./UploadArea.vue";
import { useUserStore } from "../../../../stores/userPinia";
import { useAlbumStore } from "../../../../stores/albumPinia";
import { useUploadHandler } from "../../../../utils/useUploadHandler";
import { imageCompression } from "../../../../utils/imageCompression.js";
import { ref, computed, watch } from "vue";
import { useWindowSize } from "../../../../utils/useWindowSize.js";

const dialog = defineModel<boolean>("dialog");

const userStore = useUserStore();
const albumStore = useAlbumStore();

const topic = ref("");
const notes = ref("");

const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isDialogLoading = ref(false);

const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();
const { device } = useWindowSize();

const previewUrl = computed(() => previewUrls.value[0]?.src || "");

const resetMode = () => {
  topic.value = "";
  notes.value = "";
  errormessage.value = "";
  successmessage.value = "";
  resetUpload();
};

const handleClose = () => {
  resetMode();
  dialog.value = false;
};

const handleAddImage = async () => {
  if (
    selectedFiles.value.length === 0 ||
    topic.value === "" ||
    notes.value === ""
  )
    return (errormessage.value = "請全部輸入完成在按下上傳");

  isDialogLoading.value = true;
  loadingmessage.value = "新增合輯中...";

  try {
    const compressedFiles = await imageCompression(selectedFiles);
    await albumStore.addImage(compressedFiles, topic.value, notes.value);
    successmessage.value = "新增合輯成功";
    resetUpload();
    await albumStore.fetchImages();
  } catch (error) {
    errormessage.value = "新增失敗...";
    console.error("上傳失敗：", error?.response?.data?.message);
  } finally {
    isDialogLoading.value = false;
  }
};
</script>

<template>
  <BaseDialog
    v-model:dialog="dialog"
    title="新增合輯"
    buttonText="新增合輯"
    buttonColor="success"
    position="relative"
    :width="device !== 'mobile' ? '60vw' : '70vw'"
    :isDialogLoading="isDialogLoading"
    :loadingmessage="loadingmessage"
    :errormessage="errormessage"
    :successmessage="successmessage"
  >
    <template #default>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="mt-4 flex-1">
          <UploadArea
            v-model:topic="topic"
            v-model:notes="notes"
            :handleSingleFileChange="handleSingleFileChange"
            :selectedFiles="selectedFiles"
          />
        </div>
        <div class="flex flex-col items-center justify-center flex-2 w-[50vw]">
          <v-card-text class="text-sm text-gray-600 flex-none"
            >以下為即將更新的圖片</v-card-text
          >
          <div v-if="previewUrl">
            <img
              :src="previewUrl"
              alt="previewImage"
              class="w-full object-contain"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <div class="flex justify-center items-center">
        <v-btn @click="handleAddImage">送出</v-btn>
        <v-btn text @click="handleClose">關閉</v-btn>
      </div>
    </template>
  </BaseDialog>
</template>
