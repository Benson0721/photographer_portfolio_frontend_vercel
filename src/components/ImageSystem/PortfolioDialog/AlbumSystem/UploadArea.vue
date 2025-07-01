<script setup lang="ts">
const topic = defineModel("topic", { type: String });
const notes = defineModel("notes", { type: String });

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

const topicRules = [
  (v: string) => !!v || "請輸入主題",
  (v: string) => v.length <= 10 || "主題長度不能超過10",
];
const notesRules = [
  (v: string) => !!v || "請輸入描述",
  (v: string) => v.length <= 20 || "描述長度不能超過20",
];
</script>
<template>
  <div class="flex flex-col gap-8">
    <v-text-field
      v-model="topic"
      label="主題"
      :rules="topicRules"
      variant="outlined"
      density="default"
      required
      outlined
      class="w-[50vw] md:w-[30vw] h-[50px] mb-4 md:mb-1"
      prepend-icon=""
    />

    <v-textarea
      v-model="notes"
      label="描述"
      outlined
      variant="outlined"
      density="default"
      rows="3"
      class="w-full"
      :rules="notesRules"
    />
    <v-file-input
      class="w-full h-[50px] mr-16 md:mb-0"
      name="images"
      prepend-icon=""
      @change="props.handleSingleFileChange"
      variant="outlined"
      label="上傳"
      multiple
      accept=".jpg,.jpeg,.png,.gif,.webp"
      show-size
      clip
    />
  </div>
</template>
