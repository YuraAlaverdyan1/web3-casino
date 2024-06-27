<template>
  <div>
    <div class="flex justify-between mt-20 mb-6">
      <div class="lottery-title">
        Decentralized Fun, Fair Promotions
      </div>
      <LotteryArrows />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="4"
      :repeat="false"
      :has-drag="true"
    >
      <o-carousel-item v-for="(item, index) of promotions" :key="index">
        <PromotionsItem
          :amount="item.amount"
          :image="item.image"
          :title="item.title"
          :token="item.token"
          :color="item.color"
        />
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import promotions from '~/data/promotions.json'

export default {
  setup() {
    const active = ref(0)
    return {
      promotions,
      active
    }
  }
}
</script>

<style lang="scss" scoped></style>
