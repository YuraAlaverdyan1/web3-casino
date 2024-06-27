<template>
  <div class="menu hidden lg:block" :class="menu ? 'opened-menu' : 'closed-menu'">
    <div class="part-1 gap-[18px]" :class="menu && 'ml-[5px]'">
      <img
        v-if="menu && isLarge"
        class="cursor-pointer scale-100 hover:scale-[1.02] transition-all"
        :src="isSmall ? '/images/nav/logo-small.svg' : '/images/nav/logo.svg'"
        @click="$router.push('/')"
      >
      <img
        v-if="isLarge"
        class="cursor-pointer scale-100 hover:scale-[1.02] transition-all ml-[4px]"
        :class="menu ? 'rotate-0' : 'rotate-[180deg]'"
        src="/images/nav/menu_close.svg"
        @click="openMenu"
      >
    </div>
    <div v-if="!isLarge" class="flex justify-between items-center my-4 px-4">
      <input type="image" src="/images/nav/logo.png" @click="$router.push('/')">
      <input type="image" src="/images/profile/user-info/close.png" @click="closeMenu">
    </div>
    <div class="menu-items max-h-[89vh] overflow-y-auto mt-[45px] pb-[30px]">
      <div v-for="(item, index) of Menu" :key="index">
        <MenuItem :item="item" />
      </div>
      <div class="max-w-[192px] mx-auto w-full">
        <SelectBtnLang
          v-if="menu"
          :is-full-width="true"
          :text="locale.toUpperCase()"
          :image="`/images/lang/${locale}.svg`"
          :items="availableLocales"
          :lang="true"
          class="mt-[10px] lang w-full relative"
          @select="handleChangeLang"
        />
      </div>
      <div
        v-if="menu"
        class="flex pl-[20px] pr-[18px] py-[18px] justify-between w-[192px] bg-[#2C2634] rounded-[12px] mx-auto mt-[12px]"
      >
        <a
          v-for="(item, index) of menuItems"
          :key="index"
          class="scale-[1] hover:scale-[1.05] transition-all"
          target="_blank"
          :href="item.link"
          @mouseover="hoverItem = item.name"
          @mouseleave="hoverItem = ''"
          @click="handleClick(item.name)"
        >
          <icon-component
            :icon="item.name"
            :svg-color="clickItem === item.name ? '#FFDC7E' : item.name === hoverItem ? '#9E68FF' : '#fff'"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useRoute } from 'vue-router'
import Menu from '~/data/menu'
import { useMenu } from '~/composables/useMenu'
import { BreakPoint } from '~/model/break-points'
import menuItems from '~/data/social-links.json'
import IconComponent from '~/components/svgs/icon-component.vue'

// gallery locales: https://hatscripts.github.io/circle-flags/gallery

export default {
  components: { IconComponent },
  setup() {
    const { locale, locales, setLocale } = useI18n()

    const breakpoints = useBreakpoints(BreakPoint)
    const lang = ref({ code: 'ENG' })
    const { menu, closeMenu, openMenu, activeProfileIndex } = useMenu()
    const isSmall = computed(() => breakpoints.smaller('sm').value)

    const isLarge = computed(() => breakpoints.lg.value)

    const route = useRoute()
    const hoverItem = ref('')
    const clickItem = ref('')
    const handleClick = (e) => {
      clickItem.value = e
      setTimeout(() => {
        clickItem.value = ''
      }, 50)
    }

    watch(() => route, () => {
      if (!route.path.includes('profile')) {
        activeProfileIndex.value = 0
      }
    }, { deep: true, immediate: true })

    watch(() => [route, activeProfileIndex.value], () => {
      if (!isLarge.value) {
        menu.value = false
      }
    }, { deep: true, immediate: true })

    const availableLocales = computed(() => {
      return locales.value.map(l => l.code.toUpperCase())
    })

    function handleChangeLang(lang) {
      setLocale(lang.toLowerCase())
    }

    return {
      Menu,
      lang,
      menu,
      isSmall,
      closeMenu,
      openMenu,
      breakpoints,
      isLarge,
      menuItems,
      hoverItem,
      handleClick,
      clickItem,
      availableLocales,
      locale,
      handleChangeLang
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-drop__item) {
  color: white !important;
  height: 50px;
}

:deep(.o-drop__item--active) {
  background: none;
}

:deep(.o-drop__menu, .o-drop__menu--active) {
  padding: 0;
  width: 80%;
  background: linear-gradient(0deg, rgba(31, 192, 240, 0.05), rgba(31, 192, 240, 0.05)), #1C1B1F;
  border: 1px solid #3B3C4E;
  border-radius: 12px;
}

.part-1 {
  @apply flex items-center justify-center pt-[23px];
}

.menu {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 51;
  transition: 0.4s;
  height: 100vh;
  background: #251F2D;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.closed-menu {
  @screen lg {
    width: 65px;
    display: block;
  }

  display: none;
}

.opened-menu {
  @screen lg {
    width: 240px;
  }

  width: 100%;
  animation: open .2s;
}

.menu-items {
  gap: 11px;
  position: sticky;
  left: 0px;
  margin-left: -3px;
  top: 92px;
  @apply flex flex-col;
}

@media (max-width: 1216px) {
  .menu {
    top: 0;
    z-index: 9999;
  }

  .lang {
    width: 40%;
  }
}
</style>
