<script setup>
import { useUserStore } from "../../../../stores/userPinia.ts";
import { useUploadHandler } from "../../../../utils/useUploadHandler.ts";
import { useDisplayStore } from "../../../../stores/displayPinia.ts";
import { ref, watch } from "vue";
import { useWindowSize } from "../../../../utils/useWindowSize.js";
import DialogLoading from "../../../../components/DialogLoading.vue";
import { imageCompression } from "../../../../utils/imageCompression.js";

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

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    loadingmessage.value = "上傳圖片中...";
    isDialogLoading.value = true;
    const compressedFiles = await imageCompression(selectedFiles);
    const message = await displayStore.addImages(
      compressedFiles,
      props.curTopicID
    );
    resetUpload();
    successmessage.value = message;
    displayStore.fetchImages(props.curTopicID);
    isDialogLoading.value = false;
  } catch (error) {
    console.error(error);
    isDialogLoading.value = false;
    errormessage.value = "上傳失敗...";
    resetUpload();
    displayStore.fetchImages(props.curTopicID);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};


watch(errormessage && successmessage, () => {
  setTimeout(() => {
    errormessage.value = "";
    successmessage.value = "";
  }, 3000);
});
</script>

<template>
  <div>
    <v-btn
      color="surface-variant"
      text="新增展示圖片"
      variant="flat"
      :disabled="!userStore.isEditing"
      class="bg-green-500"
      @click="dialog = true"
      :class="!userStore.isEditing ? 'hidden' : 'block'"
    ></v-btn>

    <v-dialog
      v-model="dialog"
      :max-width="device !== 'mobile' ? '60vw' : '100vw'"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <v-card title="新增展示圖片" class="p-1 md:p-4 relative">
        <DialogLoading
          :isLoading="isDialogLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />
        <v-card-text v-if="selectedFiles.length > 0">
          以下是你即將新增的圖片
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <div
            class="flex h-auto flex-col md:flex-row items-center relative"
            :class="selectedFiles.length > 0 ? 'w-auto' : 'w-[300px]'"
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
            <div class="flex gap-2">
              <v-btn text="送出" @click="handleUpload"></v-btn>
              <v-btn text="關閉" @click="dialog = false"></v-btn>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
