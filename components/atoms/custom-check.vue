<template>
  <div
    class="rounded-full w-[44px] h-[24px] relative cursor-pointer transition-all"
    :class="isActive ? 'bg-[#60F]' : 'bg-[#2C2634]'"
  >
    <div
      class="bg-[#F5F5F7] w-[16px] h-[16px] absolute  rounded-full top-[4px] transition-all"
      :class="!isActive ? 'left-[4px]' : 'left-[24px]'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        isActive: {
            type: Boolean,
            required: true,
            default: false
        }
    }
})
</script>

<style lang="scss" scoped>
input {
    border-radius: 12px;
    color: white
}
</style>
