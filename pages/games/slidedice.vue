<template>
  <game :title-image="'/games/slidedice/title-image.png'">
    <template #game>
      <div class="w-full h-full bg-[#171120]">
        <game-spot>
          <template #left>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14 8L10 12L14 16"
                stroke="#E6E6E6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            Previous
          </template>
          <template #right>
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M10 16L14 12L10 8"
                stroke="#E6E6E6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>
          <template #center>
            <div class="flex gap-2 items-center">
              <span class="text-xs"> Roll 1/3 </span>
              <span class="text-rd-green">
                {{ lastWon > 0 ? `WIN ${lastWon}` : `LOST ${lastWon}` }}
              </span>
            </div>
          </template>
          <div class="w-full flex flex-col gap-6">
            <div
              class="flex gap-1 items-center justify-between bg-gradient rounded-[12px] overflow-hidden md:px-[24px]"
            >
              <div
                class="flex items-start justify-start flex-col md:hidden box-slide-l"
              >
                <p class="text-center">
                  <span class="text-[40px] font-semibold">{{
                    inputValue
                  }}</span>
                </p>
                <p class="text-[14px] font-[400] mt-[5px]">
                  Prediction
                </p>
              </div>
              <div
                class="w-[140px] h-[140px] relative flex justify-center items-end ss:ml-[45px] md:ml-[0px] z-[20]"
                :class="
                  isPlaying
                    ? 'flame-animation-infinity'
                    : !playGame
                      ? 'flame-initial'
                      : 'flame-animation-infinity'
                "
              >
                <div
                  :style="{
                    '--randomImage': `url(/games/slidedice/cube-${randomValue}.svg)`,
                    '--lastImage': `url(/games/slidedice/cube-${lastValue}.svg)`
                  }"
                  class="w-[50px] h-[50px] absolute bottom-[20px]"
                  :class="
                    isPlaying
                      ? 'infinity-rotating'
                      : !playGame
                        ? 'cube-initial'
                        : 'infinity-rotating'
                  "
                />
              </div>
              <div class="hidden md:flex items-start justify-start flex-col">
                <p class="text-center w-[50px]">
                  <span class="text-[40px] font-semibold">{{
                    inputValue
                  }}</span>
                </p>
                <p class="text-[14px] font-[400] mt-[5px]">
                  Prediction
                </p>
              </div>
              <div class="flex items-start justify-start flex-col box-slide-r">
                <p class="text-center w-[100px]">
                  <span class="text-[40px] font-semibold">{{ Math.round(multiplierInput * 100) / 100 }}x</span>
                  <br>
                </p>
                <p class="text-[14px] mt-[5px]">
                  Multiplier
                </p>
              </div>
              <div class="hidden md:flex items-start flex-col">
                <p class="text-center w-[85px]">
                  <span class="text-[40px] font-semibold">{{ winChanceInput }}%</span>
                  <br>
                </p>
                <p class="text-[14px] whitespace-nowrap mt-[5px]">
                  Win Chance
                </p>
              </div>
            </div>
            <div class="range relative mt-[10px]">
              <div
                v-for="(item, index) of winningNumbers"
                :key="index"
                class="absolute w-[7px] h-[7px] rounded-full transition-all duration-[1s] dots-left"
                :class="[
                  !item.animation
                    ? ''
                    : 'top-[0px] translate-x-[0px] translate-y-[0px]'
                ]"
                :style="
                  item.animation
                    ? `left: ${item.value}% !important; background: ${
                      item.value >= inputValue
                        ? 'rgb(102, 0, 255)'
                        : 'rgb(255, 102, 0)'
                    } !important`
                    : ''
                "
              >
                <p
                  class="transition-all duration-[1s] absolute -left-[50%] -top-[30px] font-[700] text-[18px]"
                  :class="
                    item.textAnimation === null
                      ? '-translate-y-[0px] opacity-[0]'
                      : item.textAnimation
                        ? '-translate-y-[100px] opacity-0'
                        : '-translate-y-[0px] opacity-[100]'
                  "
                  :style="
                    item.animation
                      ? ` color: ${
                        item.value >= inputValue
                          ? 'rgb(102, 0, 255)'
                          : 'rgb(255, 102, 0)'
                      } !important`
                      : ''
                  "
                >
                  {{ item.value }}
                </p>
              </div>
              <input
                id="range3"
                v-model="inputValue"
                :class="playGame && 'disabled'"
                type="range"
                min="0"
                max="100"
                :disabled="isPlaying || playGame"
                :data-before="inputValue"
              >
              <span
                id="range3text"
                class="absolute top-2 w-[35px] flex justify-start"
              />
            </div>
            <div class="bg-[#201A29] rounded-[12px] md:p-[24px] w-full">
              <div
                class="bg-[#251F2D] rounded-[12px] px-[8px] py-[12px] md:p-[24px] w-full flex justify-between items-center gap-[4px] md:gap-[0px]"
              >
                <div class="w-full mx-auto flex flex-col items-center">
                  <p class="pl-[16px] text-[12px] font-[400] mr-auto">
                    Multiplier
                  </p>
                  <div
                    class="flex items-center border-[1px] border-[#424245] rounded-[12px] px-[16px] py-[12px] gap-[8px] max-w-[170px] mt-[4px] h-[50px]"
                  >
                    <p class="text-[14px] -mr-[3px]">
                      x
                    </p>

                    <input
                      v-model="multiplierInput"
                      class="bg-transparent outline-none w-full text-[14px]"
                      :disabled="isPlaying || playGame"
                      @focus="focusInput = true"
                      @blur="focusInput = false"
                    >
                    <p class="text-[14px] font-[700] pr-[14px]">
                      X
                    </p>
                  </div>
                </div>
                <div class="w-full mx-auto flex flex-col items-center">
                  <p class="pl-[16px] text-[12px] font-[400] mr-auto">
                    Roll {{ !isRevert ? 'Over' : 'Under' }}
                  </p>
                  <div
                    class="flex border-[1px] border-[#424245] rounded-[12px] pr-[6px] pl-[16px] py-[9px] gap-[8px] max-w-[170px] mt-[4px]"
                  >
                    <input
                      v-model="rollUnderInput"
                      class="bg-transparent outline-none w-full"
                      :disabled="isPlaying || playGame"
                      @focus="focusInput = true"
                      @blur="focusInput = false"
                    >
                    <img
                      src="/games/slidedice/change-icon.svg"
                      class="w-[50px] h-[30px]"
                      :class="isPlaying || playGame ? '' : 'cursor-pointer'"
                      :disabled="isPlaying || playGame"
                      @click="
                        isPlaying || playGame ? null : (isRevert = !isRevert)
                      "
                    >
                  </div>
                </div>
                <div class="w-full mx-auto flex flex-col items-center">
                  <p class="pl-[16px] text-[12px] font-[400] mr-auto">
                    Win Chance
                  </p>
                  <div
                    class="flex border-[1px] border-[#424245] rounded-[12px] px-[16px] py-[12px] gap-[8px] max-w-[170px] mt-[4px]"
                  >
                    <input
                      v-model="winChanceInput"
                      class="bg-transparent outline-none w-full"
                      :disabled="isPlaying || playGame"
                      @focus="focusInput = true"
                      @blur="focusInput = false"
                    >
                    <p class="text-[14px] font-[700] pr-[14px]">
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </game-spot>
      </div>
    </template>
    <template #roundInfo>
      <round-info
        class="mt-6"
        bets="multiBet"
        :ininal-message="`Roll the dice and let fortune decide your fate!`"
      />
    </template>
    <template #info>
      <div
        class="grid grid-cols-2 bg-[#201A29] rounded-md px-[12px] pb-[2px] pt-[4px] gap-[5px]"
      >
        <p class="font-light text-[14px] text-[#E6E6E6]">
          Payout
        </p>
        <p class="text-right text-[14px] text-[#F5F5F7] text-[700]">
          {{ payout }}
        </p>
        <p class="font-light text-[14px] text-[#E6E6E6]">
          Chance to win
        </p>
        <p class="text-right text-[#F5F5F7] text-[700]">
          {{ winChanceInput }}
        </p>
        <p class="font-light text-[14px] text-[#E6E6E6]">
          Roll {{ !isRevert ? 'Over' : 'Under' }}
        </p>
        <p class="text-right text-[#F5F5F7] text-[700]">
          {{ rollUnderInput }}
        </p>
      </div>
    </template>
  </game>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import game from '~/components/organisms/game.vue'
import { useMiniGames } from '~/composables/useMiniGames'
import roundInfo from '~/components/atoms/games/round-info.vue'
import { useSound } from '~/composables/useSound'
import endGameAudio from '~/public/sounds/slidedice/dice_roll.wav'
import winGameAudio from '~/public/sounds/slidedice/dice_win.wav'
import loseGameAudio from '~/public/sounds/slidedice/dice_lose.wav'
export default {
  components: {
    game,
    roundInfo
  },
  setup() {
    const {
      lastResults,
      multiplierInput,
      rollUnderInput,
      winChanceInput,
      isRevert,
      isPlaying,
      valueMultipleBet,
      valueBet,
      currentGame,
      fastResult
    } = useMiniGames()
    const animation = ref(false)
    const inputValue = ref(50)
    const changeCount = ref(true)
    const focusInput = ref(false)
    const playGame = ref(false)
    const payout = ref(0)
    const { increaseSound, decreaseSound, switchSound, isDisabledSound } =
      useSound()
    const randomValue = ref(Math.floor(Math.random() * 6) + 1)
    const lastValue = ref(Math.floor(Math.random() * 6) + 1)
    const winningNumbers = ref([])
    const endGameSound = new Audio(endGameAudio)

    const currentWin = ref(0)
    const setCount = () => {
      if (changeCount.value) {
        changeCount.value = false
        animation.value = true
      }
    }

    watch(
      () => isPlaying.value,
      () => {
        if (isPlaying.value) {
          playGame.value = false
          winningNumbers.value = []
        }
      }
    )
    function getRandomInt(min, max) {
      return (Math.random() * (max - min + 1) + min).toFixed(2)
    }
    watch(
      () => [valueMultipleBet.value, multiplierInput.value, valueBet.value],
      () => {
        payout.value = (
          valueMultipleBet.value *
          multiplierInput.value *
          valueBet.value
        ).toFixed(2)
      }
    )
    watch(
      () => [isPlaying.value, multiplierInput.value],
      () => {
        if (isPlaying.value) {
          currentWin.value = multiplierInput.value
        }
      }
    )

    const lastWon = computed(() => {
      if (
        currentGame.value === 'slidedice' &&
        lastResults.value[lastResults.value.length - 1] > 0 &&
        lastResults.value[lastResults.value.length - 1]
      ) {
        return currentWin.value
      }
      return lastResults.value[lastResults.value.length - 1]
    })

    watch(
      () => lastResults.value,
      () => {
        playGame.value = true
        if (!isDisabledSound.value && lastResults.value.length > 0) {
          endGameSound.play()
        }
        if (!fastResult.value) {
          // eslint-disable-next-line array-callback-return
          lastResults.value.map((item, index) => {
            setTimeout(() => {
              winningNumbers.value = [
                ...winningNumbers.value,
                {
                  value:
                    item > 0
                      ? getRandomInt(inputValue.value, 98)
                      : getRandomInt(0, inputValue.value - 1),
                  animation: false,
                  textAnimation: null
                }
              ]
              setTimeout(() => {
                if (winningNumbers.value[index].value > inputValue.value) {
                  if (!isDisabledSound.value) {
                    new Audio(winGameAudio).play()
                  }
                } else if (!isDisabledSound.value) {
                  new Audio(loseGameAudio).play()
                }
                winningNumbers.value[index].animation = true
              }, 200)
              setTimeout(() => {
                winningNumbers.value[index].textAnimation = false
              }, 900)
              setTimeout(() => {
                winningNumbers.value[index].textAnimation = true
              }, 1400)
            }, index * 500)
          })
          setTimeout(() => {
            playGame.value = false
          }, lastResults.value.length * 500)
        } else {
          // eslint-disable-next-line array-callback-return
          lastResults.value.map((item, index) => {
            winningNumbers.value = [
              ...winningNumbers.value,
              {
                value:
                  item > 0
                    ? getRandomInt(inputValue.value, 98)
                    : getRandomInt(0, inputValue.value - 1),
                animation: false,
                textAnimation: null
              }
            ]
            setTimeout(() => {
              winningNumbers.value[index].animation = true
            }, 200)
          })
          setTimeout(() => {
            playGame.value = false
          }, 500)
        }
      }
    )

    watch(
      () => [inputValue.value, isRevert.value],
      (newValue, oldValue) => {
        winningNumbers.value = []
        playGame.value = false
        if (!newValue[1]) {
          winChanceInput.value = Math.round((100 - newValue[0]) * 10) / 10
          if (newValue[0] < 5) {
            inputValue.value = 5
          }
          if (newValue[0] > 99) {
            inputValue.value = 99
          }
          if (
            newValue[0] < 99 &&
            newValue[0] > 5 &&
            newValue[0] > oldValue[0]
          ) {
            increaseSound()
          } else if (
            newValue[0] < 99 &&
            newValue[0] > 5 &&
            newValue[0] < oldValue[0]
          ) {
            decreaseSound()
          }
        } else {
          winChanceInput.value = Math.round(newValue[0] * 10) / 10
          if (newValue[0] < 1) {
            inputValue.value = 1
          }
          if (newValue[0] > 95) {
            inputValue.value = 95
          }
          if (
            newValue[0] < 95 &&
            newValue[0] > 1 &&
            newValue[0] > oldValue[0]
          ) {
            increaseSound()
          } else if (
            newValue[0] < 95 &&
            newValue[0] > 1 &&
            newValue[0] < oldValue[0]
          ) {
            decreaseSound()
          }
          winChanceInput.value = Math.round(newValue[0] * 10) / 10
        }
        rollUnderInput.value = newValue[0]
        multiplierInput.value =
          Math.round((99 / winChanceInput.value) * 10000) / 10000
      }
    )

    watch(
      () => isRevert.value,
      (newValue) => {
        switchSound()
        inputValue.value = 100 - inputValue.value
        if (newValue) {
          winChanceInput.value = 100 - inputValue.value
        } else {
          winChanceInput.value = inputValue.value
        }
      }
    )
    watch(
      () => [multiplierInput.value, isRevert.value, focusInput.value],
      (newValue) => {
        if (!isRevert.value && !focusInput.value) {
          inputValue.value = 100 - Math.round((99 / newValue[0]) * 10) / 10
        } else if (!focusInput.value) {
          inputValue.value = Math.round((99 / newValue[0]) * 10) / 10
        }
      }
    )

    watch(
      () => [rollUnderInput.value, isRevert.value, focusInput.value],
      (newValue) => {
        if (!isRevert.value) {
          if (newValue[0] < 5 && !focusInput.value) {
            rollUnderInput.value = 5
            inputValue.value = 5
          } else if (newValue[0] > 99 && !focusInput.value) {
            inputValue.value = 99
            rollUnderInput.value = 99
          } else if (!focusInput.value) {
            inputValue.value = newValue[0]
          }
        } else if (newValue[0] < 1 && !focusInput.value) {
          inputValue.value = 1
          rollUnderInput.value = 1
        } else if (newValue[0] > 95 && !focusInput.value) {
          rollUnderInput.value = 95
          inputValue.value = 95
        } else if (!focusInput.value) {
          inputValue.value = newValue[0]
        }
      }
    )

    watch(
      () => [winChanceInput.value, isRevert.value, focusInput.value],
      (newValue) => {
        if (newValue[1] && !focusInput.value) {
          inputValue.value = newValue[0]
        } else if (!focusInput.value) {
          inputValue.value = 100 - newValue[0]
        }
      }
    )

    watch(
      () => [playGame.value, isPlaying.value],
      () => {
        let randomInterval
        if (playGame.value || isPlaying.value) {
          lastValue.value = Math.floor(Math.random() * 6) + 1
          setCount()
          setTimeout(() => {
            changeCount.value = true
            animation.value = false
          }, 2000)
          randomInterval = setInterval(() => {
            randomValue.value = Math.floor(Math.random() * 6) + 1
          }, 500)
        } else {
          return clearInterval(randomInterval)
        }
      }
    )

    function load(v, revert) {
      const sliderEl3 = document.querySelector('#range3')
      const sliderEl3text = document.querySelector('#range3text')

      const tempSliderValue = Number(v)

      const progress = (tempSliderValue / sliderEl3.max) * 100

      sliderEl3text.style.left = `calc(${progress}% - 0px)`

      sliderEl3.style.background = revert
        ? `linear-gradient(to right, #F60 ${progress}%,  #60F ${progress}%)`
        : `linear-gradient(to right, #60F ${progress}% , #F60 ${progress}% )`
    }

    onMounted(() => {
      payout.value = (
        valueMultipleBet.value *
        multiplierInput.value *
        valueBet.value
      ).toFixed(2)
      load(inputValue.value, isRevert.value)
    })

    watch(
      () => [inputValue.value, isRevert.value],
      () => {
        load(inputValue.value, isRevert.value)
      }
    )

    return {
      inputValue,
      animation,
      setCount,
      isRevert,
      focusInput,
      isPlaying,
      randomValue,
      multiplierInput,
      rollUnderInput,
      winChanceInput,
      playGame,
      lastValue,
      winningNumbers,
      lastWon,
      payout
    }
  }
}
</script>
<style lang="scss" scoped>
.box-slide-l {
  border-radius: 12px;
  background: linear-gradient(270deg, rgba(37, 31, 45, 0) 0%, #251f2d 100%);
  height: 148px;

  @media (max-width: 420px) {
    padding: 24px 5px 24px 5px;
  }

  padding: 24px 12px 24px 24px;

  @screen md {
    background: none;
  }
}

.box-slide-r {
  border-radius: 12px;
  background: linear-gradient(270deg, #251f2d 0%, rgba(37, 31, 45, 0) 100%);
  height: 148px;

  @media (max-width: 420px) {
    padding: 24px 5px 24px 0px;
  }

  padding: 24px 17px 24px 0px;

  @screen sm {
    padding: 24px 24px 24px 24px;
  }

  @screen md {
    background: none;
    height: auto;
  }
}

.dots-text {
  transform: translate(0px, 0px);
  opacity: 100;
}

.dots-left {
  top: 0px;
  left: 50%;
  transform: translate(-50%, -85px);
  background: #fff;

  @screen md {
    left: 0px;
    transform: translate(85px, -95px);
  }
}

.dots-right {
  top: 0px;
  right: 50%;
  transform: translate(-50%, -85px);
}

.custom-dot {
  width: 100%;
  height: 100%;
  border-radius: 0;
  background-color: pink;
  transition: all 0.3s;
}

.custom-dot:hover {
  transform: rotateZ(45deg);
}

.custom-dot.focus {
  border-radius: 50%;
}

/* range 2 */
.range-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 15px;
  height: 8px;
  background: #ccc;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 35px;
  width: 35px;
  background-color: #f50;
  border-radius: 50%;
  border: none;
  transition: 0.2s ease-in-out;
}

.range-input::-moz-range-thumb {
  height: 35px;
  width: 35px;
  background-color: #f50;
  border-radius: 50%;
  border: none;
  transition: 0.2s ease-in-out;
}

.range-input::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 10px rgba(28, 27, 31, 0.1);
}

.range-input:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

.range-input:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

.range-input::-moz-range-thumb:hover {
  box-shadow: 0 0 0 10px rgba(28, 27, 31, 0.1);
}

.range-input:active::-moz-range-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

.range-input:focus::-moz-range-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

.value2,
.value3,
.value4 {
  font-size: 26px;
  width: 50px;
  text-align: center;
}

/* range 3 */
#range3 {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 15px;
  height: 20px;
  height: 8px;
  background: #ccc;
}

#range3::-webkit-slider-thumb {
  opacity: 100;
  transition: all 0.3s;
  position: relative;
  z-index: 10;
  -webkit-appearance: none;
  appearance: none;
  height: 35px;
  width: 35px;
  background: #201A29;
  background-image: url('/tokens/rdt.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  transition: 0.2s ease-in-out;
  border-radius: 8px;
  border: 6px solid rgba(28, 27, 31, 0.4);
}

#range3.disabled::-webkit-slider-thumb {
  opacity: 0;
  transition: all 0.3s;
}

/* Thumb: Firefox */
#range3::-moz-range-thumb {
  height: 30px;
  width: 30px;
  background-image: url('/tokens/rdt.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border: none;
  border-radius: 50%;
  border: 6px solid rgba(28, 27, 31, 0.4);
  background: #201a29;
}

#range3::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 10px rgba(28, 27, 31, 0.1);
}

#range3:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

#range3:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

#range3::-moz-range-thumb:hover {
  box-shadow: 0 0 0 10px rgba(28, 27, 31, 0.1);
}

#range3:active::-moz-range-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

#range3:focus::-moz-range-thumb {
  box-shadow: 0 0 0 13px rgba(28, 27, 31, 0.2);
}

/* range 3 */
.range-slider {
  flex: 1;
}

.sliderticks {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.sliderticks span {
  display: flex;
  justify-content: center;
  width: 1px;
  height: 10px;
  background: #d3d3d3;
  line-height: 40px;
}

/*=============
Aesthetics
=========================*/

.range {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.flame-initial {
  background: url("../../public/games/slidedice/flame-1.svg");
}

.cube-initial {
  background: var(--lastImage);
  transform: rotate(0deg);
}

@keyframes infinity-rotate {
  from {
    transition: all 0.5s;
    transform: rotate(0deg);
  }

  to {
    transition: all 0.5s;
    transform: rotate(360deg);
  }
}

.infinity-rotating {
  animation: infinity-rotate 0.3s linear infinite;
  background: var(--randomImage);
}

.cube-animation {
  transition: all 1s;
  background: var(--randomImage);
  animation: cube-animation 10s linear;
  transition: all 0.1s;
}

.bg-gradient {
  background: none;

  @screen md {
    background: linear-gradient(270deg, rgba(37, 31, 45, 0) 0%, #251f2d 100%);
  }
}

@keyframes cube-animation {
  0% {
    transform: rotate(0deg);
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  1% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  2% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  3% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  4% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  5% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  6% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  7% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  8% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  9% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  10% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  11% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  12% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  13% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  14% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  15% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  16% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  17% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  18% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  19% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  20% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  21% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  22% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  23% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  24% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  25% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  26% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  27% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  28% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  29% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  30% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  31% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  32% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  33% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  34% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  35% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  36% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  37% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  38% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  39% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  40% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  41% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  42% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  43% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  44% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  45% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  46% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  47% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  48% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  49% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  50% {
    transform: rotate(5000deg);
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  51% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  52% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  53% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  54% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  55% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  56% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  57% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  58% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  59% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  60% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  61% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  62% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  63% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  64% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  65% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  66% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  67% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  68% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  69% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  70% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  71% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  72% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  73% {
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  74% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  75% {
    transform: rotate(7000deg);
    background: url("../../public/games/slidedice/cube-5.svg");
  }

  76% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  77% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  78% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  79% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  80% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  81% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  82% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  83% {
    background: url("../../public/games/slidedice/cube-4.svg");
  }

  84% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  85% {
    transform: rotate(7800deg);
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  86% {
    background: url("../../public/games/slidedice/cube-3.svg");
  }

  87% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  88% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  89% {
    background: url("../../public/games/slidedice/cube-2.svg");
  }

  90% {

    background: url("../../public/games/slidedice/cube-2.svg");
  }

  91% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  92% {
    transform: rotate(8095deg);
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  93% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  94% {
    background: url("../../public/games/slidedice/cube-6.svg");
  }

  95% {

    background: url("../../public/games/slidedice/cube-1.svg");
  }

  96% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  97% {
    background: url("../../public/games/slidedice/cube-1.svg");
  }

  98% {
    transform: rotate(8100deg);
    background: var(--randomImage);
  }

  99% {
    background: var(--randomImage);
  }

  100% {
    background: var(--randomImage);
    transform: rotate(8100deg);
  }
}

.flame-animation-infinity {
  background: url("../../public/games/slidedice/flame-1.svg");
  background-size: 100%;
  background-repeat: no-repeat;
  animation: flame-animation 5s linear infinite;
}

.flame-animation {
  background: url("../../public/games/slidedice/flame-1.svg");
  background-size: 100%;
  background-repeat: no-repeat;
  animation: flame-animation 5s 2 linear;
}

@keyframes flame-animation {
  0% {
    background: url("../../public/games/slidedice/flame-1.svg");
  }

  12% {
    background: url("../../public/games/slidedice/flame-2.svg");
  }

  24% {
    background: url("../../public/games/slidedice/flame-3.svg");
  }

  36% {
    background: url("../../public/games/slidedice/flame-4.svg");
  }

  48% {
    background: url("../../public/games/slidedice/flame-5.svg");
  }

  60% {
    background: url("../../public/games/slidedice/flame-6.svg");
  }

  72% {
    background: url("../../public/games/slidedice/flame-7.svg");
  }

  84% {
    background: url("../../public/games/slidedice/flame-8.svg");
  }

  100% {
    background: url("../../public/games/slidedice/flame-1.svg");
  }
}
</style>
