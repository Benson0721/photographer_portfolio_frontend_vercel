<script setup>
import { ref, onMounted, watch } from "vue";
import { useAboutStore } from "../../stores/aboutPinia";
import { useUserStore } from "../../stores/userPinia";

const aboutStore = useAboutStore();
const userStore = useUserStore();

const isAboutEditing = defineModel("isAboutEditing", { type: Boolean });

const text = ref("");
const html = ref("");

const handleEscape = (text) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/  /g, "&nbsp;&nbsp;");
};

async function handleSave() {
  // 先轉義防止 XSS，然後換行轉 <br>，空格轉 &nbsp;
  console.log(text.value);
  await aboutStore.updateAboutMe(text.value, userStore.user._id);
  isAboutEditing.value = false;
  await handleAboutMe();
}

const handleAboutMe = async () => {
  await aboutStore.fetchAboutMe();
  console.log(aboutStore.aboutMe);
  text.value = aboutStore.aboutMe;
  const escaped = handleEscape(text.value);
  html.value = escaped;
};

onMounted(() => {
  handleAboutMe();
});

watch(
  () => isAboutEditing.value,
  () => {
    console.log(isAboutEditing.value);
  }
);
</script>

<template>
  <div class="relative flex flex-col items-center justify-center">
    <h2
      class="text-[36px] md:text-[48px] lg:text-[72px] font-playfair text-black text-center"
    >
      Me
    </h2>
    <div class="absolute z-10 top-1/35 w-full">
      <div class="flex gap-2" v-if="!isAboutEditing">
        <v-btn
          class="w-[80px] h-[35px] text-[12px] md:w-[100px] md:h-[30px] md:text-[14px]"
          color="surface-variant"
          text="編輯介紹"
          variant="flat"
          :disabled="!userStore.showEdit()"
          @click="isAboutEditing = true"
          :class="userStore.showEdit() ? 'block' : 'hidden'"
        ></v-btn>
      </div>
      <div class="flex gap-2 w-full justify-between" v-if="isAboutEditing">
        <v-btn
          class="w-[80px] h-[35px] text-[12px] md:w-[100px] md:h-[30px] md:text-[14px]"
          color="surface-variant"
          text="儲存"
          variant="flat"
          @click="handleSave"
        ></v-btn>
        <v-btn
          class="w-[80px] h-[35px] text-[12px] md:w-[100px] md:h-[30px] md:text-[14px]"
          color="surface-variant"
          text="取消編輯"
          variant="flat"
          @click="isAboutEditing = false"
        ></v-btn>
      </div>
    </div>
    <textarea
      rows="20"
      cols="80"
      class="w-full h-full mt-8 text-center text-[0.75rem] md:text-[0.8rem] lg:text-[1.5rem]"
      v-if="isAboutEditing"
      v-model="text"
    ></textarea>
    <br />
    <div class="flex justify-center">
      <div
        v-if="!isAboutEditing"
        v-html="html"
        class="text-[0.75rem] md:text-[0.8rem] lg:text-[1.5rem] lg:w-[90%]"
      ></div>
    </div>
  </div>
</template>
<style scoped></style>
