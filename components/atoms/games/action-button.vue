<template>
  <button style="background-color:#201A29" :class="[`text-[${color}]`,'bg-[#201A29]  hover:opacity-75 rounded-xl min-w-[60px] h-[40px] text-[12px] lg:text-[16px] font-[700] px-[16px]']">
    <slot />
  </button>
</template>

<script lang="ts">
export default {
  props: {
    color: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.btnMaxCounter {
  background-color: #9747FF;
  border: 1px solid #9747FF;
  transition-duration: .1s;

  &:hover {
    background-color: white;
    color: #38333F;
    border: 1px solid #38333F;

  }
}
</style>
