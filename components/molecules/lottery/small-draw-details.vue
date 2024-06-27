<template>
  <div class="items-container">
    <div class="container">
      <div v-for="(item, index) of data" :key="index">
        <div class="detail default-text">
          {{ item.numbers }}
        </div>
        <div class="detail">
          <img src="/tokens/rdt.png">${{ item.rdt }} RDT
        </div>
        <div class="detail">
          <img src="/tokens/usdt.png">${{ item.total }}
        </div>
        <div class="detail">
          <img src="/tokens/rdt.png">{{ item.rdtEach }}
        </div>
        <div class="detail">
          <img src="/images/profile/user-info/user.png">{{ item.tickets }} Winners
        </div>
      </div>
    </div>
    <button class="details my-2 h-10 w-full flex justify-center items-center gap-2" @click="$emit('hide')">
      Hide <img src="/images/profile/user-info/purple-arrow.png">
    </button>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
    props: {
        data: {
            type: Array as PropType<Array<any>>,
            default: () => []
        }
    },
    emits: ['hide']
}
</script>

<style lang="scss" scoped>
.items-container {
    background: linear-gradient(0deg, rgba(31, 192, 240, 0.11), rgba(31, 192, 240, 0.11)), #1C1B1F;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    width: 100%;
}
.container {
    padding: 15px;
    gap: 10px;
    grid-template-columns: 48% 48%;
    grid-auto-rows: 33% 33% 33%;
    @apply grid justify-between;
}
.detail {
    border-bottom: 1px solid #23282E;
    @apply flex gap-2 items-center text-white h-10;
}
.details {
    color: #9E68FF;
}
</style>
