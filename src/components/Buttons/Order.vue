<script setup lang="ts">
const props = defineProps({
  orderMode:  Boolean,
  handleOrder: Function,
  resetMode: Function,
  close: Function,
});

const editMode = defineModel("editMode", { type: String });
const dialog = defineModel("dialog", { type: Boolean });
</script>

<template>
  <div class="">
    <v-btn
      v-if="props.orderMode && editMode === ''"
      text="調整順序"
      @click="editMode = 'order'"
    ></v-btn>

    <div class="flex" v-if="editMode === 'order'">
      <v-btn text="儲存" @click="props.handleOrder"></v-btn>
      <v-btn text="返回" @click="props.resetMode"></v-btn>
      <v-btn text="關閉" @click="close"></v-btn>
      
    </div>
  </div>
</template>
