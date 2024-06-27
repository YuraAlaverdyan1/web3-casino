<template>
  <div>
    <div class="flex justify-between mt-20">
      <div class="lottery-title">
        Community Lotteries
      </div>
      <LotteryArrows
        :all="true"
        @next="active < communityData.length / 6 - 1 ? active++ : ''"
        @prev="active > 0 ? active-- : ''"
      />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="6"
      :repeat="false"
      :has-drag="true"
      class="mt-6"
    >
      <o-carousel-item v-for="(item, index) of communityData" :key="index">
        <img :src="item.image">
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import communityData from '~/data/community-items.json'
export default {
  setup() {
    const active = ref(0)
    return {
      communityData,
      active
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-car__scene) {
  width: 66vw !important;
}
</style>
