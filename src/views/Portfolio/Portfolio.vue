<script setup>
import { onMounted, computed, ref, nextTick, watch } from "vue";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import NewAlbum from "../../components/ImageSystem/PortfolioDialog/AlbumSystem/NewAlbum/NewAlbum.vue";
import NewDisplay from "../../components/ImageSystem/PortfolioDialog/DisplaySystem/NewDisplay.vue";
import NewGallery from "../../components/ImageSystem/PortfolioDialog/GallerySystem/NewGallery.vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../stores/userPinia.ts";
import { useGalleryStore } from "../../stores/galleryPinia.ts";
import { useAlbumStore } from "../../stores/albumPinia.ts";
import { useFrontStore } from "../../stores/frontPinia.ts";
import { useWindowSize } from "../../utils/useWindowSize.js";
import Handing from "../../components/Handing.vue";
import AlbumImage from "./AlbumImage.vue";
import GalleryImage from "./GalleryImage.vue";
import DisplayImage from "./DisplayImage.vue";
import ChangeFrontPage from "../../components/ImageSystem/PortfolioDialog/ChangeFrontPage.vue";
import "./Portfolio.scss";
import PageLoading from "../../components/PageLoading.vue";

const { device } = useWindowSize();
const albumStore = useAlbumStore();
const galleryStore = useGalleryStore();
const userStore = useUserStore();
const frontStore = useFrontStore();
const route = useRoute();
const router = useRouter();
const curCategory = ref("");
const curTopic = ref("");
const curNotes = ref("");
const mode = ref("Gallery");
const curTopicID = ref("");
const deleteMode = ref(false);
const isLoading = ref(true);
const HeadingStyle = ref(
  "mt-4 text-[36px] md:text-[72px] lg:text-[84px] font-playfair text-white"
);
const ContentStyle = ref(
  "text-[18px] md:text-[36px] lg:text-[48px] font-playfair text-white"
);

const categorys = ref([
  "Architecture",
  "Landscape",
  "Portrait",
  "Motorcycle",
  "Others",
  "Album",
]);

const selectCategory = ref("");

const onCategoryChange = async (category) => {
  if (mode.value === "Display") {
    return;
  } else {
    await router.push(`/portfolio/${category}`);
    curTopicID.value = "";
  }
};

const preloadImages = async (imageURLs) => {
  //預載圖片
  let total = imageURLs.length;
  return new Promise((resolve) => {
    imageURLs.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = img.onerror = () => {
        total--;
        if (total === 0) {
          resolve();
        }
      };
    });
  });
};

const loadImage = async () => {
  const category = route.params.category;
  curCategory.value = route.params.category;

  if (category && category !== "Album") {
    await galleryStore.fetchImages(category);
    await frontStore.fetchImages(category);
    await preloadImages(
      galleryStore.galleryImages.map((image) => image.imageURL)
    );
    await preloadImages(frontStore.frontImages.map((image) => image.imageURL));
  } else {
    await albumStore.fetchImages();
    await frontStore.fetchImages(category);
    await preloadImages(albumStore.albumImages.map((image) => image.imageURL));
    await preloadImages(frontStore.frontImages.map((image) => image.imageURL));
  }
};

//手機端or桌面端的圖片切換
const backgroundStyle = computed(() => {
  if (curTopicID.value) {
    const image = albumStore.albumImages.find(
      (image) => image._id === curTopicID.value //進入display image顯示的封面
    );

    return {
      backgroundImage: `url(${image?.imageURL})`,
    };
  } else {
    const image = frontStore.frontImages.find(
      (image) => image.category === route.params.category
    );
    return {
      backgroundImage: `url(${image?.imageURL})`,
    };
  }
});

const imageStyle = computed(() => {
  if (curTopicID.value) {
    const image = albumStore.albumImages.find(
      (image) => image._id === curTopicID.value
    );
    return image?.imageURL;
  } else {
    const image = frontStore.frontImages.find(
      (image) => image.category === route.params.category
    );
    return image?.imageURL;
  }
});

const handleBack = () => {
  curTopicID.value = "";
  mode.value = "Album";
};

onMounted(async () => {
  await loadImage();
  isLoading.value = false;
  await nextTick();
});

watch(
  () => curTopicID.value,
  () => {
    if (curTopicID.value) {
      mode.value = "Display";
    }
  }
);

watch(
  () => route.params.category, //()=>在變化時監聽，若直接用值則只監聽初始值
  async (newVal) => {
    await loadImage();
    if (newVal === "Album") {
      mode.value = "Album";
    } else {
      mode.value = "Gallery";
    }
  },
  { immediate: true } //使其在掛載時就執行一次
);
</script>
<template>
  <PageLoading v-if="isLoading" />
  <main v-else class="portfolio__bg transition" :style="backgroundStyle">
    <Navbar />
    <div class="portfolio__banner relative md:static">
      <img
        v-if="device === 'mobile'"
        :src="imageStyle"
        alt="portfolio"
        class="w-full h-auto object-cover md:hidden"
      />
      <Handing
        v-if="mode === 'Gallery' || mode === 'Album'"
        v-model:category="curCategory"
        :HeadingStyle="HeadingStyle"
      />
      <Handing
        v-else-if="mode === 'Display'"
        v-model:topic="curTopic"
        v-model:notes="curNotes"
        :HeadingStyle="HeadingStyle"
        :ContentStyle="ContentStyle"
      />
      <div
        v-if="mode === 'Album'"
        class="flex gap-2 absolute z-10 top-1/18 left-8/10 md:top-1/8 md:left-7/9"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      >
        <NewAlbum />
        <ChangeFrontPage :Images="albumStore.albumImages" />
      </div>
      <div
        v-else-if="mode === 'Gallery'"
        class="absolute top-1/8 right-1 flex justify-end gap-2 pr-8"
        :class="userStore.showEdit() ? 'block' : 'hidden'"
      >
        <NewGallery />
        <ChangeFrontPage :Images="galleryStore.galleryImages" />
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
        <v-btn
          color="surface-variant"
          text="返回"
          variant="flat"
          :disabled="!userStore.showEdit()"
          class="bg-black"
          @click="handleBack"
          :class="userStore.showEdit() ? 'block' : 'hidden'"
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
      <AlbumImage
        v-if="mode === 'Album'"
        v-model:mode="mode"
        v-model:curTopicID="curTopicID"
        v-model:curTopic="curTopic"
        v-model:curNotes="curNotes"
      />
      <GalleryImage
        v-else-if="mode === 'Gallery'"
        :deleteMode="deleteMode"
        :curCategory="curCategory"
      />
      <DisplayImage
        v-else
        :deleteMode="deleteMode"
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
