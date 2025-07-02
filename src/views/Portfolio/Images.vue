<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useGalleryStore } from "../../stores/galleryPinia.ts";
import { useDisplayStore } from "../../stores/displayPinia.ts";
import { useUserStore } from "../../stores/userPinia.ts";
import EditAlbum from "../../components/ImageSystem/PortfolioDialog/AlbumSystem/EditAlbum.vue";
import DeleteAlbum from "../../components/ImageSystem/PortfolioDialog/AlbumSystem/DeleteAlbum.vue";
import { AlbumImage, GalleryImage, DisplayImage } from "../../types/apiType";
import { useToast } from "../../utils/useToast";

const toast = useToast();
const userStore = useUserStore();
const galleryStore = useGalleryStore();
const displayStore = useDisplayStore();

import VueEasyLightbox from "vue-easy-lightbox";
const props = defineProps({
  deleteMode: Boolean,
  curCategory: String,
  images: Array<AlbumImage | GalleryImage | DisplayImage>,
});
const curTopicID = defineModel("curTopicID", { type: String });
const curTopic = defineModel("curTopic", { type: String });
const curNotes = defineModel("curNotes", { type: String });
const mode = defineModel("mode", { type: String });

const handleTopicClick = (item) => {
  curTopicID.value = item._id;
  curTopic.value = item.topic;
  curNotes.value = item.notes;
  mode.value = "Display";
};

const deleteMessage = ref("");

const visible = ref(false);
const isImageLoading = ref(false);
const index = ref(0);

// 當點擊小圖時
const showLightbox = (idx) => {
  index.value = idx;
  visible.value = true;
};

const hideLightbox = () => {
  visible.value = false;
};

const handleDeleteImage = async (public_id, _id) => {
  if (mode.value === "Display") {
    const message = await displayStore.deleteImage(public_id, _id);
    deleteMessage.value = message;
    return;
  } else {
    const message = await galleryStore.deleteImage(public_id, _id);
    deleteMessage.value = message;
    return;
  }
};

const handleImageLoad = () => {
  isImageLoading.value = false;
};

let observer = null;

const imageStates = ref(new Map());

const setupObserver = async () => {
  let attempts = 0;
  const maxAttempts = 5;
  const expectedImages = props.images.length;

  while (attempts < maxAttempts) {
    await nextTick(); // 等待 DOM 更新
    const imageElements = document.querySelectorAll(
      ".portfolio__gallery__image"
    );

    if (imageElements.length >= expectedImages) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              imageStates.value.set(entry.target.id, true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01 }
      );
      imageElements.forEach((el) => observer.observe(el));
      return;
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待 100ms
  }
};

// 監控 TopicImage 變化
watch(
  () => props.images,
  async () => {
    if (observer) {
      observer.disconnect();
    }
    imageStates.value.clear();
    await setupObserver();
  },
  { deep: true, immediate: true } // 立即執行以初始化
);
watch(deleteMessage, (newValue) => {
  if (newValue) {
    toast.show(newValue);
    setTimeout(() => {
      deleteMessage.value = "";
    }, 3000);
  }
});

onBeforeUnmount(() => {
  observer.disconnect();
});

watch(
  () => isImageLoading,
  (newValue) => {
    isImageLoading.value = false;
  }
);
</script>
<template>
  <v-snackbar
    v-if="deleteMessage"
    v-model="toast.snackbar"
    :timeout="2000"
    color="success"
  >
    {{ toast.message }}
  </v-snackbar>
  <masonry-wall
    :items="props.images || []"
    :min-columns="1"
    :max-columns="3"
    :column-width="200"
    :gap="4"
  >
    <template #default="{ item, index }">
      <div
        class="portfolio__gallery__image"
        :class="imageStates.get(item._id) ? 'fade-controller' : ''"
        :style="{ '--i': index }"
        :data-id="item._id"
      >
        <div
          v-if="mode === 'Album'"
          class="flex gap-0.5 md:gap-2 absolute z-10 top-1/18 left-[70%] md:top-1/10 md:left-[50%] lg:left-[65%]"
          :class="userStore.showEdit() ? 'block' : 'hidden'"
        >
          <EditAlbum
            :id="item?._id"
            :topic="item?.topic"
            :notes="item?.notes"
            :imageURL="item?.imageURL"
            :publicId="item?.public_id"
          />
          <DeleteAlbum
            v-model:deleteMessage="deleteMessage"
            :topic="item?.topic"
            :id="item._id"
            :publicId="item?.public_id"
          />
        </div>
        <FontAwesomeIcon
          v-if="deleteMode && mode !== 'Album'"
          @click="handleDeleteImage(item?.public_id, item?._id)"
          :icon="faXmark"
          class="absolute right-3 top-1 text-white md:text-3xl cursor-pointer"
        />
        <v-skeleton-loader
          v-if="isImageLoading"
          type="image"
        ></v-skeleton-loader>
        <img
          v-else
          :src="item?.imageURL"
          :key="index"
          alt="portfolio"
          class="w-full max-h-[600px] object-cover cursor-pointer rounded"
          loading="lazy"
          decoding="async"
          @click="
            mode === 'album'
              ? () => {
                  return;
                }
              : showLightbox(index)
          "
          @load="handleImageLoad"
        />
        <div
          v-if="mode === 'Album'"
          class="portfolio__gallery__image__info"
          @click="handleTopicClick(item)"
        >
          <p
            class="text-[24px] md:text-[28px] lg:text-[36px] font-playfair text-white text-center"
          >
            {{ item.topic }}
          </p>
          <p
            class="text-[14px] md:text-[18px] lg:text-[20px] font-playfair text-white text-center"
          >
            {{ item.notes }}
          </p>
        </div>
      </div>
    </template>
  </masonry-wall>
  <VueEasyLightbox
    v-if="mode === 'Display' || mode === 'Gallery'"
    :visible="visible"
    :imgs="props.images.map((item) => item.imageURL)"
    :index="index"
    @hide="hideLightbox"
  />
</template>
<style scoped>
.fade-controller {
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: calc(0.3s + var(--i) * 0.2s);
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
