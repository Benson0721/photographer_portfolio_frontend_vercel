<script setup lang="ts">
import Handing from "../Handing.vue";
import { ref } from "vue";
import "./Carousel.scss";
import CarouselDialog from "../ImageSystem/CarouselDialog/CarouselDialog.vue";
import { useWindowSize } from "../../utils/useWindowSize.js";
import { CarouselImage } from "../../types/apiType.ts";

const { device } = useWindowSize();

const { currentImage } = defineProps<{
  currentImage: number;
  carouselImages: CarouselImage[];
}>();

const title = ref("PaiCheng");
const content = ref("Photographer");

const HeadingStyle = ref(
  "text-[36px] md:text-[72px] lg:text-[96px] text-white font-bold font-playfair"
);
const ContentStyle = ref(
  "text-[18px] md:text-[24px] lg:text-[36px] font-playfair text-white"
);
</script>

<template>
  <div class="carousel">
    <CarouselDialog/>
    <Handing
      v-if="device !== 'mobile'"
      v-model:title="title"
      v-model:content="content"
      :HeadingStyle="HeadingStyle"
      :ContentStyle="ContentStyle"
    />
    <div
      v-if="device === 'mobile'"
      class="carousel__image"
      v-for="(image, index) in carouselImages"
      :key="image._id"
      :class="currentImage === index ? 'carousel__image--active' : ''"
    >
      <img
        :src="image.imageURL"
        alt="carousel_image"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <Handing
        v-model:title="title"
        v-model:content="content"
        :HeadingStyle="HeadingStyle"
        :ContentStyle="ContentStyle"
      />
    </div>
  </div>
</template>
