<template>
  <div class="flex gap-2">
    <template v-if="!isSmall">
      <div
        v-for="(item, index) of hands"
        :key="index"
        :style="`background: url(${getSrc(index, item.name)})`"
        class="hand"
        @click="SelectHand(index)"
        @mouseover="(e) => mouseOver(e.target, index, item.name)"
        @mouseleave="(e) => mouseLeave(e.target, index, item.name)"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import hands from '~/data/hands.json'
import { setDisable } from '~/utils/helpers'
import { useChiFouMi } from '~/composables/games/useChiFouMi'
import { useMiniGames } from '~/composables/useMiniGames'
import { BreakPoint } from '~/model/break-points'

const breakpoints = useBreakpoints(BreakPoint)
// eslint-disable-next-line no-undef
const { $gsap: gsap } = useNuxtApp()

const { isPlaying } = useMiniGames()

const { hand, selectHand } = useChiFouMi()

const getSrc = (index, Hand) => {
  return hand.value === index
    ? `/games/chi-fou-mi/info/${Hand}-selected.png`
    : `/games/chi-fou-mi/info/${Hand}.png`
}

const mouseOver = (el, index, Hand) => {
  if (index !== hand.value) {
    el.style.background = `url(/games/chi-fou-mi/info/${Hand}-hover.png)`
  }
}

const mouseLeave = (el, index, Hand) => {
  if (index !== hand.value) {
    el.style.background = `url(/games/chi-fou-mi/info/${Hand}.png)`
  }
}

const isSmall = computed(() => {
  return breakpoints.smaller('lg').value
})

const SelectHand = (e) => {
  if (!isPlaying.value) {
    setDisable(gsap)
    selectHand(e)
  }
}
</script>

<style lang="scss" scoped>
.hand {
  transition: 0.3s;
  background-repeat: no-repeat !important;
  background-size: 97% 100% !important;
  aspect-ratio: 1 / 1;
  @apply w-full cursor-pointer;
}
</style>
