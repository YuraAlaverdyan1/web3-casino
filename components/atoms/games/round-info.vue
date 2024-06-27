<template>
  <div
    class="flex w-full bg-[#201A29] py-[12px] rounded-[12px] overflow-hidden relative justify-center min-h-[48px]"
  >
    <div
      class="flex items-center gap-[8px] select-none transition-all opacity-100 duration-200 sm:duration-500 absolute top-[50%] -translate-y-[50%] z-[20]"
      :class="[
        currentWin === 1
          ? 'opacity-70'
          : 'scale-100 hover:scale-[1.05]  active:scale-100 cursor-pointer',
      ]"
      :style="`left: ${
        totalWinnings.length > 0 &&
        gameStatus == '' &&
        winningNumbers.length === 0 &&
        lastResults.length === 0
          ? '0px'
          : '-100px'
      }`"
      @click="currentWin === 1 ? 1 : currentWin--"
    >
      <img src="/svgs/arrow-left-back.svg">
      <p class="text-[12px] font-[700]">
        Previous
      </p>
    </div>
    <div
      v-if="gameStatus === ''"
      class="flex items-center gap-[8px] mr-[10px] transition-all duration-500 absolute left-[50%] -translate-x-[50%] -translate-y-[50%]"
      :style="`top: ${
        winningNumbers.length > 0 || lastResults.length > 0 ? '50%' : '-150%'
      }`"
    >
      <p class="text-[12px] font-[700]">
        {{ gameResultMultipler }}
      </p>
      <p
        class="text-[16px] font-[700] transition-all w-[40px] whitespace-nowrap"
        :class="[
          showResult ? 'opacity-100' : 'opacity-0',
          winningNumbers[winningNumbers.length - 1] > 0
            ? 'text-[#B9FF6E]'
            : 'text-[#FFDC7E]',
        ]"
      >
        {{ gameResultText }}
      </p>
    </div>

    <div
      v-if="gameStatus === ''"
      class="flex items-center gap-[8px] mr-[10px] transition-all duration-500 absolute left-[50%] -translate-x-[50%] -translate-y-[50%] w-full justify-center"
      :style="`top: ${
        totalWinnings.length > 0 &&
        winningNumbers.length === 0 &&
        lastResults.length === 0
          ? '50%'
          : '150%'
      }`"
    >
      <p class="text-[12px] font-[700]" e2e-id="play-results">
        {{ type }} {{ currentWin }}/{{ totalWinnings.length }}
      </p>
      <p
        class="hidden sm:block text-[13px] font-[700]"
        :class="totalWinnings[currentWin - 1] > 0 ? 'text-[#B9FF6E]' : 'text-[#fff]'"
      >
        {{
          typeof totalWinnings[currentWin - 1] === "number"
            ? `WIN ${totalWinnings[currentWin - 1].toFixed(2)}`
            : totalWinnings[currentWin - 1]
        }}
      </p>
      <p
        class="sm:hidden text-[14px] font-[700]"
        :class="totalWinnings[currentWin - 1] > 0 ? 'text-[#B9FF6E]' : 'text-[#fff]'"
      >
        {{
          typeof totalWinnings[currentWin - 1] === "number"
            ? `WIN ${totalWinnings[currentWin - 1].toFixed(2)}`
            : "Unlucky, try again!"
        }}
      </p>
    </div>
    <div
      v-if="
        totalWinnings.length === 0 ||
          (gameStatus !== '' && winningNumbers.length === 0 && lastResults.length === 0)
      "
      class="flex justify-center gap-[10px] items-center"
    >
      <div v-if="gameStatus !== ''" class="relative">
        <div
          class="small-circle"
          :style="{
            '--circleColor': `${roundColors.circleColor && roundColors.circleColor}`,
            '--smallShadow': `${roundColors.smallShadow && roundColors.smallShadow}`,
            '--bigShadow': `${roundColors.bigShadow && roundColors.bigShadow}`,
            '--withoutShadow': `${
              roundColors.withoutShadow && roundColors.withoutShadow
            }`,
          }"
        />
      </div>
      <p class="text-[14px] lg:text-[16px] font-[700]">
        {{ roundText }}
      </p>
    </div>
    <div
      :style="`right: ${
        totalWinnings.length > 0 &&
        gameStatus == '' &&
        winningNumbers.length === 0 &&
        lastResults.length === 0
          ? '0px'
          : '-100px'
      }`"
      class="flex items-center gap-[8px] select-none transition-all opacity-100 duration-200 sm:duration-500 absolute top-[50%] -translate-y-[50%] z-[20]"
      :class="
        currentWin < totalWinnings.length
          ? 'scale-100 hover:scale-[1.05] active:scale-100 cursor-pointer'
          : 'opacity-70'
      "
      @click="currentWin < totalWinnings.length ? currentWin++ : totalWinnings.length"
    >
      <p class="text-[12px] font-[700]">
        Next
      </p>
      <img src="/svgs/arrow-left-back.svg" class="rotate-[180deg]">
    </div>
  </div>
</template>

<script>
import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoints } from '@vueuse/core'
import { useGameStatus } from '../../../composables/useGameStatus'
import { useAuth } from '../../../store/useAuth'
import { MiniGames, useMiniGames } from '~/composables/useMiniGames'
import { useVideoPoker } from '~/composables/games/useVideoPoker'
import { useCoinflip } from '~/composables/games/useCoinflip'
import lostGameTemplates from '~/data/lost-game-templates.json'

import { BreakPoint } from '~/model/break-points'
export default {
  props: {
    ininalMessage: {
      type: String,
      required: false,
      default: 'Play the game and let fortune decide your fate!'
    },
    type: {
      type: String,
      required: false,
      default: 'Roll'
    }
  },

  setup(props) {
    const {
      totalWinnings,
      lastResults,
      isPlaying,
      currentGame,
      fastResult,
      valueBet
    } = useMiniGames()
    const { gameStatus } = useGameStatus()
    const { side } = useCoinflip()
    const { combination, multiplier } = useVideoPoker()
    const currentWin = ref(1)
    const { userDetails } = useAuth()
    const roundText = ref(props.ininalMessage)
    const winningNumbers = ref([])
    const roundColors = ref({})
    const showResult = ref(false)
    const lastResTimeout = ref([])
    const route = useRoute()
    const gameResultMultipler = computed(() => {
      if (currentGame.value === MiniGames.VideoPoker) {
        return multiplier.value
      }
      return `${props.type} ${winningNumbers.value.length}/${lastResults.value.length}`
    })

    const gameResultText = computed(() => {
      if (currentGame.value === MiniGames.VideoPoker) {
        return combination.value
      }
      return winningNumbers.value[winningNumbers.value.length - 1] > 0 ? 'WIN' : 'LOST'
    })

    const breakpoints = useBreakpoints(BreakPoint)

    const isSmall = computed(() => breakpoints.smaller('sm').value)

    watch(
      () => route,
      () => {
        totalWinnings.value = []
      },
      { deep: true, immediate: true }
    )

    watch(
      () => lastResults.value,
      () => {
        if (!fastResult.value) {
          if (lastResults.value.length > 0 && currentGame.value === 'coinflip') {
            setTimeout(() => {
              // eslint-disable-next-line array-callback-return
              lastResults.value.map((item, index) => {
                lastResTimeout.value = [
                  ...lastResTimeout.value,
                  setTimeout(() => {
                    if (isPlaying.value) {
                      clearTimeout(lastResTimeout.value)
                    }
                    winningNumbers.value = [...winningNumbers.value, item]
                  }, index * 2000)
                ]
              })
            }, 700)
          } else if (lastResults.value.length > 0 && currentGame.value === 'arcade') {
            // eslint-disable-next-line array-callback-return
            lastResults.value.map((e, i) => {
              if (i === 0) {
                lastResTimeout.value = [
                  ...lastResTimeout.value,
                  setTimeout(() => {
                    winningNumbers.value = [...winningNumbers.value, e]
                  }, 2000)
                ]
              } else {
                lastResTimeout.value = [
                  ...lastResTimeout.value,
                  setTimeout(() => {
                    winningNumbers.value = [...winningNumbers.value, e]
                  }, (i + 1) * 3950)
                ]
              }
            })
          } else if (lastResults.value.length > 0 && currentGame.value === 'chi-fou-mi') {
            // eslint-disable-next-line array-callback-return
            lastResults.value.map((e, i) => {
              if (i === 0) {
                lastResTimeout.value = [
                  ...lastResTimeout.value,
                  setTimeout(() => {
                    winningNumbers.value = [...winningNumbers.value, e]
                  }, 2000)
                ]
              } else {
                lastResTimeout.value = [
                  ...lastResTimeout.value,
                  setTimeout(() => {
                    winningNumbers.value = [...winningNumbers.value, e]
                  }, (i + 1) * 3150)
                ]
              }
            })
          } else if (currentGame.value === 'wheel') {
            setTimeout(() => {
              if (lastResults.value.length > 0) {
                // eslint-disable-next-line array-callback-return
                lastResults.value.map((item, index) => {
                  lastResTimeout.value = [
                    ...lastResTimeout.value,
                    setTimeout(() => {
                      if (isPlaying.value) {
                        clearTimeout(lastResTimeout.value)
                      }
                      if (index === lastResults.value.length - 1) {
                        isPlaying.value = false
                      }
                      winningNumbers.value = [...winningNumbers.value, item]
                    }, index * 9000 + 11000)
                  ]
                })
              }
            }, 1000)
          } else if (
            lastResults.value.length > 0 &&
            (currentGame.value === 'video-poker' || currentGame.value === 'mine')
          ) {
            setTimeout(() => {
              lastResTimeout.value = [
                ...lastResTimeout.value,
                setTimeout(() => {
                  if (isPlaying.value) {
                    clearTimeout(lastResTimeout.value)
                  }
                  winningNumbers.value = [...winningNumbers.value, lastResults.value[0]]
                }, 2000)
              ]
            }, 700)
          }
        }
      }
    )

    watch(
      () => [side.value, valueBet.value],
      () => {
        winningNumbers.value = []
        lastResults.value = []
        // eslint-disable-next-line array-callback-return
        lastResTimeout.value.map((_item, index) => {
          clearTimeout(lastResTimeout.value[index])
        })
      }
    )

    watch(
      () => winningNumbers.value,
      () => {
        if (winningNumbers.value.length === 0) {
          showResult.value = false
          // eslint-disable-next-line array-callback-return
          lastResTimeout.value.map((_item, index) => {
            clearTimeout(lastResTimeout.value[index])
          })
        } else {
          if (winningNumbers.value.length > 0) {
            setTimeout(() => {
              showResult.value = true
            }, 200)
            if (winningNumbers.value.length === lastResults.value.length) {
              setTimeout(() => {
                showResult.value = false
              }, 1500)
            } else {
              setTimeout(() => {
                showResult.value = false
              }, 1300)
            }
          }
          if (winningNumbers.value.length === lastResults.value.length) {
            setTimeout(() => {
              winningNumbers.value = []
              lastResults.value = []
            }, 2000)
          }
        }
      }
    )
    watch(
      () => isPlaying.value,
      () => {
        if (isPlaying.value) {
          winningNumbers.value = []
          lastResults.value = []
        }
      }
    )

    watch(
      () => totalWinnings.value,
      (newValue, oldValue) => {
        console.log(
          totalWinnings.value.length,
          ' totalWinnings.value.length-----verjnakan'
        )
        currentWin.value = totalWinnings.value.length
        if (!newValue.map((el, i) => el === oldValue[i]).find(el => el === true)) {
          totalWinnings.value = totalWinnings.value.map((el) => {
            if (el === 0) {
              if (isSmall.value) {
                return lostGameTemplates.messagesMobile[Math.floor(Math.random() * 8)]
                  .message
              } else {
                return lostGameTemplates.messages[
                  Math.floor(Math.random() * 10)
                ].message.replace('[username]', userDetails.value.userName)
              }
            } else {
              return el
            }
          })
        }
      }
    )

    const resolveStatusColor = (status) => {
      if (status === 'yellow') {
        roundColors.value = {
          circleColor: 'rgba(255, 220, 126, 1)',
          smallShadow: '0 0 0 3px rgba(255, 220, 126, .1)',
          bigShadow: '0 0 0 6px rgba(255, 220, 126, .1)',
          withoutShadow: '0 0 0 0 rgba(255, 220, 126, 0)'
        }
      } else if (status === 'green') {
        roundColors.value = {
          circleColor: 'rgba(185, 255, 110, 1)',
          smallShadow: '0 0 0 3px rgba(185, 255, 110, .1)',
          bigShadow: '0 0 0 6px rgba(185, 255, 110, .1)',
          withoutShadow: '0 0 0 0 rgba(185, 255, 110, 0)'
        }
      } else if (status === 'red') {
        roundColors.value = {
          circleColor: 'rgba(255, 102, 0, 1)',
          smallShadow: '0 0 0 3px rgba(255, 102, 0, .1)',
          bigShadow: '0 0 0 6px rgba(255, 102, 0, .1)',
          withoutShadow: '0 0 0 0 rgba(255, 102, 0, 0)'
        }
      }
    }

    watch(
      () => gameStatus.value,
      () => {
        if (gameStatus.value === '' && !isPlaying.value) {
          roundText.value = props.ininalMessage
          roundColors.value = {}
        } else {
          roundText.value = gameStatus.value.text
          resolveStatusColor(gameStatus.value.color)
        }
      }
    )

    return {
      totalWinnings,
      currentWin,
      roundText,
      roundColors,
      gameStatus,
      winningNumbers,
      lastResults,
      showResult,
      gameResultText,
      gameResultMultipler
    }
  }
}
</script>
<style scoped>
.small-circle {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--circleColor);
  cursor: pointer;
  position: relative;
  z-index: 5;
  animation: pulse 2s infinite;
}

.small-circle::before {
  content: "";
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  animation: pulse-2 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: var(--withoutShadow);
  }

  60% {
    box-shadow: var(--smallShadow);
  }

  90% {
    box-shadow: var(--smallShadow);
  }

  100% {
    box-shadow: var(--withoutShadow);
  }
}

@keyframes pulse-2 {
  0% {
    box-shadow: var(--withoutShadow);
  }

  70% {
    box-shadow: var(--bigShadow);
  }

  80% {
    box-shadow: var(--bigShadow);
  }

  100% {
    box-shadow: var(--withoutShadow);
  }
}
</style>
