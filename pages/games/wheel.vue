<template>
  <game :title-image="'/games/wheel/title-image.png'">
    <template #wheelDataButtons>
      <wheel-data-buttons class="m-x-2 mt-2" />
    </template>
    <template #game>
      <div class="absolute inset-0" :class="backgroundImage" />

      <wheel
        :winning-number="winningNumber"
        :is-small="isSmall"
        :is-rotating="isPlaying"
        @rotate="(e) => rotate(e)"
        @rotated-color="(e) => setRotatedColor(e)"
      />
    </template>
    <template #info>
      <wheel-info />
    </template>
    <template #roundInfo>
      <round-info
        data-aos="fade-up"
        data-aos-once="true"
        :data-aos-delay="800"
        :ininal-message="`Spin the hue wheel and discover your lucky color!`"
        class="my-6"
        type="Spin"
        bets="multiBet"
      />
    </template>
  </game>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import game from '~/components/organisms/game.vue'
import wheel from '~/components/atoms/games/wheel/wheel.vue'
import wheelInfo from '~/components/atoms/games/wheel/wheel-info.vue'
import wheelDataButtons from '~/components/atoms/games/wheel/wheel-data-buttons.vue'
import { BreakPoint } from '~/model/break-points'
import { useMiniGames } from '~/composables/useMiniGames'
import roundInfo from '~/components/atoms/games/round-info.vue'
import wheelColors from '~/data/wheel-colors.json'

const { isPlaying, lastResults } = useMiniGames()
const breakpoints = useBreakpoints(BreakPoint)
const rotated = ref(0)

const winningNumber = ref(null)

const backgroundImage = 'bg-[url(\'/games/wheel/background.png\')] mix-blend-saturation'

const setWinningIndex = (winIndex) => {
  const index = [...wheelColors]
    .reverse()
    .findIndex(color => color.multiple === winIndex)
  return 16 - index
}

watch(
  () => lastResults.value,
  () => {
    setTimeout(() => {
      if (lastResults.value.length > 0) {
        let resultIndex = 0
        setInterval(() => {
          if (resultIndex < lastResults.value.length) {
            winningNumber.value = setWinningIndex(lastResults.value[resultIndex])
            if (resultIndex < lastResults.value.length - 1) {
              setTimeout(() => {
                winningNumber.value = null
              }, 4000)
            }
            resultIndex++
          }
        }, 9000)
      }
    }, 1000)
  }
)

watch(
  () => isPlaying.value,
  () => {
    if (isPlaying.value) {
      winningNumber.value = null
    }
  }
)

const isSmall = computed(() => {
  return breakpoints.smaller('md').value
})

const setRotatedColor = (el) => {
  rotated.value = el
}
</script>

<style lang="scss" scoped></style>
