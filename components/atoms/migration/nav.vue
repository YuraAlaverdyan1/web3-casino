<template>
  <div class="nav flex">
    <button
      v-for="(item, index) of items"
      :key="index"
      class="btn relative"
      :class="[
        active === index ? 'active-item' : 'disabled-item',
      ]"
      @click="$emit('setActive', index)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
  props: {
    active: {
      type: Number,
      required: true,
      default: 0
    },
    items: {
      type: Array as PropType<Array<string>>,
      required: true,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  background: #2c2634;
  border-radius: 12px;
  overflow: hidden;
  height: 40px;
}

.btn {
    width: 100%;
    color: white;
    font-weight: 500;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 12px;
}

.active-item {
  color: #6600FF;
  background-color: #F5F5F7;
}

.disabled-item {
  background: #2c2634 !important;
}

.rounded-item--first {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.rounded-item--middle {
  border-radius: 12px;
}

.rounded-item--last {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
</style>
