<template>
  <div class="w-full">
    <game :last-info="true" :with-padding="false">
      <template #game>
        <div
          class="lg:h-[590px] relative flex flex-col justify-center items-center p-[8px] md:p-[24px] gap-[24px] bg-[url('/games/pirates/pirates-bg.webp')] bg-contain overflow-hidden rounded-[10px]"
        >
          <div class="relative">
            <img src="/games/pirates/pirates-game.webp" class="max-w-[656px] w-full">
            <div
              class="flex justify-between absolute w-[506px] max-h-[174px] h-full top-[50%] left-[50%] p-[10px] gap-[8px] overflow-hidden"
              :class="!menu ? 'wide-machine' : 'short-machine'"
            >
              <div class="absolute flex flex-col gap-[8px]" :class="active ? 'arcade-animation' : `arcade-animation-end`">
                <div v-for="(item, index) of randomValue1" :key="index" class="relative">
                  <div
                    class="w-[95%] h-[96%] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] -z-[20]"
                    :class="[backgroundColors[item],
                             isWinAnimation && 'win-animation'
                    ]"
                  />
                  <div
                    class="absolute top-0 left-0 w-full h-full bg-[url('/games/pirates/frame.webp')] bg-[length:113%_115%] bg-center z-[20]"
                  />
                  <img :src="gameImages[item]" class="w-[158px] relative z-[30] scale-[0.95]">
                </div>
              </div>
              <div
                class="absolute left-[50%] flex flex-col gap-[8px]"
                :class="active ? 'arcade-animation-center  delay-[200ms]' : 'arcade-animation-center-end'"
              >
                <div v-for="(item, index) of randomValue2" :key="index" class="relative">
                  <div
                    class="w-[95%] h-[96%] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] -z-[20]"
                    :class="[backgroundColors[item],
                             isWinAnimation && 'win-animation'
                    ]"
                  />
                  <div
                    class="absolute top-0 left-0 w-full h-full bg-[url('/games/pirates/frame.webp')] bg-[length:113%_115%] bg-center z-[20]"
                  />
                  <img :src="gameImages[item]" class="w-[158px] relative z-[30] scale-[0.95]">
                </div>
              </div>
              <div
                class="absolute right-[8px] flex flex-col gap-[8px]"
                :class="active ? 'arcade-animation delay-[400ms]' : 'arcade-animation-end'"
              >
                <div v-for="(item, index) of randomValue3" :key="index" class="relative">
                  <div
                    class="w-[95%] h-[96%] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] -z-[20]"
                    :class="[backgroundColors[item],
                             isWinAnimation && 'win-animation'
                    ]"
                  />
                  <div
                    class="absolute top-0 left-0 w-full h-full bg-[url('/games/pirates/frame.webp')] bg-[length:113%_115%] bg-center z-[20]"
                  />
                  <img :src="gameImages[item]" class="w-[158px] relative z-[30] scale-[0.95]">
                </div>
              </div>
            </div>
          </div>
          <round-info class="mt-6 hidden md:flex" bets="multiBet" />
        </div>
      </template>
      <template #info>
        <div
          class="border-[2px] border-[#9E68FF] rounded-[12px] bg-[#2C2634] py-[8px] px-[16px] h-full transition-all duration-500 overflow-hidden"
          :class="showTable ? 'max-h-[414px] min-h-[414px]' : 'max-h-[192px] min-h-[192px]'"
        >
          <div
            class="flex items-center justify-center cursor-pointer scale-100 hover:scale-[1.02]"
            @click="showTable = !showTable"
          >
            <p class="text-[12px] font-[700] text-[#FFDC7E]">
              {{ isOpenTable }} Table
            </p>
            <img
              src="/games/arcade/yellow-arrow.svg"
              class="transition-all duration-500"
              :class="!showTable ? 'rotate-0' : '-rotate-[180deg]'"
            >
          </div>
          <div class="flex justify-between mt-[10px]">
            <p class="text-[12px] font-[700]">
              Outcome
            </p>
            <p class="text-[12px] font-[700]">
              Multiplier
            </p>
          </div>
          <div class="flex flex-col gap-[8px] mt-[4px]">
            <div v-for="(item, index) of winTable" :key="index" class="flex justify-between items-center">
              <div class="flex gap-[16px] items-center">
                <img v-for="(image, i) of item.winImages" :key="i" :src="image" class="w-[36px]">
                <p v-if="item.additionaImage" class="text-[12px] font-[700]">
                  Or
                </p>
                <img v-if="item.additionaImage" :src="item.additionaImage" class="w-[36px]">
              </div>
              <p class="text-[#B9FF6E] text-[16px] font-[700]">
                {{ item.winText }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </game>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import game from '~/components/organisms/game.vue'
import { useMenu } from '~/composables/useMenu'
import roundInfo from '~/components/atoms/games/round-info.vue'

import { usePirates } from '~/composables/games/usePirates'
import { useMiniGames } from '~/composables/useMiniGames'
export default {
  components: { game, roundInfo },
  setup() {
    const { isPlaying } = useMiniGames()
    const active = ref(false)
    const afterAnimation = ref(false)
    const isFirstTime = ref(true)
    const { menu } = useMenu()
    const showTable = ref(false)
    const isWinAnimation = ref(false)

    const {
      gameImage1,
      gameImage2,
      gameImage3,
      gameImage4,
      gameImage5,
      gameImage6,
      winTable,
      winningNumbers,
      gameElements,
      gameTime
    } = usePirates()

    const gameImages = ref({
      1: gameImage1,
      2: gameImage2,
      3: gameImage3,
      4: gameImage4,
      5: gameImage5,
      6: gameImage6
    })

    const backgroundColors = ref({
      1: 'bg-[#fe3642]',
      2: 'bg-[#ff2fa6]',
      3: 'bg-[#ffb902]',
      4: 'bg-[#0098f0]',
      5: 'bg-[#ff5fe5]',
      6: 'bg-[#3e51f9]'
    })

    const randomValue1 = ref(Array(gameElements).fill(0).map(() => Math.floor(Math.random() * 6) + 1))
    const randomValue2 = ref(Array(gameElements).fill(0).map(() => Math.floor(Math.random() * 6) + 1))
    const randomValue3 = ref(Array(gameElements).fill(0).map(() => Math.floor(Math.random() * 6) + 1))

    const isOpenTable = computed(() => showTable.value ? 'Hide' : 'Show')

    watch(() => menu.value, () => {
      if (menu.value) {
        document.body.classList.add('menu')
      } else {
        document.body.classList.remove('menu')
      }
    })

    watch(() => isPlaying.value, (newValue) => {
      if (newValue) {
        afterAnimation.value = false
        randomValue1.value = randomValue1.value.map((val, index) => {
          if (index === 1) {
            return winningNumbers[0]
          }
          if (index === randomValue1.value.length - 2) {
            if (isFirstTime.value) {
              return val
            }
            return randomValue1.value[1]
          }
          if (index === randomValue1.value.length - 1) {
            return randomValue1.value[0]
          }

          return Math.floor(Math.random() * 6) + 1
        })

        randomValue2.value = randomValue2.value.map((val, index) => {
          if (index === 1) {
            return winningNumbers[1]
          }
          if (index === randomValue2.value.length - 2) {
            if (isFirstTime.value) {
              return val
            }
            return randomValue2.value[1]
          }
          if (index === randomValue2.value.length - 1) {
            return randomValue2.value[0]
          }

          return Math.floor(Math.random() * 6) + 1
        })
        randomValue3.value = randomValue3.value.map((val, index) => {
          if (index === 1) {
            return winningNumbers[2]
          }
          if (index === randomValue3.value.length - 2) {
            if (isFirstTime.value) {
              return val
            }
            return randomValue3.value[1]
          }
          if (index === randomValue3.value.length - 1) {
            return randomValue3.value[0]
          }

          return Math.floor(Math.random() * 6) + 1
        })

        if (randomValue1.value[1] === 5 || randomValue2.value[1] === 5 || randomValue3.value[1] === 5) {
          isWinAnimation.value = true
        }

        if ((randomValue1.value[1] === 5 && randomValue2.value[1] === 5) ||
          (randomValue1.value[1] === 5 && randomValue3.value[1] === 5) ||
          (randomValue2.value[1] === 5 && randomValue3.value[1] === 5)) {
          isWinAnimation.value = true
        }

        if (randomValue1.value[1] === 5 &&
          randomValue2.value[1] === 5 &&
          randomValue3.value[1] === 5) {
          isWinAnimation.value = true
        }

        if (
          (randomValue1.value[1] === 6 &&
            randomValue2.value[1] === 6 &&
            randomValue3.value[1] === 6) ||
          (((randomValue1.value[1] === 6 && randomValue2.value[1] === 6) ||
            (randomValue1.value[1] === 6 && randomValue3.value[1] === 6) ||
            (randomValue2.value[1] === 6 && randomValue3.value[1] === 6)) &&
            (randomValue1.value[1] === 1 ||
              randomValue2.value[1] === 1 ||
              randomValue3.value[1] === 1))) {
          isWinAnimation.value = true
        }

        if (
          (randomValue1.value[1] === 4 &&
            randomValue2.value[1] === 4 &&
            randomValue3.value[1] === 4) ||
          (((randomValue1.value[1] === 4 && randomValue2.value[1] === 4) ||
            (randomValue1.value[1] === 4 && randomValue3.value[1] === 4) ||
            (randomValue2.value[1] === 4 && randomValue3.value[1] === 4)) &&
            (randomValue1.value[1] === 1 ||
              randomValue2.value[1] === 1 ||
              randomValue3.value[1] === 1))) {
          isWinAnimation.value = true
        }

        if (
          (randomValue1.value[1] === 3 &&
            randomValue2.value[1] === 3 &&
            randomValue3.value[1] === 3) ||
          (((randomValue1.value[1] === 3 && randomValue2.value[1] === 3) ||
            (randomValue1.value[1] === 3 && randomValue3.value[1] === 3) ||
            (randomValue2.value[1] === 3 && randomValue3.value[1] === 3)) &&
            (randomValue1.value[1] === 1 ||
              randomValue2.value[1] === 1 ||
              randomValue3.value[1] === 1))) {
          isWinAnimation.value = true
        }

        if (randomValue1.value[1] === 2 &&
          randomValue2.value[1] === 2 &&
          randomValue3.value[1] === 2) {
          isWinAnimation.value = true
        }

        if (randomValue1.value[1] === 1 &&
          randomValue2.value[1] === 1 &&
          randomValue3.value[1] === 1) {
          isWinAnimation.value = true
        }

        active.value = true

        if (isWinAnimation.value) {
          setTimeout(() => {
            randomValue1.value[randomValue1.value.length - 1] = randomValue1.value[1]
            randomValue2.value[randomValue2.value.length - 1] = randomValue2.value[1]
            randomValue3.value[randomValue3.value.length - 1] = randomValue3.value[1]
            randomValue1.value[randomValue1.value.length - 2] = randomValue1.value[1]
            randomValue2.value[randomValue2.value.length - 2] = randomValue2.value[1]
            randomValue3.value[randomValue3.value.length - 2] = randomValue3.value[1]
            isPlaying.value = false
            active.value = false
            isFirstTime.value = false
            afterAnimation.value = true
            isWinAnimation.value = false
          }, gameTime + 2000)
        } else {
          setTimeout(() => {
            randomValue1.value[randomValue1.value.length - 1] = randomValue1.value[1]
            randomValue2.value[randomValue2.value.length - 1] = randomValue2.value[1]
            randomValue3.value[randomValue3.value.length - 1] = randomValue3.value[1]
            randomValue1.value[randomValue1.value.length - 2] = randomValue1.value[1]
            randomValue2.value[randomValue2.value.length - 2] = randomValue2.value[1]
            randomValue3.value[randomValue3.value.length - 2] = randomValue3.value[1]
            isPlaying.value = false
            active.value = false
            isFirstTime.value = false
            afterAnimation.value = true
          }, gameTime)
        }
      }
    })
    const blickAnimationDelay = `${gameTime}ms`
    const arcadeAnimation = `${gameTime - 700}ms`
    const arcadePosition = `-${(gameElements * 158 + (gameElements - 1) * 8) - 322}px`
    return {
      randomValue1,
      randomValue2,
      randomValue3,
      active,
      menu,
      showTable,
      isWinAnimation,
      gameImage1,
      gameImage2,
      gameImage3,
      gameImage4,
      gameImage5,
      gameImage6,
      winTable,
      arcadeAnimation,
      blickAnimationDelay,
      gameElements,
      arcadePosition,
      gameImages,
      backgroundColors,
      isOpenTable
    }
  }
}
</script>

<style lang="scss" scoped>
.win-animation {
  animation: blinking 2s linear;
  opacity: 1;
  animation-delay: v-bind('blickAnimationDelay');
}

@keyframes blinking {
  0% {
    opacity: 1;
  }

  5% {
    opacity: .7;
  }

  10% {
    opacity: 1;
  }

  15% {
    opacity: .7;
  }

  20% {
    opacity: 1;
  }

  25% {
    opacity: .7;
  }

  30% {
    opacity: 1;
  }

  35% {
    opacity: .7;
  }

  40% {
    opacity: 1;
  }

  45% {
    opacity: .7;
  }

  50% {
    opacity: 1;
  }

  55% {
    opacity: .7;
  }

  60% {
    opacity: 1;
  }

  65% {
    opacity: .7;
  }

  70% {
    opacity: 1;
  }

  75% {
    opacity: .7;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

.arcade-animation {
  transition: all v-bind('arcadeAnimation') cubic-bezier(0.41, -0.01, 0.63, 1.09) 0s;
  transform: translateY(-168px);
}

.arcade-animation-end {

  transform: translateY(v-bind('arcadePosition'));
}

.arcade-animation-center {
  transition: all v-bind('arcadeAnimation') cubic-bezier(0.41, -0.01, 0.63, 1.09) 0s;
  transform: translateY(-168px) translateX(-50%);
}

.arcade-animation-center-end {
  transform: translateY(v-bind('arcadePosition')) translateX(-50%);
}

.wide-machine {
  transform: scaleX(1.22) scaleY(1.285) translate(-50%, -27.5%);
  transform-origin: left;

}

.short-machine {
  transform: scaleX(1.22) scaleY(1.285) translate(-50%, -27.5%);
  transform-origin: left;
}

@media(max-width: 1530px) {
  .short-machine {
    transform: scaleX(1.02) scaleY(1.07) translate(-50%, -38%);
    transform-origin: left top;
  }
}

@media(max-width: 1350px) {
  .wide-machine {
    transform: scale(1.1) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.9) translate(-50%, -38%);
    transform-origin: left top;
  }
}

@media(max-width: 1270px) {
  .wide-machine {
    transform: scale(1.05) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.86) translate(-50%, -38%);
    transform-origin: left top;
  }
}

@media(max-width: 1215px) {
  .wide-machine {
    transform: scaleX(1.22) scaleY(1.282) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(1) translate(-50%, -45%);
    transform-origin: left top;
  }

}

@media(max-width: 730px) {
  .wide-machine {
    transform: scale(1.1) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.98) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 700px) {
  .wide-machine {
    transform: scale(1) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.89) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 650px) {
  .wide-machine {
    transform: scale(.95) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.81) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 600px) {
  .wide-machine {
    transform: scale(.85) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.72) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 539px) {
  .wide-machine {
    transform: scale(.76) translate(-50%, -38%);
    transform-origin: left top;

  }

  .short-machine {
    transform: scale(.76) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 500px) {
  .wide-machine {
    transform: scale(.67) translate(-50%, -38%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.67) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 450px) {
  .wide-machine {
    transform: scale(.59) translate(-50%, -40%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.59) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media(max-width: 400px) {
  .wide-machine {
    transform: scale(.55) translate(-50%, -40%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(.55) translate(-50%, -45%);
    transform-origin: left top;
  }
}
</style>
