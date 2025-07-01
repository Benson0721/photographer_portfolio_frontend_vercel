<script setup>
import { useUserStore } from "../../../stores/userPinia.ts";
import { useFrontStore } from "../../../stores/frontPinia.ts";
import { useWindowSize } from "../../../utils/useWindowSize.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
import DialogLoading from "../../../components/DialogLoading.vue";
import BaseDialog from "../../../components/BaseDialog.vue";

const userStore = useUserStore();
const frontStore = useFrontStore();
const errormessage = ref("");
const successmessage = ref("");
const loadingmessage = ref("");
const isLoading = ref(false);
const dialog = ref(false);

const props = defineProps({
  Images: Array,
});

const { device } = useWindowSize();
const selectedImage = ref({ imageURL: "", public_id: "" });
const route = useRoute();

const handleOpen = async () => {
  errormessage.value = "";
  successmessage.value = "";
  selectedImage.value = { imageURL: "", public_id: "" };
  dialog.value = true;
};

const handleClose = () => {
  dialog.value = false;
};

const handleChangeImage = async () => {
  if (selectedImage.value.imageURL === "") return;
  try {
    const category = route.params.category;
    isLoading.value = true;
    loadingmessage.value = "切換圖片中...";
    await frontStore.updateFrontImage(
      category,
      selectedImage.value.imageURL,
      selectedImage.value.public_id
    );
    selectedImage.value = { imageURL: "", public_id: "" };
    isLoading.value = false;
    successmessage.value = "切換圖片成功";
  } catch (error) {
    selectedImage.value = { imageURL: "", public_id: "" };
    errormessage.value = "切換圖片失敗";
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <BaseDialog
      v-model:dialog="dialog"
      title="更改封面"
      buttonText="更改封面"
      buttonColor="info"
      position="relative"
      :width="device !== 'mobile' ? '60vw' : '60vw'"
      :isDialogLoading="isLoading"
      :loadingmessage="loadingmessage"
      :errormessage="errormessage"
      :successmessage="successmessage"
    >
      <template #default>
        <v-card-text> 以下是現有的封面圖片...(不推薦長圖) </v-card-text>
        <div
          class="grid gap-0.5 grid-cols-2 lg:grid-cols-3 grid-rows-2 place-items-center "
        >
          <div v-if="props.Images.length === 0">
            <v-card-text> 沒有圖片 </v-card-text>
          </div>
          <div
            v-for="(image, index) in props.Images"
            :key="index"
            class="relative cursor-pointer w-[144px] h-[81px] md:w-[216px] md:h-[121px] lg:w-[288px] lg:h-[162px]"
            :class="
              selectedImage.imageURL === image.imageURL
                ? 'border-2 border-green-500'
                : ''
            "
            @click="
              selectedImage = {
                imageURL: image.imageURL,
                public_id: image.public_id,
              }
            "
          >
            <img
              :src="image.imageURL"
              alt="topic__image"
              class="w-full h-full object-contain absolute top-0"
              loading="lazy"
            />
          </div>
        </div>
      </template>

      <template #actions>
        <v-btn text="確認" @click="handleChangeImage"></v-btn>
        <v-btn text="關閉" @click="handleClose"></v-btn>
      </template>
    </BaseDialog>
  </div>
</template>
