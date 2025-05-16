<script setup>
import { onMounted, computed, ref, nextTick, watch } from "vue";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import NewTopic from "../../components/ImageSystem/PortfolioDialog/TopicSystem/NewTopic/NewTopic.vue";
import NewDisplay from "../../components/ImageSystem/PortfolioDialog/DisplaySystem/NewDisplay.vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../stores/userPinia.ts";
import { useTopicStore } from "../../stores/topicPinia";
import { useWindowSize } from "../../utils/useWindowSize.js";
import Handing from "../../components/Handing.vue";
import TopicImage from "./TopicImage.vue";
import DisplayImage from "./DisplayImage.vue";
import ChangeFrontPage from "../../components/ImageSystem/PortfolioDialog/TopicSystem/ChangeFrontPage.vue";
import "./Portfolio.scss";

const { device } = useWindowSize();
const topicStore = useTopicStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const curCategory = ref("");
const curTopic = ref("");
const curNotes = ref("");
const mode = ref("Topic");
const curTopicID = ref("");
const deleteMode = ref(false);
const isLoading = ref(true);
const HeadingStyle = ref(
  "mt-4 text-[36px] md:text-[72px] lg:text-[96px] font-playfair text-white"
);
const ContentStyle = ref(
  "text-[18px] md:text-[36px] lg:text-[48px] font-playfair text-white"
);

const categorys = ref([
  "All",
  "Architecture",
  "Landscape",
  "Portrait",
  "Street",
  "Motorcycle",
  "Others",
]);

const selectCategory = ref("");

const onCategoryChange = async (category) => {
  await router.push(`/portfolio/${category}`);
  mode.value = "Topic";
  curTopicID.value = "";
};

const loadImage = async () => {
  const category = route.params.category;
  curCategory.value = route.params.category;

  if (category && category !== "All") {
    await topicStore.fetchImages(category);
    preloadImages(topicStore.frontImages.map((image) => image.imageURL));
  } else {
    await topicStore.fetchImages();
    preloadImages(topicStore.frontImages.map((image) => image.imageURL));
  }
};

const backgroundStyle = computed(() => {
  if (device.value !== "mobile") {
    if (curTopicID.value) {
      const image = topicStore.topicImages.find(
        (image) => image._id === curTopicID.value //進入display image顯示的封面
      );
      return {
        backgroundImage: `url(${image?.imageURL})`,
      };
    } else {
      const image = topicStore.frontImages.find(
        (image) => image.category === route.params.category
      );
      return {
        backgroundImage: `url(${image?.imageURL})`,
      };
    }
  }
});

const frontImageStyle = computed(() => {
  if (device.value == "mobile") {
    if (curTopicID.value) {
      const image = topicStore.topicImages.find(
        (image) => image._id === curTopicID.value //進入display image顯示的封面
      );
      return image?.imageURL;
    } else {
      const image = topicStore.frontImages.find(
        (image) => image.category === route.params.category
      );
      return image?.imageURL;
    }
  }
});

const preloadImages = (imageURLs) => {
  //預載圖片
  imageURLs.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

onMounted(async () => {
  await loadImage();
  await nextTick();
  isLoading.value = false;
});

watch(
  () => route.params.category, //()=>在變化時監聽，若直接用值則只監聽初始值
  async () => {
    curCategory.value = route.params.category;
    if (curCategory.value === "All") {
      await topicStore.fetchImages();
    } else {
      await topicStore.fetchImages(curCategory.value);
    }
  }
);
</script>
<template>
  <main class="portfolio__bg transition" :style="backgroundStyle">
    <Navbar />
    <div class="portfolio__banner relative md:static">
      <img
        v-if="device === 'mobile'"
        :src="frontImageStyle"
        alt="portfolio"
        class="w-full h-auto object-cover md:hidden"
      />
      <Handing
        v-if="mode === 'Topic'"
        v-model:category="curCategory"
        :HeadingStyle="HeadingStyle"
      />
      <Handing
        v-else
        v-model:topic="curTopic"
        v-model:notes="curNotes"
        :HeadingStyle="HeadingStyle"
        :ContentStyle="ContentStyle"
      />
      <div
        v-if="mode === 'Topic'"
        class="flex gap-2 absolute z-10 top-1/18 left-8/10 md:top-1/8 md:left-7/9"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      >
        <NewTopic />
        <ChangeFrontPage />
      </div>
      <div
        v-else
        class="absolute top-1/8 right-1 flex justify-end gap-2 pr-8"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      >
        <NewDisplay :curTopicID="curTopicID" />
        <v-btn
          v-if="!deleteMode"
          color="surface-variant"
          text="刪除"
          variant="flat"
          :disabled="!userStore.showEdit()"
          class="bg-red-500"
          @click="deleteMode = true"
          :class="userStore.showEdit() ? 'block' : 'hidden'"
        ></v-btn>
        <v-btn
          v-else
          color="surface-variant"
          text="取消刪除模式"
          variant="flat"
          :disabled="!userStore.showEdit()"
          class="bg-blue-500"
          @click="deleteMode = false"
          :class="deleteMode ? 'block' : 'hidden'"
        ></v-btn>
      </div>
    </div>
    <div class="portfolio__category">
      <div
        v-if="device !== 'mobile'"
        class="portfolio__category__list md:gap-0.5 lg:gap-1"
      >
        <button
          v-for="(category, index) in categorys"
          :key="index"
          class="portfolio__category__list__item font-noto textShadow"
          :class="
            route.params.category === category
              ? 'portfolio__category__list__item--active'
              : ''
          "
          @click="onCategoryChange(category)"
        >
          {{ category }}
        </button>
      </div>
      <div v-else class="px-2 pt-2">
        <v-select
          label="選擇主題"
          :items="categorys"
          variant="outlined"
          v-model="selectCategory"
          @update:model-value="onCategoryChange"
        ></v-select>
      </div>
    </div>
    <div class="portfolio__gallery transition">
      <TopicImage
        v-if="mode === 'Topic'"
        v-model:mode="mode"
        v-model:curTopicID="curTopicID"
        v-model:curTopic="curTopic"
        v-model:curNotes="curNotes"
        :curCategory="curCategory"
      />
      <DisplayImage
        v-else
        :deleteMode="deleteMode"
        v-model:mode="mode"
        v-model:curTopicID="curTopicID"
      />
    </div>
    <Footer />
  </main>
</template>
<style scoped>
.fade-out {
  animation: fade-out 1s forwards;
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(80px);
  }
}
</style>
