<template>
  <div class="items">
    <GoToItem
      v-for="(item, index) of data"
      :key="index"
      :img="item.image"
      :name="item.name"
      :title="item.title"
      :subtitle="item.subtitle"
    />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import part3 from '~/data/part-3.json'
import { useMenu } from '~/composables/useMenu'
export default {
  setup() {
    const store = useMenu()

    const menu = computed(() => {
      return store.menu.value
    })

    return {
        menu,
        data: part3
    }
  }
}
</script>

<style lang="scss" scoped>
    .items {
        margin-top: 50px;
        @apply flex justify-between gap-6;
    }
</style>
