<script setup lang="ts">
import BaseDialog from "../../../BaseDialog.vue";
import UploadArea from "./UploadArea.vue";
import { useUserStore } from "../../../../stores/userPinia";
import { useAlbumStore } from "../../../../stores/albumPinia";
import { useUploadHandler } from "../../../../utils/useUploadHandler";
import { imageCompression } from "../../../../utils/imageCompression.js";
import { ref, computed, watch } from "vue";

const dialog = defineModel<boolean>("dialog");

const userStore = useUserStore();
const albumStore = useAlbumStore();
const formRef = ref();

const topic = ref("");
const notes = ref("");

const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isDialogLoading = ref(false);

const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();

const previewUrl = computed(() => previewUrls.value[0]?.src || "");

watch(dialog, (val) => {
  if (val) {
    topic.value = "";
    notes.value = "";
    errormessage.value = "";
    successmessage.value = "";
    resetUpload();
  }
});

const topicRules = [(v: string) => !!v || "請輸入主題"];

const handleAddImage = async () => {
  const isValid = await formRef.value.validate();
  if (!isValid.valid || selectedFiles.value.length === 0) return;

  isDialogLoading.value = true;
  loadingmessage.value = "新增合輯中...";

  try {
    const compressedFiles = await imageCompression(selectedFiles);
    const message = await albumStore.addImage(
      compressedFiles,
      topic.value,
      notes.value
    );
    successmessage.value = message;
    resetUpload();
    topic.value = "";
    notes.value = "";
    await albumStore.fetchImages();
    dialog.value = false;
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
    :isDialogLoading="isDialogLoading"
    :loadingmessage="loadingmessage"
    :errormessage="errormessage"
    :successmessage="successmessage"
    @submit="handleAddImage"
  >
    <template #default>
      <v-form ref="formRef" @submit.prevent="handleAddImage">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="pl-4 md:pl-8 mt-4 md:mr-8">
            <UploadArea
              v-model:topic="topic"
              v-model:notes="notes"
              :handleSingleFileChange="handleSingleFileChange"
              :selectedFiles="selectedFiles"
            />
          </div>
          <div class="flex items-center justify-center">
            <div v-if="previewUrl">
              <v-card-text class="text-sm text-gray-600"
                >以下為即將更新的圖片</v-card-text
              >
              <img
                :src="previewUrl"
                alt="previewImage"
                class="w-full max-h-[300px] object-contain"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </v-form>
    </template>

    <template #actions>
      <v-btn type="submit">送出</v-btn>
      <v-btn text @click="dialog = false">取消</v-btn>
    </template>
  </BaseDialog>
</template>
