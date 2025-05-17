<script setup>
import { useUserStore } from "../../../../../stores/userPinia.ts";
import { useTopicStore } from "../../../../../stores/albumPinia.ts";
import { useUploadHandler } from "../../../../../utils/useUploadHandler.ts";
import { useWindowSize } from "../../../../../utils/useWindowSize.js";
import { ref, computed, defineProps } from "vue";
import UploadArea from "./UploadArea.vue";
import DialogLoading from "../../../../../components/DialogLoading.vue";

const props = defineProps({
  id: String,
  publicId: String,
  topic: String,
  notes: String,
  category: String,
  imageURL: String,
  curCategory: String,
});

const userStore = useUserStore();
const topicStore = useTopicStore();
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isLoading = ref(false);

const { device } = useWindowSize();
const { selectedFiles, handleSingleFileChange, resetUpload, previewUrls } =
  useUploadHandler();

const handleOpen = async () => {
  console.log("handleOpen");
};

const handleEdit = async (data) => {
  try {
    const { category, notes, topic } = data;
    const newData = {
      image: selectedFiles.value,
      category,
      topic,
      notes,
      publicID: props.publicId,
      id: props.id,
    };
    const res = await topicStore.updateImage(newData);
    resetUpload();
    successmessage.value = res.data.message;
    if (props.curCategory === "All") {
      await topicStore.fetchImages();
    } else {
      await topicStore.fetchImages(props.curCategory);
    }
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    resetUpload();
    if (props.curCategory === "All") {
      await topicStore.fetchImages();
    } else {
      await topicStore.fetchImages(props.curCategory);
    }
    console.error(error);
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
        text="編輯"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="bg-indigo-500"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="編輯圖片" class="p-4 z-20">
        <DialogLoading
          :isLoading="isLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />
        <FormKit
          type="form"
          :actions="false"
          @submit="handleEdit"
          :value="{
            topic: props.topic,
            notes: props.notes,
            category: props.category,
          }"
          outerClass="w-full"
          validation="required"
          :validation-visibility="'submit'"
          incomplete-message="請填入必要資訊以完成編輯"
          messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
        >
          <div class="flex flex-col md:flex-row w-full h-full gap-2">
            <div class="md:flex-1 pl-16 mt-8">
              <UploadArea
                :handleSingleFileChange="handleSingleFileChange"
                :selectedFiles="selectedFiles"
              />
            </div>
            <div class="mb-10 md:flex-1">
              <div class="w-full h-full">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="previewImage"
                  class="flex-1 w-full h-full object-contain"
                  draggable="false"
                />
                <img
                  v-else
                  :src="props.imageURL"
                  alt="currentImage"
                  class="flex-1 w-full h-full object-contain"
                  draggable="false"
                />
              </div>
            </div>
          </div>
          <v-card-actions>
            <div
              class="flex gap-2 absolute left-1/2 md:left-8/10 -translate-x-1/2 -translate-y-1/2"
            >
              <FormKit
                type="submit"
                label="送出"
                :classes="{
                  outer: 'mt-2 text-center  transform',
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
