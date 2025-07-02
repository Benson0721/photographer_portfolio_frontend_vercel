<script setup lang="ts">
import DialogLoading from "./DialogLoading.vue";
import { useUploadHandler } from "../../utils/useUploadHandler.ts";
import { useUserStore } from "../../stores/userPinia.ts";
import { useWindowSize } from "../../utils/useWindowSize.js";
import { watch } from "vue";

const { device } = useWindowSize();

const userStore = useUserStore();
const dialog = defineModel("dialog", { type: Boolean });
defineProps<{
  position?: string;
  vertical?: string;
  horizontal?: string;
  buttonText: string;
  buttonColor: string;
  title: string;
  isDialogLoading: boolean;
  loadingmessage: string;
  errormessage: string;
  successmessage: string;
}>();

const { handleDragOver, handleDrop } = useUploadHandler();
</script>

<template>
  <div class="">
    <v-btn
      :color="buttonColor"
      variant="flat"
      :size="
        device === 'mobile'
          ? 'x-small'
          : device === 'tablet'
          ? 'small'
          : 'default'
      "
      :disabled="!userStore.showEdit()"
      class="z-10"
      @click="dialog = true"
      :class="
        userStore.showEdit()
          ? 'block' + ' ' + position + ' ' + vertical + ' ' + horizontal
          : 'hidden'
      "
    >
      {{ buttonText }}
    </v-btn>

    <v-dialog
      v-model="dialog"
      :width="device === 'mobile' ? '100vw' : '60vw'"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <v-card :title="title" class="p-4 z-20">
        <DialogLoading
          :status="
            isDialogLoading
              ? 'loading'
              : errormessage
              ? 'error'
              : successmessage
              ? 'success'
              : null
          "
          :message="
            isDialogLoading ? loadingmessage : errormessage || successmessage
          "
        />

        <v-card-text>
          <slot name="default" />
        </v-card-text>

        <v-card-actions>
          <slot name="actions" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
