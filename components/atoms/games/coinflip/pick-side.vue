<template>
  <div class="w-full bg-[#201a29] mx-[1px] p-3 rounded-lg">
    <div class="w-full text-center uppercase">
      Pick side
    </div>
    <div class="w-full flex gap-4 mt-5">
      <div
        class="basis-1/2 cursor-pointer coin"
        :class="[!side ? 'active-item' : '', !isPlaying && 'coin-hover']"
        @click="!isPlaying && !playGame ? selectSide(0) : null"
      >
        <img :src="`/games/coinflip/back.png`" class="coin-image">
      </div>
      <div
        class="basis-1/2 cursor-pointer coin"
        :class="[side ? 'active-item' : '', !isPlaying && 'coin-hover']"
        @click="!isPlaying && !playGame ? selectSide(1) : null"
      >
        <img :src="`/games/coinflip/front.png`" class="coin-image">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMiniGames } from '../../../../composables/useMiniGames'
import { useCoinflip } from '~/composables/games/useCoinflip'

export default {
  setup() {
    const { changeSide, side, isEndGame, playGame } = useCoinflip()
    const { isPlaying } = useMiniGames()

    const selectSide = (el) => {
      changeSide(el)
    }

    return {
      selectSide,
      side,
      isPlaying,
      isEndGame,
      playGame
    }
  }
}
</script>
<style lang="scss" scoped>
.coin {
  background: #2C2634;
  border: 1px solid #424245;
  border-radius: 12px;
  height: 154px;
  transition: .4s;

  .disabled {
    border-radius: 12px;
    border: 1px solid #6F6C75;
    background: lightgray 50% / contain no-repeat, #424245;
  }

  @apply flex items-center justify-center;
}

.coin-hover:hover {
  background: #60F;
  border: 1px solid #9E68FF;
  box-shadow: 0px 10px 20px 0px rgba(158, 104, 255, 0.50);
}

.active-item {
  border: 1px solid #9E68FF;
  background: lightgray 50% / contain no-repeat, #413C48;
  box-shadow: 0px 10px 20px 0px rgba(158, 104, 255, 0.50);
}

.coin-image {
  @screen md {
    width: 40%;
  }

  @screen lg {
    width: 80%;
  }

  width: 60%;
}
</style>
