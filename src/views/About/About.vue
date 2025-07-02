<script setup lang="ts">
import "./About.scss";
import {
  ref,
  onMounted,
  onBeforeUnmount,
  reactive,
  nextTick,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import { FormKit } from "@formkit/vue";
import Handing from "../../components/Handing.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import AboutDialog from "../../components/ImageSystem/AboutDialog/AboutDialog.vue";
import { AboutImage } from "../../types/apiType";
import { useAboutStore } from "../../stores/aboutPinia";
import { useWindowSize } from "../../utils/useWindowSize";
import { useImageSizeList } from "../../utils/useImageSizeList";
import { sendEmail } from "../../utils/sendEmail";
import PageLoading from "../../components/PageLoading.vue";
import { preloadImages } from "../../utils/preloadImages";
import AboutTextarea from "./AboutTextarea.vue";
import { useToast } from "../../utils/useToast";

const { imageRefs, updateSizes } = useImageSizeList();

const { device } = useWindowSize();
const route = useRoute();
const aboutStore = useAboutStore();

const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const title = ref("About");
const isLoading = ref(false);
const isEmailSending = ref(false);
const loadingmessage = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const HeadingStyle = ref(
  "mt-4 text-[36px] md:text-[72px] lg:text-[96px] font-playfair text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
);

const isScrolledPast = ref(false);
const isSocialScrolledPast = ref(false);
const isAboutPastScroll = ref(false);
const isContactPastScroll = ref(false);
const isAboutEditing = ref(false);
const toast = useToast();

let AboutObserver: IntersectionObserver;
let ContactObserver: IntersectionObserver;
let combinedHandler: () => void;

const form = ref(null);
const formValid = ref(false);

const rules = {
  required: (v: string) => !!v || "此欄位為必填",
  email: (v: string) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "請輸入正確的 Email 格式",
};

const imageMap = computed(() => {
  const result: Record<string, AboutImage> = {};
  const targets = ["about", "pai", "moto"];
  targets.forEach((title) => {
    const image = aboutStore.aboutImages.find(
      (img) => img.displayName === title
    );
    if (image) {
      result[title] = image;
    }
  });
  return result;
});
const backgroundStyle = computed(() => {
  if (device.value !== "mobile") {
    return {
      backgroundImage: `url(${imageMap.value["about"]?.imageURL})`,
    };
  }
  return {};
});

const handleSubmit = async () => {
  try {
    if (!formValid.value) return;
    isEmailSending.value = true;
    loadingmessage.value = "正在寄出信件...";
    if (
      !formData.value.name ||
      !formData.value.email ||
      !formData.value.subject ||
      !formData.value.message
    ) {
      throw new Error("請填寫完整表單");
    }
    const res = await sendEmail(formData.value);
    successMessage.value = res.message;
    setTimeout(() => {
      clearMessage();
    }, 5000);
    isEmailSending.value = false;
    form.value.reset(); // 清空欄位資料
    form.value.resetValidation(); // 也清空錯誤狀態
  } catch (error: any) {
    errorMessage.value = error.message;
    setTimeout(() => {
      clearMessage();
    }, 5000);
    isEmailSending.value = false;
    form.value.resetValidation();
  }
};
const observerFunc = () => {
  const contactSection = document.querySelector("#contact");
  const aboutSection = document.querySelector("#about");
  if (!contactSection || !aboutSection) return;

  AboutObserver = new IntersectionObserver(
    ([entry]) => {
      isAboutPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.05,
    }
  );
  ContactObserver = new IntersectionObserver(
    ([entry]) => {
      isContactPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.1,
    }
  );

  AboutObserver.observe(aboutSection);
  ContactObserver.observe(contactSection);
};
const socialFunc = () => {
  const navbar = document.querySelector(".navbar");
  const aboutSection = document.querySelector("#about");
  const socialMediaButtons = document.querySelector(".social-media-buttons");

  const handleSocialMediaScroll = () => {
    if (!socialMediaButtons || !aboutSection) return;

    const socialRect = socialMediaButtons.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();

    isSocialScrolledPast.value = socialRect.bottom >= aboutRect.top;
  };

  const handleScroll = () => {
    if (!navbar || !aboutSection) return;

    const navbarRect = navbar.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();

    isScrolledPast.value = navbarRect.bottom >= aboutRect.top;
  };
  combinedHandler = () => {
    handleScroll();
    handleSocialMediaScroll();
  };
  window.addEventListener("scroll", combinedHandler);
  handleScroll(); // 初始化時檢查
};
const scrollFunc = (hash: string) => {
  setTimeout(() => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, 1000);
};
const clearMessage = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const loadImage = async () => {
  await aboutStore.fetchImages();
  await preloadImages(aboutStore.aboutImages.map((image) => image.imageURL));
};

onMounted(async () => {
  await loadImage();
  isLoading.value = false;
  await nextTick(() => {
    observerFunc();
    socialFunc();
    updateSizes();
  });
  if (route.hash) {
    scrollFunc(route.hash);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", combinedHandler);
  AboutObserver.disconnect();
  ContactObserver.disconnect();
});
</script>
<template #default="{ state: { valid } }">
  <PageLoading v-if="isLoading" />
  <main v-else class="about__bg transition" :style="backgroundStyle">
    <v-snackbar
      v-if="successMessage"
      v-model="toast.snackbar"
      :timeout="2000"
      color="success"
      bottom
      left
    >
      {{ successMessage }}
    </v-snackbar>
    <v-snackbar
      v-if="errorMessage"
      v-model="toast.snackbar"
      :timeout="2000"
      color="error"
      bottom
      left
    >
      {{ errorMessage }}
    </v-snackbar>
    <Navbar :isScrolledPast="isScrolledPast" />
    <div class="about__banner">
      <img
        v-if="device === 'mobile'"
        :src="imageMap['about']?.imageURL"
        :ref="(el) => (imageRefs['about'] = el)"
        alt="about"
        class="w-full h-auto object-cover md:hidden"
      />
      <Handing v-model:title="title" :HeadingStyle="HeadingStyle" />
      <AboutDialog
        :url="imageMap['about']?.imageURL"
        :publicID="imageMap['about']?.public_id"
        :id="imageMap['about']?._id"
      />
    </div>
    <div class="bg-amber-50">
      <div class="about" id="about">
        <div
          class="about__pai h-[250px] md:h-full relative mt-5"
          :class="{ 'fade-controller': isAboutPastScroll }"
        >
          <img
            :src="imageMap['pai']?.imageURL"
            alt="攝影師帥哥本人"
            class="w-full h-full object-cover object-[0%_30%]"
            :ref="(el) => (imageRefs['pai'] = el)"
          />
          <AboutDialog
            :url="imageMap['pai']?.imageURL"
            :publicID="imageMap['pai']?.public_id"
            :id="imageMap['pai']?._id"
          />
        </div>
        <div
          class="about__content"
          :class="{ 'fade-controller': isAboutPastScroll }"
        >
          <div class="px-4 h-full text-black font-noto">
            <AboutTextarea v-model:isAboutEditing="isAboutEditing" />
          </div>
        </div>
        <div class="about__whitespace md:hidden"></div>
      </div>
      <div class="flex flex-col md:flex-row mt-8" id="contact">
        <div
          class="relative h-[250px] md:h-full md:order-2 md:flex-2/8"
          :class="{ 'fade-controller': isContactPastScroll }"
        >
          <img
            :src="imageMap['moto']?.imageURL"
            alt="moto"
            class="w-full h-full object-cover object-[0%_25%]"
            :ref="(el) => (imageRefs['moto'] = el)"
          />
          <AboutDialog
            :url="imageMap['moto']?.imageURL"
            :publicID="imageMap['moto']?.public_id"
            :id="imageMap['moto']?._id"
          />
        </div>
        <div
          class="flex flex-col items-center p-4 md:p-8 lg:p-12 relative md:flex-3/5 md:order-1"
          :class="{ 'fade-controller': isContactPastScroll }"
        >
          <h2
            class="mb-10 lg:mb-16 text-[36px] md:text-[48px] lg:text-[72px] font-playfair text-black text-center"
          >
            Contact
          </h2>
          <div
            v-if="isEmailSending"
            class="flex items-center absolute sm:top-1/7 md:top-1/4"
          >
            <div
              class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"
            ></div>
            <span class="ml-2 text-gray-500 text-sm">{{ loadingmessage }}</span>
          </div>

          <v-form
            ref="form"
            v-model="formValid"
            @submit.prevent="handleSubmit"
            class="w-full"
          >
            <!-- 上排輸入區：姓名 + Email -->
            <div class="flex flex-col md:flex-row">
              <v-text-field
                v-model="formData.name"
                :rules="[rules.required]"
                label="姓名"
                name="name"
                class="mb-4 md:mr-8 w-full md:w-1/2 mt-4 font-noto"
                hide-details="auto"
                variant="underlined"
              />

              <v-text-field
                v-model="formData.email"
                :rules="[rules.required, rules.email]"
                label="Email"
                name="email"
                class="mb-4 w-full md:w-1/2 mt-4 font-noto"
                hide-details="auto"
                variant="underlined"
              />
            </div>

            <!-- 下排輸入區：標題 + 訊息 -->
            <div class="flex flex-col">
              <v-text-field
                v-model="formData.subject"
                :rules="[rules.required]"
                label="標題"
                name="subject"
                class="mb-4 w-full mt-4 font-noto"
                hide-details="auto"
                variant="underlined"
              />

              <v-textarea
                v-model="formData.message"
                :rules="[rules.required]"
                label="訊息"
                name="message"
                class="mb-4 mt-4 font-noto"
                hide-details="auto"
                auto-grow
                rows="4"
                variant="underlined"
              />
            </div>

            <!-- 送出按鈕 -->
            <div class="my-8 text-center">
              <v-btn
                type="submit"
                color="grey-lighten-1"
                class="text-black font-semibold py-2 px-16 rounded hover:bg-gray-400 transition duration-300"
              >
                送出
              </v-btn>
            </div>
          </v-form>
          <!--<FormKit
            type="form"
            :actions="false"
            @submit="handleSubmit"
            outerClass="w-full"
            validation="required"
            :validation-visibility="'submit'"
            incomplete-message="請填寫完必要資訊以送出信件"
            messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/5"
          >
            <div class="flex flex-col md:flex-row">
              <FormKit
                v-model="formData.name"
                type="text"
                name="name"
                label="姓名"
                outerClass="mb-4 md:mr-8 w-full md:w-1/2"
                innerClass="mt-4 border-b-2 border-black"
                labelClass=" font-noto "
                messages-class="text-red-500 text-sm"
                :classes="{
                  outer: '',
                  inner: 'mt-4 border-b-2',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
              <FormKit
                v-model="formData.email"
                type="email"
                name="email"
                label="Email"
                outerClass="mb-4 w-full md:w-1/2"
                innerClass="mt-4 border-b-2 border-black"
                labelClass="text-black font-noto "
                messages-class="text-red-500 text-sm"
                :classes="{
                  outer: '',
                  inner: 'mt-4 border-b-2',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
            </div>
            <div class="flex flex-col md:flex-col">
              <FormKit
                v-model="formData.subject"
                type="text"
                name="subject"
                label="標題"
                outerClass="mb-4 w-full md:w-full"
                innerClass="mt-4 border-b-2 border-black"
                labelClass="text-black font-noto "
                messages-class="text-red-500 text-sm"
                :classes="{
                  outer: '',
                  inner: 'mt-4 border-b-2',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
              <FormKit
                v-model="formData.message"
                type="textarea"
                name="message"
                label="訊息"
                outerClass="mb-4"
                innerClass="mt-4 border-black"
                labelClass="text-black font-noto"
                cols="30"
                messages-class="text-red-500 text-sm"
                :classes="{
                  outer: '',
                  inner:
                    'mt-4 border-b-2 max-h-[150px] md:max-h-[100px] lg:max-h-[300px]',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
            </div>
            <FormKit
              type="submit"
              label="送出"
              :classes="{
                outer: 'my-8 text-center',
                input:
                  'bg-gray-300 text-black font-semibold py-2 px-16 rounded hover:bg-gray-400 transition duration-300',
              }"
            />
          </FormKit>-->
        </div>
      </div>
    </div>
    <SocialMediaButtons
      :isSocialScrolledPast="isSocialScrolledPast"
      :isLoading="isLoading"
    />
    <Footer />
  </main>
</template>
