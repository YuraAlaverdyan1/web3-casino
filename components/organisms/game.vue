<template>
  <div
    class="flex flex-col gap-1 lg:gap-[0px] pt-12 w-full px-[16px] lg:px-[0px]"
    :class="menu ? 'opened-menu' : ''"
  >
    <ResolveRouter />
    <SuggestedGames />
    <div class="flex justify-between w-full mt-[10px] lg:mt-[0px] mb-[10px]">
      <div class="flex gap-[5px] lg:gap-4 items-center relative z-[20]">
        <action-icon
          v-for="(icon, i) of helpIcons"
          :key="i"
          data-aos="zoom-out"
          data-aos-once="true"
          :data-aos-delay="1000 + i * 100"
          :name="icon.name"
          :icon="
            (!isSoundReady && i === 1) ||
              (isDisabledSound && i === 1) ||
              (!fastResult && i === 2)
              ? icon.disabled
              : icon.icon
          "
          :hover="icon.hover"
          :selected="icon.selected"
          :disabled="icon.disabled"
          :index="i"
          @click="
            [
              i === 3 ? (helpContainer = true) : null,
              i === 1 && clickSoundButton(),
              i === 2 ? (fastResult = !fastResult) : null,
            ]
          "
        />
      </div>
      <div
        class="flex gap-2 ml-10 w-2/5 no-scrollbar justify-end flex-reversed h-[37px] transition-all duration-500"
        :class="hideResults ? 'translate-x-[100%]' : 'translate-x-[0px]'"
      >
        <action-button
          v-for="(round, index) of lastResultsBatch"
          :key="index"
          :color="round >= 1 ? '#B9FF6E' : '#FFDC7E'"
          class="transition ease-in-out"
        >
          {{
            round >= 1 || round == 1
              ? `x${
                currentGame === "slidedice" ||
                currentGame === "arcade" ||
                currentGame === "chi-fou-mi" ||
                currentGame === "wheel"
                  ? round
                  : potencialWin
              }`
              : (currentGame === "chi-fou-mi" || currentGame === "mine") && round !== 0
                ? `x${(+round).toFixed(4)}`
                : "LOST"
          }}
        </action-button>
      </div>
    </div>
    <div class="flex w-full flex-col lg:flex-row gap-2 lg:gap-6">
      <div class="lg:w-[calc(100%_-_430px)] bg-[#171120]">
        <round-info
          v-if="isSmall"
          data-aos="fade-up"
          data-aos-once="true"
          data-aos-delay="300"
          class="mb-6 lg:my-6"
          bets="multiBet"
          :last-results="lastResults"
          :last-won="lastWon"
        />
        <game-spot
          data-aos="fade-right"
          data-aos-once="true"
          data-aos-delay="200"
          :with-padding="withPadding"
          :class="backgroundImage"
        >
          <slot name="game" />
          <slot v-if="!isSmall" name="roundInfo" />
          <slot v-if="isSmall" name="sideText" />
        </game-spot>
      </div>
      <slot v-if="isSmall" name="wheelDataButtons" />
      <cta-button
        v-if="isSmall"
        :game="ctaButtonsIcons[currentGame!]"
        e2e-id="cta-play"
        @click="start"
      >
        {{ ctaText }}
      </cta-button>
      <div
        :data-aos="!isSmall ? 'fade-left' : ''"
        data-aos-once="true"
        data-aos-delay="200"
        class="lg:w-full lg:max-w-[400px] justify-between bg-[#171120] flex flex-col gap-4 border-2 rounded-lg border-rd-border-purple sm:px-[24px] sm:pb-[24px] sm:pt-[12px]"
      >
        <img v-if="titleImage" :src="titleImage">

        <buy-select
          v-if="currentGame !== 'to-the-moon'"
          data-aos="fade-up"
          data-aos-once="true"
          :data-aos-delay="300"
          :tokens="availableTokens"
          text="HEADS +0.01"
          text-class="text-rd-green"
          :options="options"
          :balance="balance"
          :max="max"
          :min-bet="minBet"
        >
          <img class="w-[200px]" src="/images/profile/user-info/coin.png">
        </buy-select>
        <range-selector
          v-if="rangeSelectorActive && currentGame !== 'to-the-moon'"
          data-aos="fade-up"
          data-aos-once="true"
          :data-aos-delay="!isSmall ? '500' : '300'"
          @on-multi-bet="handleMultiBet"
          @on-autoclaim="handleAutoclaim"
        />
        <slot name="selectorInfo" />
        <slot name="selectorValue" />
        <slot name="mission" />
        <div
          v-if="!isSmall && lastInfo"
          data-aos="fade-up"
          data-aos-once="true"
          data-aos-delay="700"
          class="w-full"
          :data-aos-offset="!isSmall ? '-2000' : ''"
        >
          <cta-button
            class="w-full"
            :game="ctaButtonsIcons[currentGame!]"
            e2e-id="cta-play"
            @click="start"
          >
            {{ ctaText }}
          </cta-button>
        </div>
        <div
          data-aos="fade-up"
          data-aos-once="true"
          :data-aos-delay="!isSmall ? (!lastInfo ? '900' : '900') : '300'"
          :data-aos-offset="!isSmall ? '-2000' : ''"
        >
          <slot name="info" />
        </div>
        <div
          v-if="!isSmall && !lastInfo"
          class="w-full"
          data-aos="fade-up"
          data-aos-once="true"
          data-aos-delay="1200"
          :data-aos-offset="!isSmall ? '-2000' : ''"
        >
          <cta-button
            class="w-full"
            :game="ctaButtonsIcons[currentGame!]"
            e2e-id="cta-play"
            @click="start"
          >
            {{ ctaText }}
          </cta-button>
        </div>
      </div>
    </div>
    <slot name="fullWidthTable" />
    <div data-aos="fade-up" data-aos-once="true" data-aos-delay="300" class="w-full">
      <livebets :is-small="isSmall" />
    </div>
    <become-the-house />
    <games-help
      v-if="helpContainer"
      @close="helpContainer = false"
      @closed="helpContainer = false"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBreakpoints, watchDebounced } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useGameStatus } from '../../composables/useGameStatus'
import { useSound } from '../../composables/useSound'
import { useCoinflip } from '../../composables/games/useCoinflip'
import BecomeTheHouse from './become-the-house.vue'
import { BreakPoint } from '~/model/break-points'
import ActionIcon from '~/components/atoms/games/action-icon.vue'
import ActionButton from '~/components/atoms/games/action-button.vue'
import GameSpot from '~/components/atoms/games/game-spot.vue'
import BuySelect from '~/components/atoms/games/buy-select.vue'
import RoundInfo from '~/components/atoms/games/round-info.vue'
import RangeSelector from '~/components/atoms/games/range-selector.vue'
import Livebets from '~/components/atoms/games/livebets.vue'
import ctaButtonsIcons from '~/data/cta-buttons-icons.json'
import ctaButton from '~/components/atoms/games/cta-button.vue'
import helpIcons from '~/data/help-icons.json'
import { useMenu } from '~/composables/useMenu'
import { useMiniGames, MiniGames } from '~/composables/useMiniGames'
import { usePlinko } from '~/composables/games/usePlinko'
import { useChiFouMi } from '~/composables/games/useChiFouMi'
import { useSlide } from '~/composables/games/useSlide'
import { useVideoPoker } from '~/composables/games/useVideoPoker'
import { useMine } from '~/composables/games/useMine'
import gamesHelp from '~/components/organisms/modals/games-help.vue'
import { getRandomSound } from '~/utils/sound/getRandomSound'
import { useWeb3 } from '~/composables/useWeb3'

export default {
  components: {
    ActionIcon,
    GameSpot,
    BuySelect,
    RangeSelector,
    ActionButton,
    RoundInfo,
    ctaButton,
    Livebets,
    gamesHelp,
    BecomeTheHouse
  },
  emits: ['open-help-modal'],
  props: {
    withPadding: {
      type: Boolean,
      required: false,
      default: true
    },
    lastInfo: {
      type: Boolean,
      required: false,
      default: false
    },
    gameInfo: {
      type: Object as () => { name: string; description: string },
      required: true
    },
    titleImage: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup() {
    const route = useRoute()
    const multiBet = ref(0)
    const { menu } = useMenu()
    const breakpoints = useBreakpoints(BreakPoint)
    const { setHand: setSlideHand } = useSlide()
    const { isDisabledSound, isSoundReady, loomSound } = useSound()
    const { side } = useCoinflip()
    const removeRangeSelector: MiniGames = ['video-poker', 'mine']
    const { setActiveStep } = useVideoPoker()
    const { runMineGame } = useMine()
    const {
      availableTokens,
      max,
      balance,
      isPlaying,
      ctaText,
      claimNow,
      playTheGame,
      tokensToClaim,
      lastWon,
      claimTokens,
      currentGame,
      lastResults,
      potencialWin,
      isRolling,
      valueBet,
      multiplierInput,
      fastResult,
      minBet,
      isDisabledPlayBtn,
      selectedToken,
      getSmartcontractAddress,
      unclaimTokens,
      totalWinnings,
      gameScore,
      finishGame
    } = useMiniGames()

    const backgroundImage = computed(
      () =>
        currentGame.value === 'slide' && (isRolling.value ? 'slideBgRolling' : 'slideBg')
    )
    const { gameStatus } = useGameStatus()
    const helpContainer = ref(false)
    const autoClaim = ref(false)
    const lastResultsBatch = ref([])
    const lastResultsBatchIndex = ref(0)
    const { incrementGamesRunning } = usePlinko()
    const { first } = useChiFouMi()
    const isMiddle = computed(() => breakpoints.greaterOrEqual('md').value)
    const options = ref([10, 100, 1000, 10000])
    const intr = ref()
    const hideResults = ref(false)
    const { format } = useWeb3()
    const { loomPlay, loomPause } = useSound()
    const methods = {
      'chi-fou-mi': () => {
        if (first.value) {
          first.value = false
        }
      },
      plinko: () => {
        incrementGamesRunning(8)
      },
      slide: () => {
        setSlideHand(25)
      }
    }

    const clickSoundButton = () => {
      if (isDisabledSound.value) {
        isDisabledSound.value = false
        loomPlay()
      } else {
        isDisabledSound.value = true
        loomPause()
      }
    }

    watch(
      () => [max.value, route],
      () => {
        const maxLocal = `${max.value}`.split('.')[0]
        let maxValueLength
        if (`${maxLocal}`.split('.').length > 1) {
          const maxValueWithDot = `${maxLocal}`.split('')
          maxValueWithDot[`${maxLocal}`.split('').length - 1] = `1`
          options.value = [
            +maxValueWithDot.join('') / 1000,
            +maxValueWithDot.join('') / 100,
            +maxValueWithDot.join('') / 10,
            +maxValueWithDot.join('')
          ]
        } else {
          maxValueLength = `${maxLocal}`
            .split('')
            .map((_item, index) => {
              return index === 0 ? 1 : 0
            })
            .join('')
          options.value = [
            +maxValueLength * 0.001,
            +maxValueLength * 0.01,
            +maxValueLength * 0.1,
            +maxValueLength
          ]
        }
      },
      { immediate: true, deep: true }
    )

    const isSmall = computed(() => {
      return breakpoints.smaller('md').value
    })

    const start = () => {
      if (!isDisabledPlayBtn.value) {
        if (methods[currentGame.value!]) {
          methods[currentGame.value!]()
        }
        handleCta()
      }
    }

    const handleCta = () => {
      if (claimNow.value) {
        handleClaim()
      } else if (valueBet.value > 0 && !isPlaying.value) {
        if (currentGame.value === MiniGames.VideoPoker) {
          setActiveStep({
            selectedToken,
            valueBet,
            getSmartcontractAddress,
            unclaimTokens,
            lastWon,
            lastResults,
            totalWinnings,
            gameScore,
            finishGame,
            playTheGame,
            autoClaim
          })
        } else if (currentGame.value === MiniGames.Mine) {
          runMineGame({
            selectedToken,
            valueBet,
            getSmartcontractAddress,
            unclaimTokens,
            finishGame
          })
        } else {
          playTheGame(autoClaim.value)
        }
      }
    }

    const rangeSelectorActive = computed(() => {
      return !removeRangeSelector.includes(currentGame.value)
    })

    async function handleAutoclaim(value) {
      autoClaim.value = value
      if (!value) {
        const tokens = await tokensToClaim()
        if (tokens > 0 && !value) {
          claimNow.value = true
        }
      } else {
        claimNow.value = false
      }
    }

    function handleMultiBet(value) {
      multiBet.value = value
    }

    async function handleClaim() {
      try {
        await claimTokens()
        gameStatus.value = { text: 'Blockchain confirmation successful', color: 'green' }
        claimNow.value = false
      } catch (e: any) {
        gameStatus.value = { text: 'Wallet Access Denied', color: 'red' }
        claimNow.value = true
      }
    }

    onMounted(() => {
      const currentRoute = route.path.split('/').filter(el => el)
      const game: MiniGames = currentRoute[currentRoute.length - 1] as MiniGames
      currentGame.value = game
      loomSound.value = getRandomSound(game)
    })

    watch(
      () => lastResults.value,
      () => {
        lastResultsBatchIndex.value = 0
      }
    )

    watch(
      () => lastResultsBatchIndex.value,
      () => {
        if (lastResultsBatchIndex.value === 0) {
          hideResults.value = true
          setTimeout(() => {
            hideResults.value = false
            lastResultsBatch.value = []
          }, 1000)
        }
      }
    )

    const reversed = computed(() => [...lastResults.value].reverse())

    watch(
      () => isPlaying.value,
      () => {
        if (isPlaying.value) {
          clearInterval(intr.value)
        }
      }
    )

    watch(
      () => side.value,
      () => {
        lastResultsBatchIndex.value = reversed.value.length
      }
    )

    watchDebounced(
      () => lastResults.value,
      (value) => {
        value.reverse()
        const viewResult = !isMiddle.value ? 3 : 6
        if (value.length > 0) {
          if (currentGame.value === 'slidedice' || currentGame.value === 'coinflip') {
            value = value.reverse().map((item) => {
              return item > 0 ? multiplierInput.value.toFixed(2) : 0
            })
          } else if (currentGame.value === 'wheel') {
            value = value.reverse().map((item) => {
              return item.toFixed(2)
            })
          } else if (currentGame.value === 'chi-fou-mi') {
            value = value.reverse().map((item) => {
              item = +format(item).toFixed(2)
              if (valueBet.value < item) {
                return 1.98
              } else if (valueBet.value > item && item !== 0) {
                return 0.99
              }
              return 0
            })
          } else if (currentGame.value === 'arcade') {
            value = value.reverse()
          }

          if (
            (currentGame.value === 'wheel' ||
              currentGame.value === 'coinflip' ||
              currentGame.value === 'chi-fou-mi' ||
              currentGame.value === 'arcade') &&
            lastResultsBatchIndex.value === 0
          ) {
            lastResultsBatchIndex.value = lastResultsBatchIndex.value + 1
          }

          const addResult = () => {
            if (lastResultsBatchIndex.value > value.length) {
              lastResultsBatchIndex.value = 0
              clearInterval(intr.value)
              return
            }
            // if we have more than 6 results, remove the oldest one
            // go 1 by one, if we reach 6, so we move 1 by 1 keeping the last 8 results

            if (lastResultsBatchIndex.value < viewResult) {
              lastResultsBatch.value = value.slice(0, lastResultsBatchIndex.value)
            } else {
              lastResultsBatch.value = value.slice(
                lastResultsBatchIndex.value - viewResult,
                lastResultsBatchIndex.value
              )
            }
            lastResultsBatchIndex.value = lastResultsBatchIndex.value + 1
          }

          if (!fastResult.value) {
            if (currentGame.value === 'wheel') {
              setTimeout(() => {
                intr.value = setInterval(() => {
                  addResult()
                }, 9700)
              }, 1700)
            } else {
              intr.value = setInterval(
                () => {
                  addResult()
                },
                currentGame.value === 'coinflip'
                  ? 2000
                  : currentGame.value === 'arcade'
                  ? 4200
                  : currentGame.value === 'chi-fou-mi'
                  ? 3450
                  : 500
              )
            }
          } else {
            lastResultsBatch.value = value.slice(value.length - viewResult, value.length)
          }
        }
      },
      { debounce: 500 }
    )

    return {
      currentGame,
      ctaText,
      handleCta,
      helpIcons,
      ctaButtonsIcons,
      helpContainer,
      menu,
      availableTokens,
      isSmall,
      start,
      claimNow,
      max,
      handleMultiBet,
      balance,
      lastWon,
      rangeSelectorActive,
      lastResults,
      lastResultsBatch,
      potencialWin,
      multiBet,
      handleAutoclaim,
      isRolling,
      options,
      backgroundImage,
      clickSoundButton,
      isSoundReady,
      isDisabledSound,
      fastResult,
      minBet,
      hideResults
    }
  }
}
</script>

<style lang="scss" scoped>
.opened-menu {
  width: 80vw;
}

.chi-fou-mi-round-info {
  width: 95% !important;
  @apply absolute bottom-3 left-0 right-0 m-auto;
}

.chi-fou-mi-game-container {
  @screen sm {
    height: 700px;
  }

  height: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.slideBg {
  background-image: url("/games/slide/gameBg.png");
  background-size: 100% 100%;
}

.slideBgRolling {
  background-image: url("/games/slide/gameBgRolling.png");
  background-size: 100% 100%;
}
</style>
