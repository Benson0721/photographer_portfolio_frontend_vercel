<script setup lang="ts">
import Order from "./Buttons/Order.vue";
import Upload from "./Buttons/Upload.vue";
import Delete from "./Buttons/Delete.vue";
import Title from "./Buttons/Title.vue";

const editMode = defineModel("editMode", { type: String });
const dialog = defineModel("dialog", { type: Boolean });
const newTitle = defineModel("newTitle", { type: String });
withDefaults(
  defineProps<{
    orderMode?: boolean;
    uploadMode?: boolean;
    deleteMode?: boolean;
    titleMode?: boolean;
    handleUpload?: Function;
    handleTitleUpload?: Function;
    handleOrder?: Function;
    selectedFiles?: File[];
    resetMode?: Function;
    close?: Function;
    handleFileChange?: Function;
  }>(),
  {
    orderMode: () => false,
    uploadMode: () => false,
    deleteMode: () => false,
    titleMode: () => false,
    handleFileChange: () => {},
    handleUpload: () => {},
    handleTitleUpload: () => {},
    handleOrder: () => {},
    selectedFiles: () => [],
    resetMode: () => {},
    close: () => {},
  }
);
</script>
<template>
  <div class="">
    <div class="flex">
      <Order
        v-model:editMode="editMode"
        v-model:dialog="dialog"
        :orderMode="orderMode"
        :handleOrder="handleOrder"
        :resetMode="resetMode"
        :close="close"
      />
      <Upload
        v-model:editMode="editMode"
        v-model:dialog="dialog"
        :uploadMode="uploadMode"
        :handleUpload="handleUpload"
        :selectedFiles="selectedFiles"
        :handleFileChange="handleFileChange"
        :resetMode="resetMode"
        :close="close"
      />
      <Delete
        v-model:editMode="editMode"
        v-model:dialog="dialog"
        :deleteMode="deleteMode"
        :resetMode="resetMode"
        :close="close"
      />
      <Title
        v-model:editMode="editMode"
        v-model:dialog="dialog"
        v-model:newTitle="newTitle"
        :titleMode="titleMode"
        :handleTitleUpload="handleTitleUpload"
        :resetMode="resetMode"
        :close="close"
      />
      <v-btn v-if="editMode == ''" text="關閉" @click="close"></v-btn>
    </div>
  </div>
</template>
