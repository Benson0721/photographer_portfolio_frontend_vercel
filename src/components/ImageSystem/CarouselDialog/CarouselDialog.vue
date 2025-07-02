<script setup>
import BaseDialog from "../BaseDialog.vue";
import { useCarouselStore } from "../../../stores/carouselPinia.ts";
import { ref, watch, computed } from "vue";
import OrderMode from "./OrderMode.vue";
import UploadMode from "./UploadMode.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import { imageCompression } from "../../../utils/imageCompression.js";
import Buttons from "./../../Buttons.vue";

const { selectedFiles, previewUrls, handleFileChange, resetUpload } =
  useUploadHandler();
const carouselStore = useCarouselStore();
const editMode = ref("");
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isDialogLoading = ref(false);
const dialog = ref(false);

const resetMode = () => {
  editMode.value = "";
  previewUrls.value = [];
  selectedFiles.value = [];
  errormessage.value = "";
  successmessage.value = "";
  loadingmessage.value = "";
  isDialogLoading.value = false;
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    loadingmessage.value = "上傳圖片中...";
    isDialogLoading.value = true;
    const compressedFiles = await imageCompression(selectedFiles);

    const res = await carouselStore.addImages(compressedFiles);
    carouselStore.fetchImages();
    resetUpload();
    successmessage.value = res.data.message;

    isDialogLoading.value = false;
  } catch (error) {
    errormessage.value = "上傳失敗...";

    resetUpload();
    carouselStore.fetchImages();
    console.error("上傳失敗：", error.response.data.message);
  }
};

const handleOrder = async () => {
  const newOrderArray = carouselStore.sortedImages.map((image, index) => ({
    ...image,
    order: index + 1,
  }));
  try {
    loadingmessage.value = "調整順序中...";
    isDialogLoading.value = true;
    const res = await carouselStore.adjustOrder(newOrderArray);
    successmessage.value = res.data.message;
    carouselStore.fetchImages();
    isDialogLoading.value = false;
  } catch (error) {
    errormessage.value = "調整順序失敗...";
    carouselStore.fetchImages();
    console.error("調整順序失敗：", error.response.data.message);
  }
};
const handleDelete = async (public_Id, id) => {
  try {
    loadingmessage.value = "刪除圖片中...";
    isDialogLoading.value = true;
    const res = await carouselStore.deleteImage(public_Id, id);
    successmessage.value = res?.data?.message;
    carouselStore.fetchImages();
    isDialogLoading.value = false;
  } catch (error) {
    errormessage.value = "刪除失敗...";
    carouselStore.fetchImages();
    console.error("刪除失敗：", error.response.data.message);
  }
};

const handleClose = () => {
  dialog.value = false;
  resetMode();
};

const imageUrls = computed(() => {
  return carouselStore.sortedImages.map((image) =>
    image.imageURL.replace(
      "upload/f_auto,q_100/",
      "upload/f_auto,q_auto,w_1440/"
    )
  );
});

watch(editMode, () => {
  errormessage.value = "";
  successmessage.value = "";
  loadingmessage.value = "";
  isDialogLoading.value = false;
});

watch(errormessage && successmessage, () => {
  setTimeout(() => {
    errormessage.value = "";
    successmessage.value = "";
  }, 3000);
});
</script>
<template>
  <div class="">
    <BaseDialog
      v-model:dialog="dialog"
      title="編輯輪播圖片"
      buttonText="編輯"
      buttonColor="secondary"
      position="absolute"
      vertical="top-[1%] "
      horizontal="right-[1%] md:right-[10%]"
      :isDialogLoading="isDialogLoading"
      :loadingmessage="loadingmessage"
      :errormessage="errormessage"
      :successmessage="successmessage"
    >
      <template #default>
        <v-card-text> 以下是現有的輪播圖片... </v-card-text>
        <div v-if="editMode !== 'order'" class="flex gap-2 flex-wrap">
          <div
            v-for="(image, index) in carouselStore.sortedImages"
            :key="index"
            class="carousel__image--editing relative"
          >
            <FontAwesomeIcon
              v-if="editMode === 'delete'"
              @click="handleDelete(image?.public_id, image._id)"
              :icon="faXmark"
              class="absolute left-1 text-white"
            />

            <img
              :src="imageUrls[index]"
              alt="carousel__image"
              class="w-full h-full object-cover"
              loading="lazy"
              :class="{ 'cursor-move': editMode === 'order' }"
            />
          </div>
        </div>
        <OrderMode v-if="editMode === 'order'" />
        <UploadMode
          v-if="editMode === 'upload'"
          :previewUrls="previewUrls"
          :selectedFiles="selectedFiles"
        />
      </template>

      <template #actions>
        <div class="flex justify-center items-center">
          <Buttons
            v-model:editMode="editMode"
            v-model:dialog="dialog"
            :orderMode="true"
            :uploadMode="true"
            :deleteMode="true"
            :handleFileChange="handleFileChange"
            :handleUpload="handleUpload"
            :handleOrder="handleOrder"
            :selectedFiles="selectedFiles"
            :resetMode="resetMode"
            :close="handleClose"
          />
        </div>
      </template>
    </BaseDialog>
  </div>
</template>
