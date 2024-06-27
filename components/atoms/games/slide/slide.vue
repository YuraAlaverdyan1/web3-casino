<template>
  <div class="slide">
    <h2 :style="`color:${status.color}; ${statusShadow}`">
      {{ status.value }}
    </h2>
    <img
      :src="`/games/slide/sliderCenteredIcon${isJackpot ? 'Jackpot' : ''}.png`"
      alt="slide_values"
      class="slide_centeredImage"
    >
    <div ref="cardsContainer" class="slide_cards" :style="`animation-duration: ${timer}s`" :class="addCorrectClassForAnimation()">
      <div v-for="(item, index) in hand" :key="index" class="slide_cards_item">
        <div
          class="slide_cards_item_value"
          :style="`background:${values[index].bgColor}; color: ${values[index].color}; ${checkIsJackpot(values[index].bgColor, index)}`"
        >
          <p>{{ values[index].value }}X</p>
        </div>
        <div class="slide_cards_item_card">
          <card :key="index" class="card" :card="hand[index]" :opened="true" />
        </div>
      </div>
    </div>
    <div class="slide_cards" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import card from '~/components/atoms/games/slide/slide-card.vue'
import { useSlide } from '~/composables/games/useSlide'
import { useMiniGames } from '~/composables/useMiniGames'
import { BreakPoint } from '~/model/break-points'

const { hand, generateRandomValues } = useSlide()
const { isRolling } = useMiniGames()
const breakpoints = useBreakpoints(BreakPoint)

const initialStatus = { value: 'slider', color: '#faab4b' }
const numOfCardsInEachScreen:number = 5
const rollCount:number = 4
const cardsContainer = ref<HTMLDivElement | null>(null)
const isJackpot = ref<boolean>(false)
const isAnimating = ref<boolean>(false)
const statusShadow = ref<string>('')
const timer = ref<number>(2)
const status = ref(initialStatus)
const values = ref(generateRandomValues(15))
const isSmall = computed(() => breakpoints.smaller('ss').value)
const choosedCard = computed(() => ({
  card: hand.value[rollCount * numOfCardsInEachScreen + 1],
  value: values.value[rollCount * numOfCardsInEachScreen + 1].value
}))

const addCorrectClassForAnimation = ():string => {
  if (isAnimating.value) {
    if (isSmall.value) {
      return 'animateMobile'
    } else {
      return 'animate'
    }
  }
  return ''
}

const checkIsJackpot = (color:string, index:number) => {
  if (isJackpot.value && !isAnimating.value && index === rollCount * numOfCardsInEachScreen + 1) {
    statusShadow.value = 'text-shadow: 0px 0px 32.94px white'
    return `box-shadow:0px 0px 11.385px 0px white, 0px 0px 22.77px 0px ${color}, 0px 0px 79.695px 0px ${color}, 0px 0px 159.39px 0px ${color}, 0px 0px 273.24px 0px ${color}, 0px 0px 478.17px 0px ${color}`
  }
}

watch(
  () => hand.value,
  () => {
    values.value = generateRandomValues(25)
    isAnimating.value = true
    isJackpot.value = false
    statusShadow.value = ''
    timer.value = 1 + Math.random() * 1.5
    status.value = {
      value: 'rolling',
      color: '#F5F5F7'
    }
    isRolling.value = true
    setTimeout(() => {
      isAnimating.value = false
      isRolling.value = false
      cardsContainer.value!.style.transform = isSmall.value ? 'translateX(-683.5%)' : 'translateX(-389.5%)'
      isJackpot.value = choosedCard.value.value > 100
      status.value = isJackpot.value
        ? {
          value: 'jackpot!',
          color: '#FF4652'
        }
        : initialStatus
    }, timer.value * 1000)
  }
)

onMounted(() => {
  if (isSmall.value) {
    hand.value.shift()
  }
})

</script>

<style lang="scss" scoped>
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 25px;
  overflow: hidden;
  h2 {
    font-variant-numeric: lining-nums proportional-nums;
    font-family: Faster;
    font-size: 64px;
    margin-bottom: 80px;
  }

  &_centeredImage {
    position: absolute;
    top: 100px;
    z-index: 5;
  }

  &_cards {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2.5%;
    &_item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 0 0 18%;
      &_card{
        width: 100%;
        aspect-ratio: 3 / 4;
      }

      p {
        text-align: center;
        font-variant-numeric: lining-nums proportional-nums;
        font-family: Exo 2;
        font-size: 16px;
        font-weight: 700;
      }
      &_value {
        padding: 5px 16px;
        border-radius: 6px;
      }

      @media only screen and (max-width: 540px){
        flex: 0 0 calc((100% - 5%) / 3);
      }
    }
  }
   .animate {
      animation: rollAnimation ease-in-out;
    }

    @keyframes rollAnimation {
      from {
        transform: translateX(0);
        filter: blur(2px);
      }
      to {
        transform: translateX(-389.5%);
        filter: blur(0);
      }
    }

    .animateMobile {
      animation: rollAnimationMobile ease-in-out;
    }

    @keyframes rollAnimationMobile {
      from {
        transform: translateX(0);
        filter: blur(2px);
      }
      to {
        transform: translateX(-683.5%);
        filter: blur(0);
      }
    }
}
</style>
