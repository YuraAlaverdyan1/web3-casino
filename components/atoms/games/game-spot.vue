<template>
  <div
    class="w-full relative border-2 rounded-[12px] border-rd-border-purple justify-center items-center flex flex-col gap-6"
    :class="withPadding ? 'p-[4px] sm:p-[24px]' : 'p-0'"
  >
    <div class="order-3 lg:order-1 w-full h-full ">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true,
      default: ''
    },
    textClass: {
      type: String,
      required: false,
      default: ''
    },
    withPadding: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.game-spot {
  min-height: 600px;
  @apply w-full relative border-2 overflow-hidden rounded-[12px] border-rd-border-purple justify-center p-[4px] sm:p-[24px] items-center flex flex-col gap-6 max-h-[504px];
}
.game-chi-fou-mi {
  @screen sm {
    min-height: 700px !important;
  }
  min-height: 320px !important;
  padding: 0 !important;
}
</style>
