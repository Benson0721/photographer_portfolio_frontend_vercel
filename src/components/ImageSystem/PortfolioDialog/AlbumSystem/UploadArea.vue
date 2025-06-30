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

const topicRules = [(v) => !!v || "請輸入主題"];
</script>
<template>
  <div class="flex flex-col w-full">
    <v-text-field
      v-model="topic"
      label="主題"
      :rules="topicRules"
      required
      outlined
      class="w-full mt-4"
    />
    <v-textarea v-model="notes" label="描述" outlined rows="3" class="w-full mt-2" />

    <v-file-input
      class="w-full h-[50px] my-8 mr-16 md:mb-0"
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
