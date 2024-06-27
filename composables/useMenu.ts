import { createGlobalState, useBreakpoints } from '@vueuse/core'
import { computed, onBeforeMount, ref } from 'vue'
import { BreakPoint } from '~/model/break-points'

export const useMenu = createGlobalState(() => {
  const menu = ref(true)
  const activeProfileIndex = ref(0)
  const showBuyModal = ref(false)
  const activeSubcategory = ref('')

  const menuLocal = localStorage.getItem('menu')

  const breakpoints = useBreakpoints(BreakPoint)

  const isSmall = computed(() => breakpoints.smaller('lg').value)

  onBeforeMount(() => {
    if (menuLocal === '0' || isSmall.value) {
      menu.value = false
    }
  })
  const openMenu = () => {
    menu.value = !menu.value
    if (menu.value) {
      localStorage.setItem('menu', '1')
    } else {
      localStorage.setItem('menu', '0')
    }
  }

  const closeMenu = () => {
    menu.value = false
  }

  return {
    menu,
    openMenu,
    closeMenu,
    activeProfileIndex,
    showBuyModal,
    activeSubcategory
  }
})
