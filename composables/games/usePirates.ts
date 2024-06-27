import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const usePirates = createGlobalState(() => {
  const gameElements = ref(40)
  const gameTime = ref(5600)
  const gameImage1 = '/games/pirates/capitan.webp'
  const gameImage2 = '/games/pirates/perrot.webp'
  const gameImage3 = '/games/pirates/gold.webp'
  const gameImage4 = '/games/pirates/flag.webp'
  const gameImage5 = '/games/pirates/map.webp'
  const gameImage6 = '/games/pirates/hand.webp'
  const winTable = ref([
    { winText: '100x', winImages: [gameImage1, gameImage1, gameImage1] },
    { winText: '45x', winImages: [gameImage2, gameImage2, gameImage2] },
    { winText: '20x', winImages: [gameImage3, gameImage3, gameImage3], additionaImage: [gameImage1] },
    { winText: '12x', winImages: [gameImage4, gameImage4, gameImage4], additionaImage: [gameImage1] },
    { winText: '10x', winImages: [gameImage6, gameImage6, gameImage6], additionaImage: [gameImage1] },
    { winText: '5x', winImages: [gameImage5, gameImage5, gameImage5] },
    { winText: '3x', winImages: [gameImage5, gameImage5] },
    { winText: '2x', winImages: [gameImage5] }

  ])
  const winningNumbers = ref([4, 5, 6])

  return {
    gameImage1,
    gameImage2,
    gameImage3,
    gameImage4,
    gameImage5,
    gameImage6,
    winTable: winTable.value,
    winningNumbers: winningNumbers.value,
    gameElements: gameElements.value,
    gameTime: gameTime.value
  }
})
