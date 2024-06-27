<template>
  <div class="coin-container">
    <img
      v-for="(_, index) of new Array(28)"
      :key="index"
      :src="`/games/coinflip/coin/${index + 1}.png`"
      class="image"
      :style="i === index + 1 ? 'display: block' : 'display: none'"
    >
    <img
      v-if="isSmall"
      src="/games/coinflip/left-arrow.png"
      class="arrow-left"
      @click="!isPlaying && !playGame ? changeSide(side === 0 ? 1 : 0) : null"
    >
    <img
      v-if="isSmall"
      src="/games/coinflip/right-arrow.png"
      class="arrow-right"
      @click="!isPlaying && !playGame ? changeSide(side === 0 ? 1 : 0) : null"
    >
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMiniGames } from '~/composables/useMiniGames'
import { useCoinflip } from '~/composables/games/useCoinflip'
import endGameAudio from '~/public/sounds/coinflip/coinflip_flip.mp3'
import winAudio from '~/public/sounds/coinflip/coinflip_win.mp3'
import loseAudio from '~/public/sounds/coinflip/coinflip_lose.mp3'
import { useSound } from '~/composables/useSound'

 defineProps({
  isFlipping: {
    type: Boolean,
    required: false
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: false
  }
})

const { isPlaying, lastResults, fastResult } = useMiniGames()
const { side, changeSide, isEndGame, playGame } = useCoinflip()
const { isDisabledSound } = useSound()
const i = ref(1)

const interv = ref('')
const lastResTimeout = ref([])

const isFinished = ref(false)
const winningNumbers = ref([])
const endGameSound = new Audio(endGameAudio)

watch(() => lastResults.value, () => {
  if (lastResults.value.length > 0) {
    if (!isDisabledSound.value) {
      endGameSound.play()
    }
    if (!fastResult.value) {
      // eslint-disable-next-line array-callback-return
      lastResults.value.map((item, index) => {
        lastResTimeout.value = [
          ...lastResTimeout.value, setTimeout(() => {
            winningNumbers.value = [...winningNumbers.value, item]
            if (index === 0) {
              playGame.value = false
            }
          }, index * 2000)
        ]
      })
    }
  }
})

watch(() => [winningNumbers.value, isPlaying.value], () => {
  if (isPlaying.value) {
    isEndGame.value = false
    // eslint-disable-next-line array-callback-return
    lastResTimeout.value.map((_item, index) => {
      clearTimeout(lastResTimeout.value[index])
    })
  } else {
    if (winningNumbers.value.length > 0) {
      isEndGame.value = true
    }
    if (winningNumbers.value.length === lastResults.value.length) {
      setTimeout(() => {
        isEndGame.value = false
      }, 2000)
    }
  }
})
watch(() => winningNumbers.value, () => {
  if (winningNumbers.value.length > 0 && !isDisabledSound.value) {
    if (winningNumbers.value[winningNumbers.value.length - 1] > 0) {
      setTimeout(() => {
        new Audio(winAudio).play()
      }, 500)
    } else {
      setTimeout(() => {
        new Audio(loseAudio).play()
      }, 700)
    }
  }
})

const goRight = () => {
  if (i.value < 28) {
    i.value++
  } else {
    i.value = 1
  }
}

watch(() => side.value, () => {
  clearInterval(interv.value)
  interv.value = ''
  winningNumbers.value = []
  // eslint-disable-next-line array-callback-return
  lastResTimeout.value.map((_item, index) => {
    clearTimeout(lastResTimeout.value[index])
  })
  interv.value = setInterval(() => {
    goRight()
  }, 20)
})

watch(() => [i.value, isPlaying.value, isEndGame.value, winningNumbers.value], () => {
  if (!isEndGame.value) {
    if (isPlaying.value) {
      if (winningNumbers.value.length !== 0) {
        winningNumbers.value = []
      }
      if (interv.value === '') {
        interv.value = setInterval(() => {
          goRight()
        }, 20)
      }
    } else {
      isFinished.value = true
      clearInterval(interv.value)
      interv.value = ''
    }
  } else if (i.value === 1 && side.value) {
    isFinished.value = true
    clearInterval(interv.value)
    interv.value = ''
  } else if (i.value === 15 && !side.value) {
    isFinished.value = true
    clearInterval(interv.value)
    interv.value = ''
  }
  if (!isPlaying.value) {
    if (!isEndGame.value) {
      if (interv.value === '') {
        interv.value = setInterval(() => {
          goRight()
        }, 20)
      }
      if (!playGame.value && i.value === 1 && side.value) {
        isFinished.value = true
        clearInterval(interv.value)
        interv.value = ''
      } else if (!playGame.value && i.value === 15 && !side.value) {
        isFinished.value = true
        clearInterval(interv.value)
        interv.value = ''
      }
    } else if (winningNumbers.value.length > 0) {
      if (interv.value === '') {
        interv.value = setInterval(() => {
          goRight()
        }, 20)
      }
      setTimeout(() => {
        if (side.value === Number(winningNumbers.value[winningNumbers.value.length - 1])) {
          if (i.value === 1) {
            clearInterval(interv.value)
            isFinished.value = true
            interv.value = ''
          }
        } else if (i.value === 15) {
          clearInterval(interv.value)
          isFinished.value = true
          interv.value = ''
        }
      }, 560)
    }
  }
})

</script>

<style lang="scss" scoped>
.image {
  transition: .1s ease-in-out;
  height: 80%;
  @apply absolute top-0 left-0 right-0 bottom-0 m-auto;
}

.coin-container {
  @screen sm {
    height: 650px;
  }

  height: 350px;
  @apply flex items-center w-full relative;
}

.arrow-left,
.arrow-right {
  @apply absolute top-0 bottom-0 m-auto cursor-pointer;
}

.arrow-left {
  left: 0;
}

.arrow-right {
  right: 0;
}
</style>
