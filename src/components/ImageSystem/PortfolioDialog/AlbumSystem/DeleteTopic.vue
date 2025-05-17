<script setup>
import { useUserStore } from "../../../../stores/userPinia.ts";
import { useTopicStore } from "../../../../stores/albumPinia.ts";

import { ref, defineProps } from "vue";

const { id, publicId, topic, curCategory } = defineProps({
  id: String,
  publicId: String,
  topic: String,
  curCategory: String,
});

const userStore = useUserStore();
const topicStore = useTopicStore();
const errormessage = ref("");
const successmessage = ref("");

const handleOpen = () => {
  return true;
};

const handleDelete = async () => {
  try {
    const res = await topicStore.deleteImage(publicId, id);
    successmessage.value = res.data.message;
    if (curCategory === "All") {
      await topicStore.fetchImages();
    } else {
      await topicStore.fetchImages(curCategory);
    }
  } catch (error) {
    errormessage.value = error?.response?.data?.message;
    if (props.curCategory === "All") {
      await topicStore.fetchImages();
    } else {
      await topicStore.fetchImages(props.curCategory);
    }
    console.error("上傳失敗：", error?.response?.data?.message);
  }
};
</script>

<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="刪除"
        variant="flat"
        :disabled="!userStore.isEditing"
        class="bg-red-500"
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="你真的要這樣對我ㄇ😿">
        <v-card-text>
          確定要刪除" {{ topic }} "嗎?此行為無法復原喔!~
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="刪除" @click="handleDelete"></v-btn>
          <v-btn text="取消" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<style scoped lang="scss"></style>
