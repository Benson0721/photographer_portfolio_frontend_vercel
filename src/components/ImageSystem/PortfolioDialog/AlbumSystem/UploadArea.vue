<script setup lang="ts">
import { reactive } from "vue";
const props = withDefaults(
  defineProps<{
    handleSingleFileChange: Function;
    selectedFiles: File[];
  }>(),
  {
    handleSingleFileChange: () => {},
    selectedFiles: () => [],
  }
);
const formData = reactive({
  topic: "",
  notes: "",
});
</script>
<template>
  <div class="flex flex-col">
    <FormKit
      v-model="formData.topic"
      type="text"
      name="topic"
      label="主題"
      outerClass="mb-4 w-3/5 md:w-1/2"
      innerClass="mt-4 border-b-2 border-black"
      labelClass="text-black font-noto "
      validation="required"
      messages-class="text-red-500 text-sm"
      :validation-messages="{
        required: '請輸入主題',
      }"
      :classes="{
        outer: '',
        inner: 'mt-4 border-b-2',
        input: 'w-full border-none bg-transparent focus:outline-none',
        inputInvalid: 'border-red-500', // 加紅線
      }"
    />
    <FormKit
      v-model="formData.notes"
      type="text"
      name="notes"
      label="敘述"
      outerClass="mb-4 w-3/5 md:w-1/2"
      innerClass="mt-4 border-b-2 border-black"
      labelClass="text-black font-noto "
      validation="required"
      messages-class="text-red-500 text-sm"
      :validation-messages="{
        required: '請輸入敘述',
      }"
      :classes="{
        outer: '',
        inner: 'mt-4 border-b-2',
        input: 'w-full border-none bg-transparent focus:outline-none',
        inputInvalid: 'border-red-500', // 加紅線
      }"
    />

    <v-file-input
      class="w-2/3 h-[50px] my-8 mr-16 md:mb-0"
      name="images"
      prepend-icon=""
      @change="props.handleSingleFileChange"
      variant="outlined"
      label="上傳"
      multiple
      accept=".jpg,.jpeg,.png,.gif,.webp"
      show-size
      clip
    >
    </v-file-input>
  </div>
</template>
