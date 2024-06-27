import { createGlobalState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

export const useSound = createGlobalState(() => {
  const isSoundReady = ref(false)
  const isDisabledSound = ref(true)
  const loomSound = ref<HTMLAudioElement>(null as unknown as HTMLAudioElement)
  const initialVolume = ref(0.1)
  const volumeInterval = ref()
  const route = useRoute()
  const startTimeout = ref()
  const defaultVolumeNumber = 0.6

  watch(() => isDisabledSound.value, () => {
    if (isDisabledSound.value) {
      sessionStorage.setItem('isPlaySound', '0')
    } else {
      sessionStorage.setItem('isPlaySound', '1')
    }
  })

  watch(() => isSoundReady.value, () => {
    if (isSoundReady.value) {
      isDisabledSound.value = false
    }
  })

  const loomPlay = () => {
    if (loomSound.value) {
      loomPause()
      startTimeout.value = setTimeout(() => {
        loomSound.value.volume = initialVolume.value
        loomSound.value.loop = true
        loomSound.value.play()
      }, 300)

      volumeInterval.value = setInterval(() => {
        if (initialVolume.value < 0.4 * defaultVolumeNumber) {
          initialVolume.value = initialVolume.value + 0.02 * defaultVolumeNumber
          loomSound.value.volume = initialVolume.value
        } else {
          initialVolume.value = 0.45 * defaultVolumeNumber
        }
      }, 1000)
    }
  }

  const loomPause = () => {
    loomSound.value.pause()
  }

  watch(() => [isSoundReady.value, loomSound.value], () => {
    if (isSoundReady.value && route && route.path.includes('games/') && !isDisabledSound.value) {
      loomPlay()
    }
  })

  watch(() => route, () => {
    if (route && !isDisabledSound.value && route.path.includes('games/')) {
      loomPlay()
    } else {
      clearTimeout(startTimeout.value)
      initialVolume.value = 0.1
      loomSound.value?.pause()
    }
  }, { immediate: true, deep: true })

  onBeforeRouteLeave(() => {
    loomPause()
  })

  const hoverSound = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/hover.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }
  const clickSound = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/click.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }
  const openDropdown = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/dropdown.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }
  const selectDropdown = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/select.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }

  const decreaseSound = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/decrease.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }
  const increaseSound = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/increase.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }
  const switchSound = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/switch.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }

  const errorSound = () => {
    if (!isDisabledSound.value) {
      const sound = new Audio('/sounds/error.wav')
      sound.volume = sound.volume * defaultVolumeNumber
      sound.play()
    }
  }

  return {
    isSoundReady,
    isDisabledSound,
    hoverSound,
    clickSound,
    openDropdown,
    selectDropdown,
    decreaseSound,
    increaseSound,
    switchSound,
    errorSound,
    loomPlay,
    loomPause,
    loomSound
  }
})
