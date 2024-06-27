<template>
  <div class="mine">
    <div class="mine_container">
      <div class="mine_container_game">
        <div
          v-for="(mine, index) of mines"
          :key="index"
          class="mine_container_game_mines"
          :class="{ selected: mine.selected }"
          @click="selectMine(index)"
        >
          <img v-if="mine.type" :src="setImage(mine.type)" :alt="mine.type">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MinesType, useMine } from '~/composables/games/useMine'
import { useSound } from '~/composables/useSound'

const selectSound: HTMLAudioElement = new Audio('/sounds/mine/select.mp3')
const { isDisabledSound } = useSound()
const { mines } = useMine()
const selectMine = (index: number): void => {
  if (!mines.value[index].type) {
    if (!isDisabledSound.value) {
      selectSound.play()
    }
    const minesCopy = JSON.parse(JSON.stringify(mines.value))
    minesCopy[index].selected = !minesCopy[index].selected
    mines.value = minesCopy
  }
}
const setImage = (type) => {
  switch (type) {
    case MinesType.MINES:
      return '/games/mine/mine1.png'
    case MinesType.GOLD:
      return '/games/mine/golds1.png'
    case MinesType.STONES:
      return '/games/mine/stones1.png'
    default:
      return ''
  }
}
</script>

<style lang="scss" scoped>
.mine {
  user-select: none;
  width: 100%;
  padding: 2px;
  background-image: url("/public/games/mine/background.png");
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  &_container {
    height: 455px;
    width: 495px;
    @media (max-width: 1440px) and (min-width: 1216px) {
      & {
        width: 425px;
        height: 445px;
      }
    }
    background-image: url("/public/games/mine/stone_trim.png");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &_game {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 4px;
      &_mines {
        @media (max-width: 1440px) and (min-width: 1216px) {
          & {
            width: 70px;
            height: 70px;
          }
        }
        height: 80px;
        width: 80px;
        border-radius: 12px;
        background: #171120;
        border: 1px solid #9e68ff;
        overflow: hidden;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: 100% 100%;
        }

        &:hover {
          cursor: pointer;
          background: #2c2634;
        }
      }
    }
  }
  .selected {
    cursor: pointer;
    background: #6600ff;
    &:hover {
      background: #9e68ff;
    }
  }
}
</style>
