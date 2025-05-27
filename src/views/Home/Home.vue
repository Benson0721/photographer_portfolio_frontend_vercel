<script setup lang="ts">
import Navbar from "../../components/Navbar/Navbar.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import CategorySection from "../../components/CategorySection/CategorySection.vue";
import Footer from "../../components/Footer.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useCarouselStore } from "../../stores/carouselPinia.ts";
import { useSectionStore } from "../../stores/sectionPinia.ts";
import PageLoading from "../../components/PageLoading.vue";
import { preloadImages } from "../../utils/preloadImages.js";

const carouselStore = useCarouselStore();
const sectionStore = useSectionStore();

const isPageLoading = ref(true);

const currentMbImage = ref(0);
const isSectionPastScroll = ref(false);
let observer: IntersectionObserver | null = null;
let intervalId1: ReturnType<typeof setInterval> | null = null;
let intervalId2: ReturnType<typeof setInterval> | null = null;

const currentLayer = ref(0); // 0 or 1，控制哪一層在上面
const layerImages = ref([]);

let index = 0;

const switchBgImage = async () => {
  const nextIndex = (index + 1) % carouselStore.sortedImages.length;
  const backLayer = 1 - currentLayer.value;

  // 設定下一張圖到備用層，並顯示它（被上一層蓋住）
  layerImages.value[backLayer].imageURL =
    carouselStore.sortedImages[nextIndex].imageURL;
  layerImages.value[backLayer].opacity = 1;

  // 淡出當前層
  layerImages.value[currentLayer.value].opacity = 0;

  // 等待淡出動畫完成後，切換層
  setTimeout(() => {
    currentLayer.value = backLayer;
    index = nextIndex;
  }, 1000);
};
const switchMbImage = () => {
  currentMbImage.value =
    (currentMbImage.value + 1) % carouselStore.sortedImages.length;
};

const observerFunc = () => {
  const categorySection = document.querySelector(".category-section");
  if (!categorySection) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      isSectionPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.05,
    }
  );

  observer.observe(categorySection);
};

const loadImage = async () => {
  await carouselStore.fetchImages();
  await sectionStore.fetchImages();
  await preloadImages(
    carouselStore.sortedImages.map((image) => image.imageURL)
  );
  await preloadImages(
    sectionStore.sectionImages.map((image) => image.imageURL)
  );
};

onMounted(async () => {
  await loadImage();
  layerImages.value = [
    { imageURL: carouselStore?.sortedImages[0]?.imageURL, opacity: 1 },
    { imageURL: carouselStore?.sortedImages[1]?.imageURL, opacity: 0 },
  ];
  isPageLoading.value = false;
  await nextTick(() => {
    observerFunc();
    intervalId1 = setInterval(switchBgImage, 8000);
    intervalId2 = setInterval(switchMbImage, 8000);
  });
});

onBeforeUnmount(() => {
  observer.disconnect();
  clearInterval(intervalId1);
  clearInterval(intervalId2);
});

/*watch(currentMbImage, (newIndex) => {
  //預載
  const img = new Image();
  img.src = carouselStore.sortedImages[newIndex].imageURL;
});*/
</script>
<template>
  <PageLoading v-if="isPageLoading" />
  <main v-else :class="`home transition`">
    <div class="background-container">
      <div
        v-for="(layer, i) in layerImages"
        :key="i"
        class="bg-layer"
        :style="{
          backgroundImage: `url(${layer.imageURL})`,
          opacity: layer.opacity,
          zIndex: i,
        }"
      ></div>
    </div>
    <Navbar />
    <Carousel
      :currentImage="currentMbImage"
      :carouselImages="carouselStore.sortedImages"
    />
    <CategorySection :isSectionPastScroll="isSectionPastScroll" />
    <Footer />
    <SocialMediaButtons />
  </main>
</template>
<style scoped>
.home {
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  position: relative;
  overflow: hidden;
}

.background-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;
  pointer-events: none;
}
</style>
