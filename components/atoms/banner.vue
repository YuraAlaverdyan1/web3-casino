<template>
  <div class="banner" :class="menu ? 'small' : 'big-banner'">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMenu } from '~/composables/useMenu'

const store = useMenu()

const menu = computed(() => {
  return store.menu.value
})

</script>

<style lang="scss" scoped>
    .banner {
        background: rgba(255, 255, 255, 0.02);
        box-shadow: -1px 1px 3px rgba(48, 6, 15, 0.5);
        border-radius: 4px;
        color: white;
        height: 60px;
        width: 80vw;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        margin: 50px 18% 0 4%;
    }
    .big-banner {
        margin: auto;
        width: 92%;
    }
</style>
