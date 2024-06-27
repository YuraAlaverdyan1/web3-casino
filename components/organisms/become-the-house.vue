<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <gaming-contest-modal
      :show-modal="showModal"
      :details="randomBanner.DetailsModal"
      @show-modal="(e) => (showModal = e)"
    />
    <div
      v-if="
        randomBanner &&
          randomBanner.RandomBackgrounds &&
          randomBanner.RandomBackgrounds.length > 0
      "
      class="w-full h-[277px] shadow bg-cover px-[24px] py-[20px] rounded-none md:rounded-[12px]"
      :class="[
        'bg-center',
        route.path.includes('/profile') &&
          activeProfileIndex === 2 &&
          'flex items-end'
      ]"
      :style="{
        '--random': `linear-gradient(94deg, rgba(23, 17, 32, 0.90) 30.93%, rgba(23, 17, 32, 0.25) 64.87%, rgba(23, 17, 32, 0.00) 98.49%),
        url('${randomBanner.RandomBackgrounds[randomShowBanner]}'),  lightgray 50% / cover no-repeat`
      }"
    >
      <div v-if="!isLeaderbord || showStake || route.path.includes('/profile')" class="h-full">
        <div class="flex flex-col items-between h-full justify-center gap-1">
          <p class="date text-[16px] md:text-[18px] font-[400]" v-html="randomBanner.TopTitle" />
          <p class="text-[20px] md:text-[24px] font-[400] flex items-end" v-html="randomBanner.SubTitle" />
          <p
            :class="`text-[26px] md:text-[48px] font-[700] -mt-[10px] text-[${colorThemme}]`"
            v-html="randomBanner.Title"
          />
          <div
            v-if="randomBanner.HasDetailsModal"
            class="min-w-[176px] w-full flex justify-center items-center gap-[8px] px-[16px] py-[12px] rounded-[12px] ss:w-fit translate-all scale-[1] hover:scale-[1.05] cursor-pointer duration-500"
            :style="`background: ${randomBanner.CTABackground ?? '#FF6600'};`"
            @click="showModal = true"
          >
            <img :src="randomBanner.CTAIcon ? randomBanner.CTAIcon : '/svgs/arrows.svg'" alt="switch icon">
            <p class="text-[16px] font-[700]">
              {{ randomBanner.CTAText }}
            </p>
          </div>
          <NuxtLink
            v-else-if="randomBanner.HasCTA"
            :to="randomBanner.CTALink"
            :class="`flex justify-center items-center gap-[8px] px-[16px] py-[12px] rounded-[12px] ss:w-fit mt-[30px] translate-all scale-[1] hover:scale-[1.05] cursor-pointer duration-500`"
            :style="`background: ${randomBanner.CTABackground ?? '#60F'};`"
          >
            <p class="text-[16px] font-[700]">
              {{ randomBanner.CTAText }}
            </p>
            <img :src="randomBanner.CTAIcon ? randomBanner.CTAIcon : '/images/nav/switch-icon.svg'" alt="switch icon">
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenu } from '~/composables/useMenu'
import { Banner, profileIndex, useCMS } from '~/composables/useCMS'
import GamingContestModal from '~/components/organisms/modals/gaming-contest-modal.vue'

export default {
  components: {
    GamingContestModal
  },
  props: {
    isLeaderbord: {
      type: Boolean,
      required: false,
      default: false
    },
    showStake: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const randomValue = ref(1)
    const randomShowBanner = ref(0)
    const colorThemme = ref('#B9FF6E')
    const route = useRoute()
    const { getGlobalBanners, globalBanners, strapiURL } = useCMS()
    const randomBanner = ref<Banner>({} as Banner)
    const showModal = ref(false)
    const { activeProfileIndex } = useMenu()

    getGlobalBanners()

    watch(
      () => [globalBanners, route, activeProfileIndex],
      () => {
        if (globalBanners.value.length === 0) {
          return
        }
        let filteredGlobalBanners: Banner[] = []
        if (route.path.includes('/profile')) {
          const findSpecialBanner = globalBanners.value.find(
            banner =>
              banner.Exclusive === profileIndex[activeProfileIndex.value]
          )
          if (findSpecialBanner) {
            randomBanner.value = findSpecialBanner
            randomShowBanner.value = Math.floor(
              Math.random() * findSpecialBanner.RandomBackgrounds.length
            )
            return
          }
        }
        filteredGlobalBanners = globalBanners.value.filter(
          banner => banner.Exclusive === 'Global'
        )
        randomValue.value =
          Math.floor(Math.random() * filteredGlobalBanners.length) + 1
        randomShowBanner.value = Math.floor(
          Math.random() *
            filteredGlobalBanners[randomValue.value - 1].RandomBackgrounds
              .length
        )
        randomBanner.value = globalBanners.value[randomValue.value - 1]
      },
      { deep: true }
    )

    return {
      activeProfileIndex,
      colorThemme,
      route,
      showModal,
      randomBanner,
      randomShowBanner,
      strapiURL
    }
  }
}
</script>

<style lang="scss" scoped>
.shadow {
  background: var(--random);
  overflow: hidden;
  background-blend-mode: multiply, normal;
}
</style>
