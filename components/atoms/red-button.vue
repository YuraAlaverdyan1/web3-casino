<template>
  <button class="btn flex justify-center items-center gap-4">
    <slot />
  </button>
</template>

<script lang="ts">
export default { }
</script>

<style lang="scss" scoped>
    .btn {
        padding: 10px 35px;
        color: white;
        font-size: 20px;
        font-weight: 500;
        background: linear-gradient(270deg, #F01F49 0.25%, #A81633 100%);
        box-shadow: -1px 1px 3px rgba(18, 18, 18, 0.25);
        border-radius: 10px;
        transition: 0.2s;
    }
    .btn:hover {
      background: linear-gradient(83.71deg, #F56280 -15.41%, #F56280 3.43%, #F34C6D 31.27%, #F01F49 71.52%, #C0193A 108.42%);
      box-shadow: 0px 10px 20px rgba(242, 51, 89, 0.15), inset 0px 2px 2px rgba(255, 255, 255, 0.24), inset 4px -4px 10px #7D050F;
    }
</style>
