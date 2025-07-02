<script setup lang="ts">
import { useAlbumStore } from "../../../../stores/albumPinia.ts";
import { useUploadHandler } from "../../../../utils/useUploadHandler.ts";
import { useWindowSize } from "../../../../utils/useWindowSize.js";
import { ref, computed } from "vue";
import UploadArea from "./UploadArea.vue";
import BaseDialog from "../../BaseDialog.vue";
import { imageCompression } from "../../../../utils/imageCompression.js";

const props = defineProps<{
  id: string;
  publicId: string;
  topic: string;
  notes: string;
  imageURL: string;
}>();

const albumStore = useAlbumStore();
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isDialogLoading = ref(false);
const curtopic = ref(props.topic);
const curnotes = ref(props.notes);
const dialog = ref(false);

const { device } = useWindowSize();
const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();

const previewUrl = computed(() => previewUrls.value[0]?.src || "");

const handleEdit = async () => {
  try {
    if (curtopic.value === "" || curnotes.value === "")
      return (errormessage.value = "主題跟描述請勿留空");
    const newData = {
      image: [],
      topic: curtopic.value,
      notes: curnotes.value,
      publicID: props.publicId,
      id: props.id,
    };
    if (selectedFiles.value.length > 0) {
      const compressedFiles = await imageCompression(selectedFiles.value);
      newData.image = compressedFiles;
    }

    loadingmessage.value = "更新中...";
    isDialogLoading.value = true;
    await albumStore.updateImage(newData);
    resetUpload();
    isDialogLoading.value = false;
    successmessage.value = "更新成功";
  } catch (error) {
    console.error(error);
    errormessage.value = "更新失敗...";
    resetUpload();
    isDialogLoading.value = false;
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const handleOpen = () => {
  dialog.value = true;
  errormessage.value = "";
  successmessage.value = "";
};

const handleClose = () => {
  dialog.value = false;
  resetUpload();
};
</script>

<template>
  <BaseDialog
    v-model:dialog="dialog"
    title="編輯合輯"
    buttonText="編輯"
    buttonColor="indigo"
    :isDialogLoading="isDialogLoading"
    :loadingmessage="loadingmessage"
    :errormessage="errormessage"
    :successmessage="successmessage"
  >
    <template #default>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="mt-4 flex-1">
          <UploadArea
            v-model:topic="curtopic"
            v-model:notes="curnotes"
            :handleSingleFileChange="handleSingleFileChange"
            :selectedFiles="selectedFiles"
          />
        </div>
        <div class="flex flex-col items-center justify-center flex-2 w-[50vw]">
          <v-card-text v-if="previewUrl" class="text-sm text-gray-600 flex-none"
            >以下為更新後的圖片</v-card-text
          >
          <v-card-text class="text-sm text-gray-600 flex-none" v-else
            >以下是現有的圖片</v-card-text
          >
          <img
            :src="previewUrl || imageURL"
            alt="previewImage"
            class="w-full object-contain"
            draggable="false"
          />
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-center items-center">
        <v-btn @click="handleEdit">送出</v-btn>
        <v-btn text="關閉" @click="handleClose" />
      </div>
    </template>
  </BaseDialog>
</template>
