<template>
  <div class="mt-20">
    <div class="flex items-center justify-between mb-4">
      <div class="lottery-title">
        {{ title }}
      </div>
      <LotteryArrows @prev="active > 0 ? active-- : ''" @next="active < games.length - 1 ? active++ : ''" />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="false"
      :has-drag="true"
    >
      <o-carousel-item v-for="(game, index) of games" :key="index">
        <ProfileBuildGame :details="game.details" :editable="game.editable" :image="game.image" :title="game.name" :link-text="game.linkText" />
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
    props: {
        title: {
            type: String,
            required: false,
            default: ''
        },
        itemsToShow: {
            type: Number,
            required: false,
            default: 0
        },
        games: {
            type: Array as PropType<Array<any>>,
            required: true,
            default: () => []
        }
    },
    setup() {
        const active = ref(0)
        return {
            active
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
