<template>
  <div class="info-window">
    <img src="/games/icons/info-orange.png">
    <slot />
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.info-window {
  border-radius: 8px;
  background: #2C2634;
  box-shadow: 2px 4px 24px 0px rgba(20, 23, 54, 0.04);
  @apply absolute top-[40px] flex items-center gap-4 py-[12px] pl-[12px] pr-[36px] z-10 w-[330px];

  @screen ss {
    width: fit-content;
  }
}

</style>
