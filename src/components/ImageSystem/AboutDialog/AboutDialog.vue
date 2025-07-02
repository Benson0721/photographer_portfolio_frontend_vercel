<script setup lang="ts">
import { useUserStore } from "../../../stores/userPinia.ts";
import { ref, computed } from "vue";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import { useAboutStore } from "../../../stores/aboutPinia.ts";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import BaseDialog from "../BaseDialog.vue";
import { imageCompression } from "../../../utils/imageCompression.js";

const { device } = useWindowSize();
const aboutStore = useAboutStore();
const userStore = useUserStore();

const {
  selectedFiles,
  previewUrls,
  resetUpload,

  handleSingleFileChange,
} = useUploadHandler();

const isDialogLoading = ref(false);
const loadingmessage = ref("");
const errormessage = ref("");
const successmessage = ref("");

const props = defineProps<{
  url: string;
  publicID: string;
  id: string;
}>();

const handleOpen = async () => {
  errormessage.value = "";
  successmessage.value = "";
  await aboutStore.fetchImages();
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    isDialogLoading.value = true;
    loadingmessage.value = "更新圖片中...";
    const compressedFiles = await imageCompression(selectedFiles);
    const message = await aboutStore.updateImage(
      compressedFiles,
      props.publicID,
      props.id
    );
    resetUpload();
    isDialogLoading.value = false;
    successmessage.value = message;
    await aboutStore.fetchImages();
  } catch (error) {
    errormessage.value = "更新失敗...";
    resetUpload();
    isDialogLoading.value = false;
    await aboutStore.fetchImages();
    console.error("上傳失敗：", error?.response?.data?.message || error);
  }
};

const previewImage = computed(() => {
  return previewUrls.value.length > 0 ? previewUrls.value[0].src : props.url;
});
</script>

<template>
  <BaseDialog
    title="編輯圖片"
    buttonText="編輯"
    buttonColor="secondary"
    :isDialogLoading="isDialogLoading"
    :loadingmessage="loadingmessage"
    :errormessage="errormessage"
    :successmessage="successmessage"
    position="absolute"
    vertical="top-[1%] md:top-[5%]"
    horizontal="right-[1%] md:right-[10%]"
  >
    <template #default>
      <v-card-text> 以下是現有的圖片... </v-card-text>
      <div class="flex gap-2 justify-center flex-wrap my-2 w-full h-[550px]">
        <img
          :src="previewImage"
          class="h-full object-cover"
          alt="previewImage"
          draggable="false"
        />
      </div>
    </template>

    <template #actions>
      <div class="flex w-full h-[75px] items-center relative">
        <v-file-input
          class="w-full h-full mt-4 mr-6"
          name="images"
          @change="handleSingleFileChange"
          variant="outlined"
          label="圖片上傳"
          show-size
          clip
        />
        <v-btn text="送出" @click="handleUpload" />
      </div>
    </template>
  </BaseDialog>
</template>
