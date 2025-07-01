<script setup lang="ts">
defineProps<{
  status: "loading" | "error" | "success" | null;
  message?: string;
}>();
</script>

<template>
  <div
    v-if="status === 'loading'"
    class="flex items-center mt-2 absolute sm:top-1/19 top-1/15 right-1/8"
  >
    <div
      class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"
    ></div>
    <span class="ml-2 text-gray-500 text-sm">{{ message }}</span>
  </div>

  <v-card-text
    v-else-if="status === 'error'"
    class="text-red-500 absolute top-[10%] right-[10%]"
  >
    {{ message }}
  </v-card-text>

  <v-card-text
    v-else-if="status === 'success'"
    class="text-green-500 absolute top-[10%] right-[10%]"
  >
    {{ message }}
  </v-card-text>
</template>
