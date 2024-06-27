import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useRoute } from 'vue-router'
import menuData from '~/data/mobile_bottom_menu.json'
import { Sports } from '~/composables/useAzuro'
export const useMobileMenu = createGlobalState(() => {
  const menu = ref(menuData)
  const isSuggestedGamesOpen = ref<boolean>(false)
  const isSportsBets = ref(true)
  const route = useRoute()

  const createMenu = (pageName:string = ''):void => {
    let itemInCenter
    if (route.path.includes('sports')) {
      itemInCenter = {
        name: Sports.Betslip,
        image: `/mobile_bottom_menu/ticket-small.svg`,
        active: true
      }
    } else {
      itemInCenter = {
        name: pageName,
        image: `/mobile_bottom_menu/${pageName}.svg`,
        active: true
      }
    }
    if (menu.value.length === 4) {
      menu.value.splice(2, 0, itemInCenter)
    } else {
      menu.value[2] = itemInCenter
    }
  }

  return {
    menu,
    createMenu,
    isSuggestedGamesOpen,
    isSportsBets
  }
})
