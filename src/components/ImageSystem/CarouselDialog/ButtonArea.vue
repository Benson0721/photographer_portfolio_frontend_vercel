<script setup lang="ts">
const editMode = defineModel("editMode", { type: String });
const props = withDefaults(
  defineProps<{
    orderMode: Boolean;
    uploadMode: Boolean;
    deleteMode: Boolean;
    handleUpload: Function;
    handleOrder: Function;
    selectedFiles: File[];
    resetMode: Function;
    handleFileChange: Function;
  }>(),
  {
    orderMode: () => false,
    uploadMode: () => false,
    deleteMode: () => false,
    handleFileChange: () => {},
    handleUpload: () => {},
    handleOrder: () => {},
    selectedFiles: () => [],
    resetMode: () => {},
  }
);
</script>
<template>
  <div class="flex" v-if="editMode === ''">
    <v-btn
      v-if="props.orderMode"
      text="調整順序"
      @click="editMode = 'order'"
    ></v-btn>
    <v-btn
      v-if="props.uploadMode"
      text="上傳"
      @click="editMode = 'upload'"
    ></v-btn>
    <v-btn
      v-if="props.deleteMode"
      text="刪除"
      @click="editMode = 'delete'"
    ></v-btn>
  </div>
  <div class="" v-if="editMode === 'order'">
    <v-btn text="儲存" @click="props.handleOrder"></v-btn>
    <v-btn text="重置模式" @click="props.resetMode"></v-btn>
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
  <div class="" v-if="editMode === 'delete'">
    <v-btn text="重置模式" @click="props.resetMode"></v-btn>
  </div>
</template>
