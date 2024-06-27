<template>
  <div class="info">
    <div class="info_mines">
      <div class="info_mines_count">
        <p class="key">
          Mines
        </p>
        <p class="value">
          {{ numMines }}
        </p>
      </div>
      <input
        v-model="numMines"
        class="range w-full"
        type="range"
        name="slider"
        min="1"
        :disabled="isDisabled"
        max="25"
      >
      <div class="info_mines_count">
        <p class="key">
          Multiplier
        </p>
        <p class="value">
          {{ multipler }}
        </p>
      </div>
      <div class="info_mines_count">
        <p class="key">
          Payout
        </p>
        <p class="value">
          {{ (multipler * valueBet).toFixed(4) }}
        </p>
      </div>
    </div>
    <button
      class="info_reveal"
      :disabled="isDisabledReveal"
      @click="runGame"
      @mouseover="hovered = 'reveal'"
      @mouseleave="hovered = ''"
    >
      Reveal & Cashout
      <img :src="`/games/mine/play_icon${correctIcon('reveal')}.svg`" alt="replay">
    </button>
    <button
      class="info_claim"
      :disabled="isDisabledClaim"
      @click="endGame"
      @mouseover="hovered = 'claim'"
      @mouseleave="hovered = ''"
    >
      Cashout
      <img :src="`/games/icons/mine${correctIcon('claim')}.svg`" alt="replay">
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMiniGames } from '~/composables/useMiniGames'
import { useMine } from '~/composables/games/useMine'

const { mines, numMines, multipler, activeStatus, endGame, runMineGame } = useMine()
const {
  valueBet,
  isPlaying,
  isDisabledPlayBtn,
  unclaimTokens,
  selectedToken,
  getSmartcontractAddress,
  finishGame,
  playTheGame
} = useMiniGames()
const hovered = ref<string>('')
const runGame = () => {
  runMineGame({
    selectedToken,
    valueBet,
    getSmartcontractAddress,
    unclaimTokens,
    finishGame,
    playTheGame,
    autoClaim: true,
    isCashOut: true
  })
}
const isDisabled = computed<boolean>(
  () =>
    activeStatus.value === 'start' ||
    isPlaying.value ||
    valueBet.value <= 0 ||
    !mines.value.some(mine => mine.selected) ||
    mines.value.some(mine => mine.type)
)
const isDisabledReveal = computed<boolean>(
  () =>
    isPlaying.value || valueBet.value <= 0 || !mines.value.some(mine => mine.selected)
)
const isDisabledClaim = computed<boolean>(
  () =>
    activeStatus.value === 'start' ||
    isPlaying.value ||
    valueBet.value <= 0 ||
    !mines.value.some(mine => mine.type)
)
watch(
  () => [mines.value],
  () => {
    isDisabledPlayBtn.value =
      isPlaying.value ||
      valueBet.value <= 0 ||
      !mines.value.find(mine => mine.selected)
  },
  { deep: true }
)

const correctIcon = (type: string) => {
  if (
    (isDisabledReveal.value && type === 'reveal') ||
    (type === 'claim' && isDisabledClaim.value)
  ) {
    return '-disabled'
  } else if (hovered.value === type) {
    return '-hover'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .key {
    color: #e6e6e6;
    font-size: 14px;
    font-family: Exo 2;
  }
  .value {
    color: #f5f5f7;
    font-weight: 700;
    font-family: Exo 2;
  }
  &_mines {
    background-color: #201a29;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    &_count {
      display: flex;
      justify-content: space-between;
    }
    .range {
      background: #000;
      height: 4px;
      outline: none;
      cursor: pointer;
      accent-color: #ff6600;
      margin: 12px 0;
    }
  }
  &_reveal {
    height: 56px;
    width: 100%;
    border-radius: 12px;
    background-color: #f5f5f7;
    color: #6600ff;
    font-size: 24px;
    font-weight: 700;
    font-family: Exo 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;

    &:hover:not(:disabled) {
      color: #9e68ff;
    }

    &:disabled {
      background-color: #424245;
      color: #6f6c75;
    }
  }
  &_claim {
    height: 56px;
    width: 100%;
    border-radius: 12px;
    background-color: #60F;
    color: #f5f5f7;
    font-size: 24px;
    font-weight: 700;
    font-family: Exo 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;

    &:hover:not(:disabled) {
      color: #FFDC7E;
    }

    &:disabled {
      background-color: #424245;
      color: #6f6c75;
    }
  }
}
</style>
