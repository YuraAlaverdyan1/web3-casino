<template>
  <div
    class="menu-items"
    :class="[menu ? 'mx-[16px]' : 'mx-[16px] lg:mx-[0px]']"
    @mouseover="[iconColor = '#9E68FF', isHover = true]"
    @mouseleave="[iconColor = '#fff', isHover = false]"
  >
    <button class="w-full ss:w-fit lg:w-full pr-[36px] lg:pr-[0px]">
      <NuxtLink
        class="relative item"
        :class="[color.cursor, menu && item.path ? 'opened-menu-item' : '', resolveClass]"
        :to="link"
        :target="item.path?.includes('https') ? '_blank' : ''"
        @click="handleLinkClick"
      >
        <div class="detail w-full flex items-center" :class="menu ? 'justify-between' : 'justify-center lg:ml-[4px]'">
          <menu-icons :icon-name="item.name" :svg-color="color.color" class="min-w-[20px]" />
          <div
            class="flex items-center justify-between w-full text-[14px] font-[400] list whitespace-nowrap"
            :class="[!menu && 'lg:hidden', item.path && !((item.name === Sports.Sports || item.name === Sports.ESports ) && config.public.isHideSports !== 'false') && !(item.name === Lottery.Lottery && config.public.isHideLottery !== 'false') ? 'name' : 'text-[#6F6C75] font-[700] whitespace-nowrap']"
          >
            {{ (item.name === Sports.Sports || item.name === Sports.ESports ) && config.public.isHideSports !== 'false' || item.name === Lottery.Lottery && config.public.isHideLottery !== 'false' ? 'Sports - Coming Soon ' : item.name }}
            <arrow
              v-if="item.categories && !((item.name === Sports.Sports || item.name === Sports.ESports ) && config.public.isHideSports !== 'false') && !(item.name === Lottery.Lottery && config.public.isHideLottery !== 'false')"
              :svg-color="'#f5f5f5'"
              class="min-w-[20px] transition-all"
              :class="activeSubcategory === item.name ? 'rotate-90' : 'rotate-0'"
              @click.prevent.stop="handleLinkClick"
            />
          </div>
        </div>
      </NuxtLink>
      <div
        v-if="item.categories"
        :class="activeSubcategory === item.name ? 'max-h-[1500px]' : 'max-h-[0px]'"
        class="transition-all overflow-hidden duration-500"
      >
        <div
          v-for="(obj, i) of item.categories"
          :key="i"
          class="py-[0px] pr-[8px] pl-[32px] item block"
          :class="resolveLinkClass(obj) ? 'active active-item' : ''"
          @mouseover="[iconColor = '#9E68FF', isHoverSubcategory = obj.name]"
          @mouseleave="[iconColor = '#fff', isHoverSubcategory = '']"
        >
          <NuxtLink
            class="flex w-full py-[8px] h-[45px]"
            :to="obj.link"
            @click.prevent.stop="activeLeagues === '' || activeLeagues !== obj.name ? activeLeagues = obj.name : activeLeagues = ''"
          >
            <div
              class="detail w-full flex items-center"
              :class="menu ? 'justify-between' : 'justify-center lg:ml-[4px]'"
            >
              <menu-icons
                :icon-name="obj.slug"
                :svg-color="resolveLinkClass(obj) ? '#9E68FF' : '#fff'"
                class="max-w-[20px]"
              />

              <div
                class="flex items-center justify-between w-full text-[14px] font-[400] list whitespace-nowrap"
                :class="[!menu && 'lg:hidden', item.path ? 'name' : 'text-[#6F6C75] font-[700] whitespace-nowrap']"
              >
                {{ obj.name }}
                <arrow
                  v-if="(i === 1 || i === 2) && item.name === 'Sports'"
                  :svg-color="'#f5f5f5'"
                  class="min-w-[20px] transition-all"
                  :class="activeLeagues === obj.name ? 'rotate-90' : 'rotate-0'"
                  @click.prevent.stop="handleNavClick(obj)"
                />
              </div>
            </div>
          </NuxtLink>
          <div
            :class="activeLeagues === obj.name && (i === 1 || i === 2) ? 'max-h-[280px] overflow-y-auto' : 'max-h-[0px] overflow-y-hidden'"
            class="flex flex-col gap-[20px] transition-all"
          >
            <nav-item :sport="obj.name" :link="obj.link" />
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, PropType, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenu } from '~/composables/useMenu'
import Arrow from '~/components/svgs/arrow.vue'
import menuIcons from '~/components/svgs/menu-icons.vue'
import { Sports, TimeIntervals, useAzuro } from '~/composables/useAzuro'

import NavItem from '~/components/atoms/nav-item.vue'
import { Lottery } from '~/composables/useLottery'

interface Item {
  img: string;
  name: string;
  path: string;
  menu?: boolean;
}
export default {
  components: { Arrow, menuIcons, NavItem },
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true
    }
  },
  setup(props) {
    const { activeSubcategory, ...store } = useMenu()
    const route = useRoute()
    const iconColor = ref('#fff')
    const isHover = ref(false)
    const isHoverSubcategory = ref('')
    const { timeFilter } = useAzuro()
    const activeLeagues = ref('')
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()

    const menu = computed(() => {
      return store.menu.value
    })

    watch(() => store.menu.value, () => {
      if (!store.menu.value) {
        activeSubcategory.value = ''
        activeLeagues.value = ''
      }
    })

    watch(() => activeSubcategory.value, () => {
      activeLeagues.value = ''
    })
    const currentPath = computed(() => {
      return route.path
    })

    const link = computed(() => {
      if (((props.item.path && props.item.path.includes('/sports')) && currentPath.value.includes('/sports')) ||
        ((props.item.name === Sports.Sports || props.item.name === Sports.ESports) && config.public.isHideSports !== 'false') || (props.item.name === Lottery.Lottery && config.public.isHideLottery !== 'false')) {
        return ''
      }
      return props.item.path
    })

    const handleLinkClick = () => {
      timeFilter.value = TimeIntervals.All
      setActive(props.item)
     if (activeSubcategory.value !== props.item.name && !((props.item.name === Sports.Sports || props.item.name === Sports.ESports) && config.public.isHideSports !== 'false')) {
        activeSubcategory.value = props.item.name
      } else {
        activeSubcategory.value = ''
      }
    }

   /*  ((activeSubcategory.value === '' || (activeSubcategory.value === Sports.ESports || activeSubcategory.value === Sports.Sports)) &&
     !((props.item.name === Sports.Sports || props.item.name === Sports.ESports) && config.public.isHideSports !== 'false') &&
     !(props.item.name === Lottery.Lottery && config.public.isHideLottery !== 'false') && store.menu.value) ||
      (activeSubcategory.value !== props.item.name && !(props.item.name === Sports.Sports || props.item.name === Sports.ESports) && config.public.isHideSports !== 'false') */

    const handleNavClick = (obj) => {
      if (activeLeagues.value === '' || activeLeagues.value !== obj.name) {
        activeLeagues.value = obj.name
      } else {
        activeLeagues.value = ''
      }
    }

    const resolveLinkClass = (obj) => {
      if ((isHoverSubcategory.value === obj.name) || (currentPath.value.includes(obj.link) && !obj.isHeadPage) || (currentPath.value === '/sports/' && obj.link === '/sports/') || (currentPath.value === '/e-sports/' && obj.link === '/e-sports/') || (currentPath.value === '/sports' && obj.link === '')) {
        return true
      } else {
        return false
      }
    }

    const color = computed(() => {
      if (props.item.name.includes('Coming Soon') || ((props.item.name === Sports.Sports || props.item.name === Sports.ESports) && config.public.isHideSports !== 'false') || (props.item.name === Lottery.Lottery && config.public.isHideLottery !== 'false')) {
        return { color: '#6F6C75', cursor: 'cursor-default' }
      }

      if (currentPath.value.includes(`/${props.item.name.toLowerCase()}`) || (currentPath.value.includes(`/profile`) && store.activeProfileIndex.value === 1 && props.item.name === 'Farming') || (currentPath.value.includes(`/profile`) && store.activeProfileIndex.value === 2 && props.item.name === 'Staking')) {
        return { color: '#9E68FF', cursor: '' }
      }
      return { color: iconColor.value, cursor: '' }
    })

    const resolveClass = computed(() => {
      if ((currentPath.value.includes(`/${props.item.name.toLowerCase()}`) || (currentPath.value.includes(`/profile`) && store.activeProfileIndex.value === 1 && props.item.name === 'Farming')) ||
        currentPath.value.includes(`/${props.item.name.toLowerCase()}`) ||
        (currentPath.value.includes(`/profile`) && store.activeProfileIndex.value === 1 && props.item.name === 'Farming') ||
        (currentPath.value.includes(`/profile`) && store.activeProfileIndex.value === 2 && props.item.name === 'Staking')) {
        return 'active-item'
      }
      return ''
    })

    const setActive = (item) => {
      if (item.active) {
        store.activeProfileIndex.value = item.active
      }
    }
    return {
      currentPath,
      route,
      menu,
      setActive,
      color,
      iconColor,
      isHover,
      store,
      resolveClass,
      activeSubcategory,
      isHoverSubcategory,
      config,
      activeLeagues,
      link,
      handleLinkClick,
      resolveLinkClass,
      Sports,
      handleNavClick,
      Lottery
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-radius: 12px;

  padding: 15px;

}

.img {
  min-width: 24px;
}

.item {
  border-bottom: 1px solid transparent;
  border-radius: 12px;
  @apply flex justify-between items-center;

  &:hover {
    border-radius: 12px;
    overflow: hidden;
    background: #2C2634;

  }
}

.active-item {
  opacity: 1 !important;
  background: #2C2634;

}

.active-arrow {
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 10px;
}

.detail {
  row-gap: 10px;
  column-gap: 8px;
}

.name {

  font-weight: 700;
  color: rgba(255, 255, 255, 0.87);
}

@media (max-width: 768px) {
  .item {
    transition: none;
    width: 100%;

    .list {
      gap: 5px;
      align-items: center;
    }
  }

  .item:hover {
    opacity: 1;

    .img {
      filter: brightness(0) invert(1);
    }

    .name {
      color: white;
      font-size: 18px;
    }
  }
}
</style>
