<script setup lang="ts">
import { defineProps } from "vue";
import Loading from "./Loading.vue";
const { isLoading, loadingmessage, errormessage, successmessage } =
  defineProps<{
    isLoading: boolean;
    loadingmessage: string;
    errormessage: string;
    successmessage: string;
  }>();
</script>

<template>
  <Loading :isLoading="isLoading" :loadingmessage="loadingmessage" />
  <v-card-text
    class="text-red-500 absolute top-1/10 right-1/8"
    v-if="errormessage"
    >{{ errormessage }}</v-card-text
  >
  <v-card-text
    class="text-green-500 absolute top-1/10 right-1/8"
    v-if="successmessage"
    >{{ successmessage }}</v-card-text
  >
</template>
