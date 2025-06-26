<script setup lang="ts">
const editMode = defineModel("editMode", { type: String });
const props = withDefaults(
  defineProps<{
    uploadMode: Boolean;
    handleUpload: Function;
    selectedFiles: File[];
    resetMode: Function;
    changeTitleMode: Boolean;
    handleTitleUpload: Function;
    handleFileChange: Function;
  }>(),
  {
    uploadMode: () => false,
    handleFileChange: () => {},
    handleUpload: () => {},
    selectedFiles: () => [],
    resetMode: () => {},
    changeTitleMode: () => false,
    handleTitleUpload: () => {},
  }
);
</script>
<template>
  <div class="flex" v-if="editMode === ''">
    <v-btn
      v-if="props.uploadMode"
      text="上傳"
      @click="editMode = 'upload'"
    ></v-btn>
    <v-btn
      v-if="props.changeTitleMode"
      text="更改標題"
      @click="editMode = 'changeTitle'"
    ></v-btn>
  </div>
  <div
    class="flex w-[600px] h-[150px] items-center relative"
    v-if="editMode === 'upload'"
  >
    <v-file-input
      class="w-full h-[50px]"
      name="images"
      @change="props.handleFileChange"
      variant="outlined"
      label="圖片上傳"
      multiple
      show-size
      clip
    >
    </v-file-input>
    <v-btn text="送出" @click="props.handleUpload"></v-btn>
    <v-btn text="重置模式" @click="props.resetMode"></v-btn>
  </div>
  <div class="flex" v-if="editMode === 'changeTitle'">
    <v-btn text="送出" @click="props.handleTitleUpload"></v-btn>
    <v-btn text="重置模式" @click="props.resetMode"></v-btn>
  </div>
</template>
