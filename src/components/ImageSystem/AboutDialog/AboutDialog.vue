<script setup>
import { useUserStore } from "../../../stores/userPinia.ts";
import { ref, watch, computed } from "vue";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import { useAboutStore } from "../../../stores/aboutPinia.ts";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import DialogLoading from "../../DialogLoading.vue";

const { device } = useWindowSize();
const aboutStore = useAboutStore();
const {
  selectedFiles,
  previewUrls,
  resetUpload,
  handleDragOver,
  handleDrop,
  handleSingleFileChange,
} = useUploadHandler();
const userStore = useUserStore();

const isDialogLoading = ref(false);
const loadingmessage = ref("");
const errormessage = ref("");
const successmessage = ref("");

const props = defineProps({
  url: String,
  publicID: String,
  id: String,
  width: Number,
  height: Number,
});

const handleOpen = async () => {
  await aboutStore.fetchImages();
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    isDialogLoading.value = true;
    loadingmessage.value = "更新圖片中...";
    const message = await aboutStore.updateImage(
      selectedFiles.value,
      props.publicID,
      props.id
    );
    resetUpload();
    isDialogLoading.value = false;
    successmessage.value = message;
    await aboutStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    isDialogLoading.value = false;
    await aboutStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const previewImage = computed(() => {
  if (previewUrls?.value.length > 0) {
    return previewUrls.value[0].src;
  }
  return props.url;
});

watch(handleOpen, () => {
  errormessage.value = ""; // 切換模式時清空錯誤訊息
  successmessage.value = "";
});
</script>

<template>
  <v-dialog
    :max-width="device !== 'mobile' ? '60vw' : '100vw'"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="編輯"
        variant="flat"
        :disabled="!userStore.showEdit()"
        class="absolute z-10 top-1/18 left-1/12"
        @click="handleOpen"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="編輯圖片" class="p-4">
        <DialogLoading
          :isLoading="isDialogLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />
        <v-card-text> 以下是現有的圖片...(請勿上傳超過10MB的圖片) </v-card-text>
        <div class="flex gap-2 justify-center flex-wrap my-2 w-full h-[550px]">
          <img
            :src="previewImage"
            class="w-[350px] h-full object-cover"
            alt="previewImage"
            draggable="false"
          />
        </div>

        <v-card-actions>
          <div class="flex w-full h-[75px] items-center relative">
            <v-file-input
              class="w-full h-full mt-4 mr-6"
              name="images"
              @change="handleSingleFileChange"
              variant="outlined"
              label="圖片上傳"
              show-size
              clip
            >
            </v-file-input>
            <v-btn text="送出" @click="handleUpload"></v-btn>
            <v-btn text="關閉" @click="isActive.value = false"></v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
