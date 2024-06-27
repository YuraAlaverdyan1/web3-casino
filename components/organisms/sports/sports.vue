<template>
  <div class="flex w-full flex-col lg:flex-row gap-[16px] -mt-[0px] md:mt-[40px] relative">
    <div
      class="lg:min-w-[calc(100%_-_400px)] lg:max-w-[calc(100%_-_400px)] lg:border-[1px] border-[#424245] rounded-[12px] px-[24px] lg:p-[24px] lg:bg-[#201A29] h-fit"
    >
      <div class="flex justify-between items-center mb-[24px] overflow-x-auto">
        <NuxtLink
          v-for="(item, index) of sportsItems"
          :key="index"
          :to="`/${currentPath.split('/')[1]}/${item.link}`"
          :class="linkResolve(item) ? 'border-[#9E68FF]' : 'border-[#424245]'"
          class="px-[5px] md:px-[0px] flex flex-col justify-between h-[35px] sm:h-[45px] w-full border-b-[1px] min-w-fit sm:pb-[5px] md:min-w-[48px]"
        >
          <sport-icons
            :icon-name="item.slug"
            :svg-color="linkResolve(item) ? '#9E68FF' : '#fff'"
            class="mx-auto my-auto scale-1 hover:scale-[1.05] transition-all hidden sm:block"
          />
          <menu-icons
            :icon-name="item.slug"
            :svg-color="linkResolve(item) ? '#9E68FF' : '#fff'"
            class="mx-auto my-auto scale-1 hover:scale-[1.05] transition-all h-[20px] w-[20px] sm:hidden "
            :class="item.link === '' || item.link === 'my-bets' ? 'scale-[1]' : 'scale-[1.1]'"
          />
          <p
            :class="linkResolve(item) ? 'text-[#9E68FF]' : 'text-[#fff]'"
            class="text-[10px] lg:text-[10px] font-[400] text-center cut-text"
          >
            {{ item.formattedName }}
          </p>
        </NuxtLink>
      </div>
      <div
        v-if="!route.path.includes('my-bets')"
        class="flex flex-col md:flex-row items-center gap-[20px] md:gap-[0px] justify-between mb-[24px]"
      >
        <div class="flex items-center gap-[10px]">
          <img src="/betting/ridotto-orange.svg">
          <p class="text-[20px] font-[700] text-[#FF6600]">
            Decentralized betting
          </p>
        </div>
        <div class="flex items-center gap-[9px]">
          <div class="flex items-center gap-[9px]">
            <div
              v-for="(item, index) of TimeIntervals"
              :key="index"
              class="cursor-pointer scale-100 hover:scale-[1.03] transition-all"
              @click="timeFilter = item"
            >
              <p class="text-[14px] font-[700]" :class="timeFilter === item ? 'border-b-[2px] border-[#fff]' : ''">
                {{ item }}
              </p>
            </div>
          </div>
          <div class="p-[4px] border-l-[1px] border-[#2C2634] relative">
            <img
              src="/betting/gear.svg"
              class="scale-100 hover:scale-[1.03] transition-all cursor-pointer"
              @click.stop.prevent="showDropDown = !showDropDown"
            >

            <div
              v-click-outside="clickOutside"
              :class="showDropDown ? 'max-h-[300px] border-[#424245] bg-[#251F2D]' : 'max-h-[0px] border-transparent bg-transparent'"
              class="absolute right-0 top-[30px] w-[139px] border-[1px] rounded-[12px]  z-[20] overflow-hidden transition-all"
            >
              <p
                class="text-[14px] font-[400] px-[16px] py-[12px] hover:bg-[#424245] cursor-pointer"
                :class="oddsFormat === 'uk' ? 'bg-[#424245]' : 'bg-transparent'"
                @click="[oddsFormat = 'uk', showDropDown = false]"
              >
                UK odds (1/2)
              </p>
              <p
                class="text-[14px] font-[400] px-[16px] py-[12px] hover:bg-[#424245] cursor-pointer"
                :class="oddsFormat === 'eu' ? 'bg-[#424245]' : 'bg-transparent'"
                @click="[oddsFormat = 'eu', showDropDown = false]"
              >
                E.U Odds (1.5)
              </p>
              <p
                class="text-[14px] font-[400] px-[16px] py-[12px] hover:bg-[#424245] cursor-pointer"
                :class="oddsFormat === 'us' ? 'bg-[#424245]' : 'bg-transparent'"
                @click="[oddsFormat = 'us', showDropDown = false]"
              >
                US odds (-200)
              </p>
            </div>
          </div>
        </div>
      </div>
      <slot />
    </div>
    <my-bets />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { TimeIntervals, useAzuro } from '../../../composables/useAzuro'
import ridottoOriginals from '~/data/ridotto-originals'
import { useMenu } from '~/composables/useMenu'
import sportIcons from '~/components/svgs/sports-icon.vue'
import MenuIcons from '~/components/svgs/menu-icons.vue'
import MyBets from '~/components/organisms/sports/my-bets.vue'

export default {
  components: {
    sportIcons,
    MyBets,
    MenuIcons
  },
  props: {
    sportsItems: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { menu } = useMenu()
    const route = useRoute()
    const { timeFilter, oddsFormat } = useAzuro()
    const showDropDown = ref(false)
    const currentPath = computed(() => {
      return route.path
    })

    const linkResolve = (item) => {
      return (currentPath.value.includes(`/${item.link}`) && item.link) || (!item.link && ((currentPath.value === '/sports' || currentPath.value === '/sports/') || (currentPath.value === '/e-sports' || currentPath.value === '/e-sports/')))
    }

    const clickOutside = () => {
      if (showDropDown.value) {
        showDropDown.value = false
      }
    }

    return {
      menu,
      ridottoOriginals,
      currentPath,
      linkResolve,
      TimeIntervals,
      timeFilter,
      showDropDown,
      oddsFormat,
      clickOutside,
      route
    }
  }
}
</script>

<style lang="scss" scoped>
.closed-menu {
  width: 89vw;
}

.opened-menu {
  width: 77vw;
}
</style>
