<script setup>
const props = defineProps({
  deleteMode: Boolean,
  resetMode: Function,
  close: Function,
});

const editMode = defineModel("editMode", { type: String });
const dialog = defineModel("dialog", { type: Boolean });
</script>

<template>
  <div class="">
    <v-btn
      v-if="props.deleteMode && editMode === ''"
      text="刪除"
      @click="editMode = 'delete'"
    ></v-btn>

    <div class="" v-if="editMode === 'delete'">
      <v-btn text="返回" @click="props.resetMode"></v-btn>
      <v-btn text="關閉" @click="props.close"></v-btn>
    </div>
  </div>
</template>
