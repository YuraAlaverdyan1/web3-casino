<template>
  <div :style="`background: ${color}`" class="multiple-item">
    {{ multiple }}x
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    required: true
  },
  multiple: {
    type: Number,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.multiple-item {
  height: 40px;
  width: 50px;
  border-radius: 6px;
  color: #171120;
  @apply flex items-center justify-center text-lg font-medium;
}
</style>
