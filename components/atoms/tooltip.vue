<template>
  <div style="background-image: url(/images/lottery/buy-tickets-modal/tooltip.svg);" class="text-white container">
    <slot />
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss" scoped>
    .container {
        min-height: 113px;
        z-index: 20;
        width: 300px;
        background-repeat: no-repeat;
        background-size: cover;
        padding: 15px;
    }
</style>
