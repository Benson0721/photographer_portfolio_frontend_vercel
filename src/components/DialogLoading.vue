<script setup lang="ts">
const { isLoading, loadingmessage, errormessage, successmessage } =
  defineProps<{
    isLoading: boolean;
    loadingmessage: string;
    errormessage: string;
    successmessage: string;
  }>();
</script>

<template>
  <div
    v-if="isLoading"
    class="flex items-center absolute sm:top-1/19 top-1/15 right-1/8"
  >
    <div
      class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"
    ></div>
    <span class="ml-2 text-gray-500 text-sm">{{ loadingmessage }}</span>
  </div>
  <v-card-text
    class="text-red-500 absolute top-1/15 right-1/8"
    v-if="errormessage"
    >{{ errormessage }}</v-card-text
  >
  <v-card-text
    class="text-green-500 absolute top-1/15 right-1/8"
    v-if="successmessage"
    >{{ successmessage }}</v-card-text
  >
</template>
