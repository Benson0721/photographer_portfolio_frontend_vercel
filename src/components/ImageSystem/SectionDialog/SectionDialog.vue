<script setup lang="ts">
import { useUserStore } from "../../../stores/userPinia.ts";
import { useSectionStore } from "../../../stores/sectionPinia.ts";
import { ref, watch, computed } from "vue";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import { useDragHandler } from "../../../utils/useDragHandler.ts";
import { useUploadHandler } from "../../../utils/useUploadHandler.ts";
import BaseDialog from "../../BaseDialog.vue";
import { imageCompression } from "../../../utils/imageCompression.js";
import Buttons from "../../Buttons.vue";

const {
  selectedFiles,
  previewUrls,
  resetUpload,
  handleDragOver,
  handleDrop,
  handleSingleFileChange,
} = useUploadHandler();

const userStore = useUserStore();
const sectionStore = useSectionStore();
const { device } = useWindowSize();

const errormessage = ref("");
const successmessage = ref("");
const editMode = ref("");
const newTitle = ref("");

const isDialogLoading = ref(false);
const dialog = ref(false);

const loadingmessage = ref("調整中");

const props = withDefaults(
  defineProps<{
    url: string;
    title: string;
    id: string;
    publicID: string;
    width: number;
    height: number;
    updateSizes: Function;
    curOffsetY: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  }>(),
  {
    url: () => "",
    title: () => "",
    id: () => "",
    publicID: () => "",
    width: () => 0,
    height: () => 0,
    updateSizes: () => {},
    curOffsetY: () => ({ mobile: 0, tablet: 0, desktop: 0 }),
  }
);

const { offsetY, startDrag, onDrag, endDrag, isDragging, dragMessage } =
  useDragHandler(
    720,
    "section",
    props.id,
    isDialogLoading,
    props.curOffsetY,
    device
  );

const handleOpen = async () => {
  await sectionStore.fetchImages();
  props.updateSizes();
  newTitle.value = props.title;
  editMode.value = "";
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    isDialogLoading.value = true;
    loadingmessage.value = "編輯圖片中...";
    const compressedFiles = await imageCompression(selectedFiles);
    const message = await sectionStore.updateImage(
      compressedFiles,
      newTitle.value,
      props.id,
      props.publicID
    );
    resetUpload();
    isDialogLoading.value = false;
    successmessage.value = message;
    await sectionStore.fetchImages();
  } catch (error) {
    errormessage.value = "上傳失敗...";
    resetUpload();
    isDialogLoading.value = false;
    await sectionStore.fetchImages();
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const handleTitleUpload = async () => {
  if (newTitle.value === props.title) return;
  try {
    const message = await sectionStore.updateSectionName(
      props.id,
      newTitle.value
    );
    successmessage.value = message;
    isDialogLoading.value = true;
    loadingmessage.value = "編輯圖片中...";
    await sectionStore.fetchImages();
    isDialogLoading.value = false;
  } catch (error) {
    errormessage.value = "上傳失敗...";
    await sectionStore.fetchImages();
    isDialogLoading.value = false;
    console.error(error);
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const handleClose = () => {
  dialog.value = false;
  resetMode();
};

const resetMode = () => {
  editMode.value = "";
  errormessage.value = "";
  successmessage.value = "";
  loadingmessage.value = "";
  isDialogLoading.value = false;
  newTitle.value = props.title;
  resetUpload();
};

const previewImage = computed(() => {
  if (previewUrls.value && previewUrls.value.length > 0) {
    return previewUrls?.value[0]?.src;
  }
  return props.url || "";
});

watch(handleOpen, () => {
  errormessage.value = "";
  successmessage.value = "";
});

watch(isDragging, async () => {
  await sectionStore.fetchImages();
});

watch(dragMessage, async () => {
  successmessage.value = dragMessage.value;
  setTimeout(() => {
    successmessage.value = "";
  }, 3000);
});
</script>

<template>
  <BaseDialog
    v-model:dialog="dialog"
    title="編輯分區圖片"
    buttonText="編輯"
    buttonColor="secondary"
    vertical="top-[5%]"
    horizontal="right-[5%]"
    position="absolute"
    :loadingmessage="loadingmessage"
    :successmessage="successmessage"
    :errormessage="errormessage"
    :isDialogLoading="isDialogLoading"
    :width="device !== 'mobile' ? '60vw' : '100vw'"
  >
    <template #default>
      <v-card-text
        v-if="isDragging"
        class="text-green-500 absolute top-1/14 right-1/15"
      >
        調整中...
      </v-card-text>
      <v-card-text> 以下是現有的分區圖片... (可拖移圖片調整位置!) </v-card-text>
      <div class="flex justify-center gap-2 flex-wrap">
        <div
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @touchstart.prevent="startDrag"
          @touchmove="onDrag"
          @touchend="endDrag"
          class="relative overflow-hidden"
          :style="{ width: `${width}px`, height: `${height}px` }"
        >
          <img
            :src="previewImage"
            alt="previewImage"
            class="draggable-image"
            :style="{ top: `${offsetY[device]}px` }"
            @dragstart.prevent
            draggable="false"
            pre
          />
          <h2
            class="category-section__title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-playfair text-[28px] md:text-[40px] lg:text-[72px]"
          >
            {{ newTitle }}
          </h2>
        </div>
      </div>
    </template>

    <template #actions>
      <div class="flex flex-row md:flex-row">
        <Buttons
          v-model:editMode="editMode"
          v-model:dialog="dialog"
          v-model:newTitle="newTitle"
          :selectedFiles="selectedFiles"
          :uploadMode="true"
          :titleMode="true"
          :handleFileChange="handleSingleFileChange"
          :handleUpload="handleUpload"
          :handleTitleUpload="handleTitleUpload"
          :resetMode="resetMode"
          :close="handleClose"
        />
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped lang="scss">
.draggable-image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  user-select: none;
  transition: top 0.1s ease-out;
}
.draggable-image:active {
  cursor: grabbing;
}
</style>
