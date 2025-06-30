<script setup>
const props = defineProps({
  uploadMode: Boolean,
  handleUpload: Function,
  handleFileChange: Function,
  resetMode: Function,
  close: Function,
});

const editMode = defineModel("editMode", { type: String });
const dialog = defineModel("dialog", { type: Boolean });
</script>

<template>
  <div class="">
    <v-btn
      v-if="props.uploadMode && editMode === ''"
      text="上傳"
      @click="editMode = 'upload'"
    ></v-btn>
    <div
      class="flex flex-col md:flex-row w-full items-center justify-center relative"
      v-if="editMode === 'upload'"
    >
      <v-file-input
        prepend-icon=""
        class="w-[50vw] md:w-[30vw] h-[50px] mb-4 md:mb-1"
        name="images"
        @change="props.handleFileChange"
        variant="outlined"
        label="圖片上傳"
        multiple
        show-size
        clip
      >
      </v-file-input>
      <div class="flex">
        <v-btn text="送出" @click="props.handleUpload"></v-btn>
        <v-btn text="返回" @click="props.resetMode"></v-btn>
        <v-btn text="關閉" @click="props.close"></v-btn>
      </div>
    </div>
  </div>
</template>
