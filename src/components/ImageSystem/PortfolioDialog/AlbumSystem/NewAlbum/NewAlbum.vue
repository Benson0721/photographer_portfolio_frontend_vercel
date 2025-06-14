<script setup>
import { useUserStore } from "../../../../../stores/userPinia.ts";
import { useAlbumStore } from "../../../../../stores/albumPinia.ts";
import { useUploadHandler } from "../../../../../utils/useUploadHandler.ts";
import { useWindowSize } from "../../../../../utils/useWindowSize.js";
import { ref, computed } from "vue";
import UploadArea from "./UploadArea.vue";
import DialogLoading from "../../../../../components/DialogLoading.vue";

const userStore = useUserStore();
const albumStore = useAlbumStore();
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isDialogLoading = ref(false);

const { device } = useWindowSize();
const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();

const handleOpen = async () => {
  errormessage.value = "";
  successmessage.value = "";
};

const handleAddImage = async (data) => {
  if (selectedFiles.value.length === 0) return;

  try {
    const { category, notes, topic } = data;
    isLoading.value = true;
    loadingmessage.value = "新增主題中...";
    const message = await albumStore.addImage(
      selectedFiles.value,
      category,
      topic,
      notes
    );
    resetUpload();
    successmessage.value = message;
    isDialogLoading.value = false;
    await albumStore.fetchImages();
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    await albumStore.fetchImages();
    isDialogLoading.value = false;
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};

const previewUrl = computed(() => {
  return previewUrls.value[0]?.src;
});
</script>

<template>
  <v-dialog :max-width="device !== 'mobile' ? '60vw' : '100vw'">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="新增合輯"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="bg-green-500"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="新增主題" class="p-4 z-20">
        <DialogLoading
          :isLoading="isDialogLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />
        <FormKit
          type="form"
          :actions="false"
          @submit="handleAddImage"
          outerClass="w-full"
          validation="required"
          :validation-visibility="'submit'"
          incomplete-message="請填入必要資訊以完成新增"
          messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
        >
          <div class="flex flex-col md:flex-row w-full h-full gap-2">
            <div class="md:flex-1 pl-10 md:pl-16 mt-8">
              <UploadArea
                :handleSingleFileChange="handleSingleFileChange"
                :handleAddImage="handleAddImage"
                :selectedFiles="selectedFiles"
                :previewUrl="previewUrl"
              />
            </div>
            <div v-if="previewUrl" class="mb-10 md:flex-2">
              <v-card-text
                >以下為即將更新的圖片(單張圖片大小請勿超過10MB)</v-card-text
              >
              <img
                :src="previewUrl"
                alt="previewImage"
                class="flex-1 w-full h-full object-contain"
                draggable="false"
              />
            </div>
          </div>
          <v-card-actions>
            <div
              class="flex gap-2 justify-center absolute left-1/2 md:left-8/10 -translate-x-1/2 -translate-y-1/2"
            >
              <FormKit
                type="submit"
                label="送出"
                :classes="{
                  outer: 'mt-2 text-center transform',
                  input: 'text-black rounded bg-white transition duration-300',
                }"
              />
              <v-btn text="關閉" @click="isActive.value = false"></v-btn>
            </div>
          </v-card-actions>
        </FormKit>
      </v-card>
    </template>
  </v-dialog>
</template>
<style scoped lang="scss"></style>
