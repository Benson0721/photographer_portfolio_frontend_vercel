<script setup>
import { useUserStore } from "../../../stores/userPinia.ts";
import { useFrontStore } from "../../../stores/frontPinia.ts";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
import DialogLoading from "../../../components/DialogLoading.vue";

const userStore = useUserStore();
const frontStore = useFrontStore();
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isLoading = ref(false);
const props = defineProps({
  Images: Array,
});

const { device } = useWindowSize();
const selectedImage = ref("");
const route = useRoute();
const handleOpen = async () => {
  errormessage.value = "";
  successmessage.value = "";
  selectedImage.value = "";
};

const handleChangeImage = async () => {
  if (selectedImage.value === "") return;
  try {
    const category = route.params.category;
    isLoading.value = true;
    loadingmessage.value = "切換圖片中...";
    await frontStore.updateFrontImage(category, selectedImage.value);
    selectedImage.value = "";
    isLoading.value = false;
    successmessage.value = "切換圖片成功";
  } catch (error) {
    selectedImage.value = "";
    errormessage.value = "切換圖片失敗";
    isLoading.value = false;
  }
};
</script>

<template>
  <v-dialog :max-width="device !== 'mobile' ? '60vw' : '100vw'">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="更改封面"
        variant="flat"
        :disabled="!userStore.isEditing"
        class=""
        @click="handleOpen"
        :class="!userStore.isEditing ? 'hidden' : 'block'"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="更改封面" class="p-4 relative">
        <DialogLoading
          :isLoading="isLoading"
          :loadingmessage="loadingmessage"
          :errormessage="errormessage"
          :successmessage="successmessage"
        />
        <v-card-text> 以下是現有的封面圖片...(不推薦長圖) </v-card-text>
        <div class="grid grid-cols-2 gap-0.5 lg:grid-cols-3 lg:gap-2">
          <div v-if="props.Images.length === 0">
            <v-card-text> 沒有圖片 </v-card-text>
          </div>
          <!--自製checked屬性 -->
          <div
            v-for="(image, index) in props.Images"
            :key="index"
            class="relative cursor-pointer w-[144px] h-[81px] md:w-[216px] md:h-[121px] lg:w-[288px] lg:h-[162px]"
            :class="
              selectedImage === image.imageURL
                ? 'border-2 border-green-500'
                : ''
            "
            @click="selectedImage = image.imageURL"
          >
            <img
              :src="image.imageURL"
              alt="topic__image"
              class="w-full h-full object-contain absolute top-0"
              loading="lazy"
            />
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="flex items-center">
            <v-btn text="確認" @click="handleChangeImage"></v-btn>
            <v-btn text="關閉" @click="isActive.value = false"></v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
