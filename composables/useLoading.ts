import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useLoading = createGlobalState(() => {
  const loading = ref({
    loading: false,
    animation: ''
  })

  const start = (animation: string) => {
    loading.value.loading = true
    loading.value.animation = animation
  }

  const stop = () => {
    loading.value.loading = false
  }

  return {
    loading,
    start,
    stop
  }
})
