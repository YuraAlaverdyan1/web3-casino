<template>
  <div>
    <div class="mobile_menu" :class="isOpenSearch && 'menu_border'">
      <div
        v-for="(item, index) of menu"
        :key="index"
        class="mobile_menu_container"
        :class="[checkIsActive(item.name), !item.active && 'disabled']"
        @click="select(item.name)"
      >
        <div v-if="isVisibleMenu(index)" class="w-[24px] h-[24px] rounded-[2px] bg-[#F60] flex items-center justify-center border-[1px] border-[#F5F5F7]">
          <p>
            {{ betslips.length }}
          </p>
        </div>
        <img
          v-if="showImage(index)"
          :src="item.image"
          alt="menu_icon"
          :class="isActive && index === 2 && `${menu[2].name}_active`"
        >
        <h3 class="capitalize">
          {{ item.name }}
        </h3>
      </div>
    </div>
    <Browse v-if="isOpenSearch" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenu } from '../../composables/useMenu'
import { useMobileMenu } from '~/composables/useMobileMenu'
import { Sports, useAzuro } from '~/composables/useAzuro'

const router = useRouter()
const route = useRoute()
const resolveRoutes = computed<string[]>(() =>
  router.currentRoute.value.path.split('/').filter(route => route !== '')
)

const { menu, isSuggestedGamesOpen, isSportsBets } = useMobileMenu()
const { showBuyModal } = useMenu()
const { betslips } = useAzuro()
const isActive = ref<boolean>(false)
const isOpenSearch = ref<boolean>(false)

const select = (text: string): void => {
  if (text === 'browse') {
    isOpenSearch.value = !isOpenSearch.value
    document.body.style.overflowY = isOpenSearch.value ? 'hidden' : 'auto'
  } else if (text === 'casino') {
    isOpenSearch.value = false
    router.push('/')
  } else if (text === 'originals') {
    isSuggestedGamesOpen.value = !isSuggestedGamesOpen.value
    isActive.value = !isActive.value
  } else if (text === Sports.Betslip) {
    isSportsBets.value = !isSportsBets.value
  } else if (text === 'Buy RDT') {
    showBuyModal.value = !showBuyModal.value
  }
}

const isVisibleMenu = (index) => {
  if (index === 2 && betslips.value.length && route.path.includes('sports')) {
    return true
  }
  return false
}

const showImage = (index) => {
  if (((index === 2 && !betslips.value.length) || index !== 2) || !route.path.includes('sports')) {
 return true
  }
  return false
}

const checkIsActive = (text: string): string => {
  if (
    (isOpenSearch.value && text === 'browse') ||
    (!isOpenSearch.value && resolveRoutes.value.includes(text))
  ) {
    return 'active_container'
  } else if (text === Sports.Betslip && !isSportsBets.value) {
    return 'active_container'
  }
  return ''
}

</script>

<style lang="scss" scoped>
.mobile_menu {
  display: flex;
  position: fixed;
  bottom: -3px;
  left: 0;
  z-index: 25;
  background-color: #171120;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px 0;

  .active_container {
    border-radius: 4px;
    border-top: 1px solid #f60;
    box-shadow: 0px 1px 8px 0px rgba(231, 93, 3, 0.15);
  }

  .disabled {
    color: #6f6c75 !important;

    &:hover {
      cursor: auto !important;
      opacity: 1 !important;
    }
  }

  &_container {
    flex: 1;
    height: 48px;
    display: flex;
    flex-direction: column;
    font-size: 10px;
    align-items: center;
    justify-content: center;
    text-overflow: ellipsis;
    white-space: nowrap;

    .originals_active {
      filter: brightness(0) saturate(100%) invert(74%) sepia(76%) saturate(6222%) hue-rotate(232deg) brightness(100%) contrast(103%);
    }

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }

    img {
      width: 24px;
      height: 24px;
    }
  }
}

.menu_border {
  border-top: 1px solid #424245;
}
</style>
