<template>
  <div class="mt-20">
    <div class="flex justify-between items-center">
      <div class="lottery-title">
        {{ title }}
      </div>
      <LotteryArrows :all="true" @next="active < partnership.length - 1 ? active++ : ''" @prev="active > 0 ? active-- : ''" />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="false"
      :has-drag="true"
      class="mt-6"
    >
      <o-carousel-item v-for="(item, index) of partnership" :key="index">
        <div class="image-container flex items-center justify-center" :style="`background-image: url(${item.image})`" :onmouseover="(e) => setHoverColor(e, item.pinkImage)" :onmouseleave="(e) => setHoverColor(e, item.image)" />
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import partnership from '~/data/partnership.json'
import { BreakPoint } from '~/model/break-points'

export default {
    props: {
      isSmall: {
        type: Boolean,
        required: false,
        default: false
      },
      home: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    setup(props) {
        const active = ref<number>(0)

        const setHoverColor = (e, image) => {
          e.target.style.backgroundImage = `url(${image})`
        }

        const title = computed(() => {
          return props.home ? 'Partners' : 'Partnership Lotteries'
        })

    const breakpoints = useBreakpoints(BreakPoint)
    const itemsToShow = computed(() => breakpoints.lg.value ? 5 : breakpoints.md.value ? 3 : 2)

        return {
            partnership,
            active,
            title,
            setHoverColor,
            breakpoints,
            itemsToShow
        }
    }
}
</script>

<style lang="scss" scoped>
  :deep(.o-car__items) {
    @screen sm {
      gap: 20px !important;
    }
    gap: 5px !important;
  }
  .image-container {
    width: 100%;
    height: 85px;
    background-repeat: no-repeat !important;
    background-position: center !important;
    transition: 0.2s;
    border-radius: 12px;
    background: #2C2634;
    &:hover {
      background: #38333F;
      img {
        filter: brightness(0) saturate(100%) invert(54%) sepia(86%) saturate(4392%) hue-rotate(234deg) brightness(103%) contrast(102%);
      }
    }
  }
</style>
