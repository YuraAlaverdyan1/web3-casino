import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useSlide = createGlobalState(() => {
  const hand = ref<string[]>(['A-P-C', 'A-P-D', 'J-P-D', 'A-P-H', 'A-P-S'])

  const setHand = ():void => {
    hand.value = []
  }

  const generateRandomValues = (count:number) => {
    const randomValues: any = []
    const colors:string[] = ['white', 'black']
    const bgColors:string[] = ['#ff00bd', '#00FFAF', '#FF1D00', '#60F', '#FFF800', '#0075FF']

    for (let i = 0; i < count; i++) {
      randomValues.push({
        bgColor: bgColors[Math.floor(Math.random() * bgColors.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        value: +(Math.random() * (200 - 0.1) + 0.1).toFixed(2)
      })
    }

    return randomValues
  }

  return {
    hand,
    setHand,
    generateRandomValues
  }
})
