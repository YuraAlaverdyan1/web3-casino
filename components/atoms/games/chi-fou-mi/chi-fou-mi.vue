<template>
  <div class="chi-fou-mi-container">
    <div class="chi-fou-mi-details">
      <div v-if="isSmall" class="hand-name">
        {{ mobileHandName }}
      </div>
      <div class="frame-container">
        <img
          v-if="isSmall && !isPlaying"
          src="/games/chi-fou-mi/arrow-left.png"
          class="arrow arrow-left"
          @click="left"
        >
        <img
          v-if="isSmall && !isPlaying"
          src="/games/chi-fou-mi/arrow-right.png"
          class="arrow arrow-right"
          @click="right"
        >
        <img src="/games/chi-fou-mi/banner-white.png" class="banner">
        <img src="/games/chi-fou-mi/frame.png" class="frame">
      </div>
      <div class="flex items-center justify-center">
        <div
          v-if="(typeof hand !== 'number' && !isSmall) || hand === -1"
          class="container"
        >
          <img class="container_background" src="/games/chi-fou-mi/background.png">
          <img class="container_text" src="/games/chi-fou-mi/chifoumiText.png">
          <div>
            <img src="/games/chi-fou-mi/rock.png">
            <img src="/games/chi-fou-mi/paper.png">
            <img src="/games/chi-fou-mi/scissors.png">
          </div>
        </div>
        <div class="animation-container">
          <selected-hand-component :hand="handName" class="selected-hand" />
          <div class="number" />
          <div
            :style="`background: url(/games/chi-fou-mi/rock.png)`"
            class="animation-second-hand"
          />
          <div class="chi-fou-mi-animation">
            <img src="/games/chi-fou-mi/chi.png" class="chi">
            <img src="/games/chi-fou-mi/fou.png" class="fou">
            <img src="/games/chi-fou-mi/mi.png" class="mi">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import selectedHandComponent from '~/components/atoms/games/chi-fou-mi/selected-hand.vue'
import hands from '~/data/hands.json'
import { useChiFouMi } from '~/composables/games/useChiFouMi'
import { BreakPoint } from '~/model/break-points'
import { setDisable } from '~/utils/helpers'
import { useMiniGames } from '~/composables/useMiniGames'

const { isPlaying } = useMiniGames()

const breakpoints = useBreakpoints(BreakPoint)
// eslint-disable-next-line no-undef
const { $gsap: gsap } = useNuxtApp()
const { first, selectHand, hand } = useChiFouMi()

const mobileHandName = computed(() => {
  return hand.value ? hands[hand.value]?.name : hands[0].name
})

const isSmall = computed(() => {
  return breakpoints.smaller('lg').value
})

const left = () => {
  if (hand.value > 0) {
    selectHand(hand.value - 1)
  } else {
    selectHand(2)
  }
  setDisable(gsap)
}

const right = () => {
  if (hand.value < 2) {
    selectHand(hand.value + 1)
  } else {
    selectHand(0)
  }
  setDisable(gsap)
}

const handName = computed(() => {
  switch (hand.value) {
    case 0:
      return 'rock'
    case 1:
      return 'paper'
    case 2:
      return 'scissors'
    default:
      return 'rock'
  }
})

onMounted(() => {
  if (!isSmall.value) {
    hand.value = -1
  }
})

defineExpose({
  first,
  isPlaying
})
</script>

<style lang="scss" scoped>
.chi-fou-mi-container {
  @screen sm {
    height: 700px;
  }
  height: 320px;
  background: url(/games/chi-fou-mi/bg.png);
  background-repeat: no-repeat !important;
  background-size: cover !important;
  @apply relative overflow-hidden;
}

.start-banner {
  transition: 0.5s;
  @apply h-full z-10;
}

.frame-container {
  .frame {
    width: 90%;
    height: 90%;
  }
  @apply flex items-center justify-center h-full pb-8;
}

.chi-fou-mi-details,
.start-banner,
.number,
.animation-second-hand,
.chi-fou-mi-animation,
.animation-container {
  @apply absolute top-0 left-0 right-0 bottom-0 m-auto;
}

.frame,
.start-banner {
  width: 100%;
}

.container {
  height: 100%;
  width: 100%;
  &_background {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
    z-index: 11;
  }
  &_text {
    position: absolute;
    top: 8%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    width: 600px;
    height: 80px;
  }
  div {
    display: flex;
    position: absolute;
    width: 100%;
    justify-content: center;
    gap: 10px;
    top: 35%;
    left: 0;
    right: 0;
    transform: scale(1.7);
    margin: auto;
    z-index: 11;
  }
}

.chi-fou-mi-animation {
  left: 52%;
  img {
    width: 70%;
  }
  @apply flex flex-col justify-center gap-6;
}

.not-started-banner,
.started-animation {
  opacity: 1;
}
.started-banner,
.animation-second-hand,
.not-started-animation,
.chi,
.fou,
.mi,
.number {
  opacity: 0;
}

.number {
  left: 20%;
}

.animation-second-hand,
.number {
  background-repeat: no-repeat !important;
  background-position: center !important;
  @apply w-full h-full;
}

.animation-second-hand {
  background-size: 17% !important;
}

.hand-name {
  background: #2c2634;
  font-family: arance-soft-regular;
  font-size: 32px;
  @apply absolute bottom-0 left-0 right-0 m-auto w-full h-8 flex items-center justify-center;
}

.arrow {
  z-index: 11;
  @apply absolute top-0 bottom-10 m-auto cursor-pointer;
}

@media (max-width: 1216px) {
  .chi-fou-mi-container {
    background: none;
  }
  .arrow-left {
    left: 150px;
  }
  .arrow-right {
    right: 100px;
  }
}

@media (max-width: 768px) {
  .banner {
    display: none;
  }
  .arrow {
    display: block;
  }
  .frame {
    width: 100% !important;
    height: 100% !important;
  }
  .animation-second-hand {
    background-size: 25% 50% !important;
  }
  .arrow-left {
    left: 50px;
  }
  .arrow-right {
    right: 50px;
  }
}
</style>
