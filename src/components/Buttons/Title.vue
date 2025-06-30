<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  titleMode: Boolean,
  handleTitleUpload: Function,
  resetMode: Function,
  close: Function,
});

const editMode = defineModel("editMode", { type: String });
const dialog = defineModel("dialog", { type: Boolean });
const newTitle = defineModel("newTitle", { type: String });

const titleRules = ref([
  (value: string) => !!value || "Required.",
  (value: string) =>
    (value && value.length <= 15) || "Title must be less than 15 characters",
]);
</script>

<template>
  <div class="">
    <v-btn
      v-if="props.titleMode && editMode === ''"
      text="更改標題"
      @click="editMode = 'changeTitle'"
    ></v-btn>

    <div
      class="flex flex-col md:flex-row w-full items-center justify-center relative"
      v-if="editMode === 'changeTitle'"
    >
      <v-text-field
        v-model="newTitle"
        :counter="15"
        variant="outlined"
        density="default"
        class="w-[50vw] md:w-[30vw] h-[50px] mb-4 md:mb-1"
        :label="'新標題'"
        :rules="titleRules"
        prepend-icon=""
        required
      ></v-text-field>
      <div class="flex">
        <v-btn text="送出" @click="props.handleTitleUpload"></v-btn>
        <v-btn text="返回" @click="props.resetMode"></v-btn>
        <v-btn text="關閉" @click="props.close"></v-btn>
      </div>
    </div>
  </div>
</template>
