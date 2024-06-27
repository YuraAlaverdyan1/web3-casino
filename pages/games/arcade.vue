<template>
  <div class="w-full">
    <game :last-info="true" :with-padding="false" :title-image="'/games/arcade/title-image.png'">
      <template #game>
        <div
          class="lg:h-[590px] relative flex flex-col justify-center items-center p-[8px] md:p-[24px] gap-[24px] bg-[url('/games/arcade/arcade-bg.webp')] bg-contain overflow-hidden"
        >
          <div class="relative">
            <img src="/games/arcade/arcade.webp" class="max-w-[656px] w-full hidden ss:block">
            <img src="/games/arcade/arcade-mobile.webp" class="max-w-[656px] w-full ss:hidden">
            <div
              class="flex justify-between absolute w-[506px] bg-[#F0FF00] border-[2px] border-[#020006] max-h-[174px] h-full top-[50%] left-[50%] p-[8px] gap-[8px] overflow-hidden"
              :class="!menu ? 'wide-machine' : 'short-machine'"
            >
              <div class="absolute flex flex-col gap-[8px] transition-animation" :class="columnAnimation1">
                <img
                  v-for="(item, index) of randomValue1"
                  :key="index"
                  :src="gameImages[item]
                  "
                  class="w-[158px] border-[2px] border-[#020006]"
                  :class="[
                    backgroundColors[item],
                    isWinAnimation && 'win-animation',
                  ]"
                >
              </div>
              <div class="absolute left-[50%] flex flex-col gap-[8px] transition-animation" :class="columnAnimation2">
                <img
                  v-for="(item, index) of randomValue2"
                  :key="index"
                  :src="gameImages[item]
                  "
                  class="w-[158px] border-[2px] border-[#020006]"
                  :class="[
                    backgroundColors[item],
                    isWinAnimation && 'win-animation',
                  ]"
                >
              </div>
              <div class="absolute right-[8px] flex flex-col gap-[8px] transition-animation" :class="columnAnimation3">
                <img
                  v-for="(item, index) of randomValue3"
                  :key="index"
                  :src="gameImages[item]"
                  class="w-[158px] border-[2px] border-[#020006]"
                  :class="[
                    backgroundColors[item],
                    isWinAnimation && 'win-animation',
                  ]"
                >
              </div>
            </div>
          </div>
          <round-info
            v-if="!isSmall"
            data-aos="fade-up"
            data-aos-once="true"
            :data-aos-delay="1200"
            bets="multiBet"
            :ininal-message="`Hunt for the x100 Multiplier with every spin!`"
          />
        </div>
      </template>
      <template #info>
        <div
          class="border-[2px] border-[#9E68FF] rounded-[12px] bg-[#2C2634] py-[8px] px-[16px] h-full transition-all duration-500 overflow-hidden"
          :class="showTable ? 'max-h-[414px] min-h-[414px]' : 'max-h-[192px] min-h-[192px]'
          "
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
import { useBreakpoints } from '@vueuse/core'
import { useSound } from '../../composables/useSound'
import game from '~/components/organisms/game.vue'
import { useMenu } from '~/composables/useMenu'
import roundInfo from '~/components/atoms/games/round-info.vue'
import { useArcade } from '~/composables/games/useArcade'
import rollAudio from '~/public/sounds/arcade/arcade_roll.wav'
import winAudio from '~/public/sounds/arcade/arcade_win.wav'
import loseAudio from '~/public/sounds/arcade/arcade_lose.mp3'
import { BreakPoint } from '~/model/break-points'
import { useMiniGames } from '~/composables/useMiniGames'

export default {
  components: { game, roundInfo },
  setup() {
    const { isPlaying, lastResults, fastResult } = useMiniGames()
    const active = ref(false)
    const { menu } = useMenu()
    const showTable = ref(false)
    const isWinAnimation = ref(false)
    const { isDisabledSound } = useSound()
    const columnAnimation1 = ref('arcade-animation-start')
    const columnAnimation2 = ref('arcade-animation-center-start')
    const columnAnimation3 = ref('arcade-animation-start')
    const startTimeout = ref()
    const winningNumbers = ref([])

    const lastResTimeout = ref([])

    const breakpoints = useBreakpoints(BreakPoint)

    const isSmall = computed(() => breakpoints.smaller('md').value)

    const {
      gameImage1,
      gameImage2,
      gameImage3,
      gameImage4,
      gameImage5,
      gameImage6,
      winTable,
      gameElements,
      gameTime
    } = useArcade()

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

    const isOpenTable = computed(() => showTable.value ? 'Hide' : 'Show')

    const randomValue1 = ref(
      Array(gameElements.value)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1)
    )
    const randomValue2 = ref(
      Array(gameElements.value)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1)
    )
    const randomValue3 = ref(
      Array(gameElements.value)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1)
    )

    randomValue1.value[1] = randomValue1.value[randomValue1.value.length - 2]
    randomValue2.value[1] = randomValue2.value[randomValue2.value.length - 2]
    randomValue3.value[1] = randomValue3.value[randomValue3.value.length - 2]

    const resolveWin = (win) => {
      function randomNumbers() {
        const myArray = []
        for (let i = 0; i < 3; i++) {
          while (!myArray[i]) {
            const newRandomInt = Math.floor(Math.random() * 5) + 1
            if (!myArray.includes(newRandomInt)) {
              myArray.push(newRandomInt)
            }
          }
        }
        return myArray
      }
      if (win === 100) {
        return [1, 1, 1]
      } else if (win === 45) {
        return [2, 2, 2]
      } else if (win === 20) {
        const winArr = [3, 3, 3]
        winArr[Math.floor(Math.random() * 3)] = 1
        return winArr
      } else if (win === 12) {
        const winArr = [4, 4, 4]
        winArr[Math.floor(Math.random() * 3)] = 1
        return winArr
      } else if (win === 10) {
        const winArr = [5, 5, 5]
        winArr[Math.floor(Math.random() * 3)] = 1
        return winArr
      } else if (win === 5) {
        return [6, 6, 6]
      } else if (win === 3) {
        const winArr = [6, 6, 6]
        winArr[Math.floor(Math.random() * 3)] = Math.floor(Math.random() * 5) + 1
        return winArr
      } else if (win === 2) {
        const winArr = randomNumbers()
        winArr[Math.floor(Math.random() * 3)] = 6
        return winArr
      } else if (win === 0) {
        return randomNumbers()
      }
    }

    watch(() => lastResults.value, () => {
      if (lastResults.value.length > 0) {
        if (!isDisabledSound.value) {
          new Audio(rollAudio).play()
        }
        if (fastResult.value) {
          const mostWin = resolveWin(lastResults.value.sort().reverse()[0])
          randomValue1.value[randomValue1.value.length - 2] = mostWin[0]
          randomValue2.value[randomValue2.value.length - 2] = mostWin[1]
          randomValue3.value[randomValue3.value.length - 2] = mostWin[2]
          randomValue1.value[1] = mostWin[0]
          randomValue2.value[1] = mostWin[1]
          randomValue3.value[1] = mostWin[2]
          if (!isDisabledSound.value) {
            if (lastResults.value.sort().reverse()[0] > 0) {
              setTimeout(() => {
                new Audio(winAudio).play()
                isWinAnimation.value = true
                setTimeout(() => {
                  isWinAnimation.value = false
                }, 2000)
              }, 2800)
            } else {
              setTimeout(() => {
                new Audio(loseAudio).play()
              }, 2800)
            }
          }
        } else {
          // eslint-disable-next-line array-callback-return
          lastResults.value.map((e, i) => {
            if (i > 0) {
              lastResTimeout.value = [
                ...lastResTimeout.value, setTimeout(() => {
                  winningNumbers.value = [...winningNumbers.value, e]
                }, i * 4000)
              ]
            } else {
              const firstRoll = resolveWin(lastResults.value[0])
          randomValue1.value[randomValue1.value.length - 2] = firstRoll[0]
          randomValue2.value[randomValue2.value.length - 2] = firstRoll[1]
          randomValue3.value[randomValue3.value.length - 2] = firstRoll[2]
          randomValue1.value[1] = firstRoll[0]
          randomValue2.value[1] = firstRoll[1]
          randomValue3.value[1] = firstRoll[2]
            if (!isDisabledSound.value) {
              if (e > 0) {
                setTimeout(() => {
                  new Audio(winAudio).play()
                  isWinAnimation.value = true
                  setTimeout(() => {
                    isWinAnimation.value = false
                  }, 2000)
                }, 2800)
              } else {
                setTimeout(() => {
                  new Audio(loseAudio).play()
                }, 2800)
              }
            }
}
          })
        }
      }
    })
    watch(() => winningNumbers.value, () => {
      if (winningNumbers.value.length > 0 && winningNumbers.value.length !== lastResults.value.length) {
        const lastWin = resolveWin(winningNumbers.value[winningNumbers.value.length - 1])
        setTimeout(() => {
          randomValue1.value[randomValue1.value.length - 2] = lastWin[0]
          randomValue2.value[randomValue2.value.length - 2] = lastWin[1]
          randomValue3.value[randomValue3.value.length - 2] = lastWin[2]
          randomValue1.value[1] = lastWin[0]
          randomValue2.value[1] = lastWin[1]
          randomValue3.value[1] = lastWin[2]
        }, 2200)

        columnAnimation1.value = 'arcade-animation'
        columnAnimation2.value = 'arcade-animation-center delay-[200ms]'
        columnAnimation3.value = 'arcade-animation delay-[400ms]'
        startTimeout.value = setTimeout(() => {
          columnAnimation1.value = 'arcade-animation-end-first'
          columnAnimation2.value = 'arcade-animation-end-center'
          columnAnimation3.value = 'arcade-animation-end-last'
          if (!isDisabledSound.value) {
            if (winningNumbers.value[winningNumbers.value.length - 1] > 0) {
              setTimeout(() => {
                new Audio(winAudio).play()
                isWinAnimation.value = true
                setTimeout(() => {
                  isWinAnimation.value = false
                }, 2000)
              }, 1700)
            } else {
              setTimeout(() => {
                new Audio(loseAudio).play()
              }, 1700)
            }
          }
          setTimeout(() => {
            columnAnimation1.value = 'arcade-animation-start'
            columnAnimation2.value = 'arcade-animation-center-start'
            columnAnimation3.value = 'arcade-animation-start'
          }, 2400)
        }, 1500)
      }
    })

    watch(
      () => menu.value,
      () => {
        if (menu.value) {
          document.body.classList.add('menu')
        } else {
          document.body.classList.remove('menu')
        }
      }
    )

    watch(() => isPlaying.value, () => {
      winningNumbers.value = []
      if (isPlaying.value) {
        // eslint-disable-next-line array-callback-return
        lastResTimeout.value.map((_item, index) => {
          clearTimeout(lastResTimeout.value[index])
        })

        columnAnimation1.value = 'arcade-animation'
        columnAnimation2.value = 'arcade-animation-center delay-[200ms]'
        columnAnimation3.value = 'arcade-animation delay-[400ms]'
        startTimeout.value = setTimeout(() => {
          columnAnimation1.value = 'infinity-animation'
          columnAnimation2.value = 'infinity-animation-center'
          columnAnimation3.value = 'infinity-animation'
        }, 1500)
      } else {
        clearTimeout(startTimeout.value)
        startTimeout.value = setTimeout(() => {
          columnAnimation1.value = 'arcade-animation-end-first'
          columnAnimation2.value = 'arcade-animation-end-center'
          columnAnimation3.value = 'arcade-animation-end-last'
          setTimeout(() => {
            columnAnimation1.value = 'arcade-animation-start'
            columnAnimation2.value = 'arcade-animation-center-start'
            columnAnimation3.value = 'arcade-animation-start'
          }, 2500)
        }, 500)
      }
    })

    const arcadeAnimation = computed(() => {
      return `${gameTime.value - 700}ms`
    })

    const arcadePosition = computed(() => {
      return `-${gameElements.value * 158 + (gameElements.value - 1) * 8 - 322}px`
    })

    return {
      randomValue1,
      randomValue2,
      randomValue3,
      active,
      menu,
      showTable,
      isWinAnimation,
      winTable,
      arcadeAnimation,
      arcadePosition,
      gameImages,
      backgroundColors,
      isOpenTable,
      columnAnimation1,
      columnAnimation2,
      columnAnimation3,
      isSmall
    }
  }
}
</script>

<style lang="scss" scoped>
.win-animation {
  animation: blinking 2s linear;
  opacity: 1;
  animation-delay: 2ms;
}

@keyframes blinking {
  0% {
    opacity: 1;
  }

  5% {
    opacity: 0.7;
  }

  10% {
    opacity: 1;
  }

  15% {
    opacity: 0.7;
  }

  20% {
    opacity: 1;
  }

  25% {
    opacity: 0.7;
  }

  30% {
    opacity: 1;
  }

  35% {
    opacity: 0.7;
  }

  40% {
    opacity: 1;
  }

  45% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }

  55% {
    opacity: 0.7;
  }

  60% {
    opacity: 1;
  }

  65% {
    opacity: 0.7;
  }

  70% {
    opacity: 1;
  }

  75% {
    opacity: 0.7;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

.transition-animation {
  transition: all 2s;
  -webkit-transition: all 0ms
}

.infinity-animation {

  animation-delay: 2s;
  animation: infinity-scroll 1.5s infinite linear;

}
.infinity-animation-center {

  animation-delay: 1s;
  animation: infinity-scroll-center 1.5s infinite linear;

}

@keyframes infinity-scroll {
  from {
    transform: translateY(v-bind("arcadePosition"));
  }

  to {
    transform: translateY(-168px);
  }
}

@keyframes infinity-scroll-center {
  from {
    transform: translateY(v-bind("arcadePosition")) translateX(-50%);
  }

  to {
    transform: translateY(-168px) translateX(-50%);
  }
}

.arcade-animation {
  transition: all v-bind("arcadeAnimation") cubic-bezier(0.41, -0.01, 0.63, 1.09) 0s;
  transform: translateY(-168px);
}

.arcade-animation-start {
  transform: translateY(v-bind("arcadePosition"));
}

.arcade-animation-end-first {
  transform: translateY(v-bind("arcadePosition"));
  animation: end-scroll 2s linear forwards;
}

.arcade-animation-end-last {
  transform: translateY(v-bind("arcadePosition"));
  animation: end-scroll 2400ms linear forwards;

}

@keyframes end-scroll {
  0% {
    transform: translateY(v-bind("arcadePosition"));
  }

  75% {
    transform: translateY(-368px);
  }

  80% {
    transform: translateY(-268px);
  }

  90% {
    transform: translateY(-168px);
  }

  95% {
    transform: translateY(-128px);
  }

  100% {
    transform: translateY(-168px);
  }
}

.arcade-animation-center {
  transition: all v-bind("arcadeAnimation") cubic-bezier(0.41, -0.01, 0.63, 1.09) 0s;
  transform: translateY(-168px) translateX(-50%);
}

.arcade-animation-center-start {
  transform: translateY(v-bind("arcadePosition")) translateX(-50%);
}

.arcade-animation-end-center {
  transform: translateY(v-bind("arcadePosition")) translateX(-50%);
  animation: end-scroll-center 2200ms linear forwards;
}

@keyframes end-scroll-center {
  0% {
    transform: translateY(v-bind("arcadePosition"))translateX(-50%);
  }

  75% {

    transform: translateY(-368px) translateX(-50%);
  }

  80% {
    transform: translateY(-268px) translateX(-50%);
  }

  90% {
    transform: translateY(-168px) translateX(-50%);
  }

  95% {
    transform: translateY(-128px) translateX(-50%);
  }

  100% {
    transform: translateY(-168px) translateX(-50%);
  }
}

.wide-machine {
  transform: scale(1) translate(-50%, -45%);
  transform-origin: left;
}

.short-machine {
  transform: scale(1) translate(-50%, -45%);
  transform-origin: left;
}

@media (max-width: 1350px) {
  .wide-machine {
    transform: scale(0.92) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.76) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 1270px) {
  .wide-machine {
    transform: scale(0.85) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.7) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 1215px) {
  .wide-machine {
    transform: scale(1) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(1) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 730px) {
  .wide-machine {
    transform: scale(0.98) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.98) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 700px) {
  .wide-machine {
    transform: scale(0.89) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.89) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 650px) {
  .wide-machine {
    transform: scale(0.81) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.81) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 600px) {
  .wide-machine {
    transform: scale(0.72) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.72) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 539px) {
  .wide-machine {
    transform: scale(0.76) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.76) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 500px) {
  .wide-machine {
    transform: scale(0.67) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.67) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 450px) {
  .wide-machine {
    transform: scale(0.59) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.59) translate(-50%, -45%);
    transform-origin: left top;
  }
}

@media (max-width: 400px) {
  .wide-machine {
    transform: scale(0.55) translate(-50%, -45%);
    transform-origin: left top;
  }

  .short-machine {
    transform: scale(0.55) translate(-50%, -45%);
    transform-origin: left top;
  }
}
</style>
