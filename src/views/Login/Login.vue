<script setup>
import { ref, reactive } from "vue";
import { useUserStore } from "../../stores/userPinia.ts";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const formData = reactive({
  username: "",
  password: "",
});
const errorMessage = ref("");

const handleSubmit = async (data) => {
  try {
    await userStore.login(data);
    router.push("/");
  } catch (error) {
    errorMessage.value = "登入失敗，請確認輸入有無正確~";
  }
};
</script>
<template>
  <div class="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
    <div>
      <h1 class="text-4xl lg:text-6xl text-center my-16 font-bold">Login</h1>
    </div>
    <div class="absolute top-1/4 right-1/9 border-2 p-4">
      <h2 class="text-center">測試用帳號/密碼😎</h2>
      <p>username: photographer</p>
      <p>password: pai0902</p>
    </div>
    <div class="relative w-[80%] flex flex-col items-center">
      <FormKit
        type="form"
        :actions="false"
        @submit="handleSubmit"
        outerClass="w-full"
        validation="required"
        :validation-visibility="'submit'"
        incomplete-message="請填寫完必要資訊以登入"
        messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
      >
        <p v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </p>
        <div class="flex flex-col md:flex-col justify-center">
          <FormKit
            v-model="formData.username"
            type="text"
            name="username"
            label="username"
            outerClass="mb-4 md:mr-8 w-full lg:text-2xl"
            innerClass="mt-4 border-b-2 border-black "
            labelClass="font-noto "
            validation="required"
            messages-class="text-red-500 text-sm"
            :validation-messages="{
              required: '不要忘記帳號喔~',
            }"
            :classes="{
              outer: '',
              inner: 'mt-4 border-b-2',
              input: 'w-full border-none bg-transparent focus:outline-none',
              inputInvalid: 'border-red-500', // 加紅線
            }"
          />
          <FormKit
            v-model="formData.password"
            type="password"
            name="password"
            label="Password"
            outerClass="mb-4 w-full lg:text-2xl"
            innerClass="mt-4 border-b-2 border-black"
            labelClass="text-black font-noto "
            validation="required"
            messages-class="text-red-500 text-sm"
            :validation-messages="{
              required: '不要忘記密碼喔~',
            }"
            :classes="{
              outer: '',
              inner: 'mt-4 border-b-2',
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
      </FormKit>
    </div>
  </div>
</template>
<style scoped></style>
