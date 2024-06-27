<template>
  <div v-if="!isSmall" class="info-container">
    <div v-for="(data, index) of wheelData.data" :key="index" class="flex justify-between items-center">
      <div>
        {{ data.title }}
      </div>
      <div class="text-xl font-semibold">
        {{ data.data }} <span v-if="data.token">{{ data.token }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import wheelData from '~/data/wheel-info.json'
defineProps({
    isSmall: {
        type: Boolean,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.info-container {
    background: #201A29;
    border-radius: 12px;
    padding: 10px;
  }
</style>
