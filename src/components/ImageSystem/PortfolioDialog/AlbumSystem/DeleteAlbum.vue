<script setup>
import { useUserStore } from "../../../../stores/userPinia.ts";
import { useAlbumStore } from "../../../../stores/albumPinia.ts";
import { useFrontStore } from "../../../../stores/frontPinia.ts";

const deleteMessage = defineModel("deleteMessage", {
  type: String,
  default: "",
});

const { id, publicId, topic } = defineProps({
  id: String,
  publicId: String,
  topic: String,
});

const userStore = useUserStore();
const albumStore = useAlbumStore();
const frontStore = useFrontStore();

const handleOpen = () => {
  return true;
};

const handleDelete = async () => {
  try {
    await albumStore.deleteImage(publicId, id);

    deleteMessage.value = "刪除成功";
    await albumStore.fetchImages();
    await frontStore.fetchImages();
  } catch (error) {
    deleteMessage.value = "刪除失敗...";
    await albumStore.fetchImages();
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
