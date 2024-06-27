<template>
  <div class="rounded-lg p-6 w-full flex flex-col gap-6 bg-[#251F2D]">
    <div class="flex gap-2 justify-between items-center w-full">
      <div class="basis-1/2 text-[18px] font-bold">
        {{ title }}
      </div>
      <div class="basis-1/2 flex justify-end">
        <slot name="icon" />
      </div>
    </div>
    <p class="text-[15px]">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  setup() {
    return {}
  }
}
</script>

<style scoped>
.range {
  user-select: none;
  pointer-events: none;
  background: #000;
  height: 4px;
  outline: none;
  cursor: pointer;
}
</style>
