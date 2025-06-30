<script setup>
import DialogLoading from "./DialogLoading.vue";
import { useUploadHandler } from "../utils/useUploadHandler.ts";
import { useUserStore } from "../stores/userPinia.ts";

const userStore = useUserStore();
const dialog = defineModel("dialog", { type: Boolean });
const props = defineProps({
  buttonText: String,
  buttonColor: String,
  title: String,
  width: {
    type: String,
    default: "60vw",
  },
  isDialogLoading: Boolean,
  loadingmessage: String,
  errormessage: String,
  successmessage: String,
  floatingText: String,
});

const { handleDragOver, handleDrop } = useUploadHandler();
</script>

<template>
  <div class="">
    <v-btn
      :color="buttonColor"
      variant="flat"
      :disabled="!userStore.showEdit()"
      class="absolute z-10 top-1/18 left-5/6"
      @click="dialog = true"
      :class="userStore.showEdit() ? 'block' : 'hidden'"
    >
      {{ buttonText }}
    </v-btn>

    <v-dialog
      v-model="dialog"
      :width="width"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <v-card :title="title" class="p-4 z-20">
        <!-- Loading and messages -->
        <DialogLoading
          :isLoading="isDialogLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />

        <!-- Custom main content -->
        <v-card-text>
          <slot name="default" />
        </v-card-text>

        <!-- Custom action area -->
        <v-card-actions>
          <slot name="actions" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
/* 你可以根據需求調整卡片內部樣式 */
</style>
