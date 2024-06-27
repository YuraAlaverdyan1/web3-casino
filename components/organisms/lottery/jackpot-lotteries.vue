<template>
  <div class="mt-24" style="overflow: hidden">
    <div class="flex justify-between">
      <div class="title text-white text-2xl font-medium">
        Jackpot Lotteries
      </div>
      <div v-if="isSmall" class="flex gap-4">
        <LotteryArrows
          :all="false"
          @next="active < jackpotLotteries.length - 1 ? active++ : ''"
          @prev="active > 0 ? active-- : ''"
        />
      </div>
    </div>
    <div class="flex items-center justify-between mt-2">
      <div
        class="flex gap-2 sm:justify-start justify-center sm:flex-nowrap flex-wrap"
      >
        <SelectBtn
          v-for="(btn, index) of dropdowns"
          :key="index"
          :text="btn.title"
          :items="btn.items"
        />
      </div>
      <div v-if="!isSmall" class="flex gap-4">
        <LotteryArrows
          :all="true"
          @next="active < jackpotLotteries.length - 1 ? active++ : ''"
          @prev="active > 0 ? active-- : ''"
        />
      </div>
    </div>
    <div class="flex justify-between flex-wrap gap-6 mt-6">
      <o-carousel
        v-model="active"
        :arrow="false"
        :indicator="false"
        :items-to-show="12"
        :repeat="true"
        :has-drag="true"
        class="mt-6"
      >
        <o-carousel-item
          v-for="(lotterie, index) of jackpotLotteries"
          :key="index"
        >
          <JackpotLotterie
            :title="lotterie.title"
            :image="lotterie.image"
            :jackpot="lotterie.jackpot"
            :end-in="lotterie.endIn"
            :tickets="lotterie.tickets"
            :token="lotterie.token"
          />
        </o-carousel-item>
      </o-carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import dropdowns from '~/data/dropdowns.json'
import jackpotLotteries from '~/data/jackpot-lotteries.json'

export default {
  props: {
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const active = ref(0)

    return {
      dropdowns,
      jackpotLotteries,
      active
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-car) {
  @screen sm {
    width: 76vw;
  }
  width: 88vw;
}
:deep(.o-car__items) {
  display: grid;
  justify-content: space-between;
  grid-template-columns: 200px 200px 200px 200px 200px 200px;
  grid-auto-rows: 200px 200px;
  overflow-x: scroll;
  gap: 10px;
  height: 410px;
}

@media (max-width: 1216px) {
  :deep(.o-car__items) {
    grid-template-columns: 140px 140px 140px 140px 140px 140px;
    grid-auto-rows: 140px 140px;
    height: 300px;
  }
}
</style>
