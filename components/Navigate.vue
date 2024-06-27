<template>
  <div class="nav-container min-h-[56px]">
    <div
      class="navigate transition-all duration-300 absolute top-0 left-0 flex lg:items-start pt-[16px] flex-col"
      :class="menu ? 'openedMenuNav min-h-[2000px] lg:min-h-fit max-h-[90vh] lg:max-h-[2000px]' : 'min-h-[56px] max-h-[72px] lg:max-h-fit lg:pl-[105px]'"
    >
      <div class="nav-items flex justify-between items-center w-full mb-[16px] lg:pr-[42px]">
        <div data-aos="fade-right" data-aos-once="true" data-aos-delay="700" class="relative lg:hidden">
          <img
            v-if="!isLarge"
            alt="logo"
            src="/images/nav/logo-small.svg"
            class="transition-all duration-300 ml-[5px] w-full"
            @click="$router.push('/')"
          >
          <div class="absolute left-[45px] top-[50%] -translate-y-[50%] w-[100px] overflow-hidden">
            <img
              v-if="!isLarge"
              alt="logo"
              src="/images/nav/ridotto-logo.svg"
              class="transition-all duration-300"
              :class="menu ? 'translate-x-[0px]' : '-translate-x-[300px]'"
              @click="$router.push('/')"
            >
          </div>
        </div>
        <div
          v-if="isLarge"
          data-aos="fade-right"
          data-aos-once="true"
          data-aos-delay="700"
          class="part-3 search_container"
        >
          <img src="/images/nav/search.png">
          <CustomInput
            :text="inputText"
            :type="'text'"
            :placeholder="$t('searchGames')"
            :fail="inputFail"
            :border-color="'#424245'"
            :fill="false"
            class="search outline-none"
            @input-text="(e) => inputText = e"
          />
          <div v-if="inputText" v-click-outside="clearInput" class="search_container_results">
            <div v-for="(game, index) of searchedGames" :key="index" @click="inputText = ''">
              <NuxtLink
                :to="game.link && `/games/${game.formattedName}`"
                class="search_container_results_container"
                :class="!game.link ? 'search_container_results_container_disabled' : ''"
              >
                <img :src="`/games/${game.formattedName}/modal-logo.webp`" alt="game_icon">
                <div class="search_container_results_container_info">
                  <h3 class="capitalize" :class="currentPath.includes(game.name) ? 'text-[#9E68FF]' : ''">
                    {{ game.name }}
                  </h3>
                  <p class="capitalize">
                    {{ game.type }} Game
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
          class="flex items-center transition-all w-full ss:w-fit justify-center"
          :class="menu ? '-translate-y-[200px] sm:translate-y-0' : 'translate-y-[0px]'"
        >
          <div
            v-if="account.address && config.public.isHideRefferal !== 'true'"
            title="Claim Daily Rewards"
            class="claim-prize font-bold mr-6 "
            @click="() => handleNoreward()"
          >
            <div class="hover:opacity-75 cursor-pointer flex gap-2 ">
              <img src="/svgs/diamond.svg" class="w-[24px]">
              {{ currentClaimable.amount }}
            </div>
            <claim-modal />
            <noreward-modal />
          </div>
          <div
            class="flex gap-[24px] items-center"
            :data-aos="isSmall ? 'fade-down' : 'fade-left'"
            data-aos-once="true"
            data-aos-delay="700"
          >
            <div
              class="hidden  py-[10px] px-[16px] lg:flex gap-[8px] bg-[#413C48] rounded-[12px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
              @click="showBuyModal = !showBuyModal"
            >
              <img src="/svgs/rdt.svg" class="w-[20px] h-[20px]">
              <p class="text-[14px] font-[700]">
                Buy RDT Token
              </p>
            </div>
            <ConnectWallet />
          </div>
        </div>
        <ModalsPrivacyModal
          v-if="privacyActive"
          :active="privacyActive"
          :is-small="true"
          class="tickets-modal"
          @close="privacyActive = false"
        />
        <div v-if="!isLarge" data-aos="fade-left" data-aos-once="true" data-aos-delay="700" class="relative">
          <img
            v-if="!isLarge"
            src="/images/nav/open-menu-icon.svg"
            class="mr-[24px] transition-all duration-500"
            :class="menu ? '-rotate-[45deg] opacity-0' : ' opacity-100 rotate-0'"
            @click="openMenu"
          >

          <img
            v-if="!isLarge"
            src="/images/nav/close.svg"
            class="mr-[24px] transition-all duration-500 absolute -right-[9px] -top-[2px] opacity-0"
            :class="menu ? 'rotate-[0deg] opacity-100' : ' rotate-[45deg]'"
            @click="openMenu"
          >
        </div>
      </div>
      <div
        :class="addScroll ? 'overflow-y-auto' : 'overflow-y-hidden'"
        class="max-h-[90vh] lg:max-h-[558px] overflow-x-hidden"
      >
        <div v-for="(item, index) of MenuMobile" :key="index" class="lg:mt-[35px] mt-[10px] ml-[8px] lg:hidden w-full">
          <MenuItem :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBreakpoints } from '@vueuse/core'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { useSigning } from '~/composables/useSigning'
import { useMenu } from '~/composables/useMenu'
import MenuMobile from '~/data/menu'
import { BreakPoint } from '~/model/break-points'
import gamesInfo from '~/data/ridotto-originals.json'
import { useDailyReward } from '~/composables/useDailyReward'
import ClaimModal from '~/components/organisms/modals/claim-modal.vue'
import NorewardModal from '~/components/organisms/modals/noreward-modal.vue'

export default {
  components: { ClaimModal, NorewardModal },
  setup() {
    const {
      setClaimed,
      claimPrize,
      currentClaimable,
      setNoreward
    } = useDailyReward()
    const breakpoints = useBreakpoints(BreakPoint)
    const { account } = useWalletConnect()
    const { getCurrentTermByUser } = useSigning()
    const router = useRouter()
    const route = useRoute()
    const inputText = ref<string>('')
    const inputFail = ref<boolean>(false)
    const connected = ref<boolean>(false)
    const privacyActive = ref(false)
    const searchedGames = ref([])
    const { menu, openMenu, showBuyModal } = useMenu()
    const lang = ref({ code: 'ENG' })
    const mouseDown = (e) => {
      e.target.style.color = '#FFDC7E'
    }
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()

    const isSmall = computed(() => breakpoints.smaller('lg').value)
    const isLarge = computed(() => breakpoints.lg.value)
    const styles = computed(() => {
      return isSmall.value ? 'width: 340px; height: 450px;' : 'width: 600px; height: 500px; overflow-y: auto;'
    })
    const isNotLarge = computed(() => !breakpoints.lg.value)
    const mouseLeave = (e) => {
      e.target.style.color = ''
    }
    const currentPath = computed(() => {
      return route.path
    })
    const clearInput = () => inputText.value = ''

    function handleNoreward() {
      setNoreward(true)
    }

    watch(() => account.value, (newVal) => {
      setTimeout(async () => {
        if (newVal.address) {
          try {
            await getCurrentTermByUser()
          } catch (e) {
            privacyActive.value = true
          }
        }
      }, 1000)
    })
    watch(() => route, () => {
      inputText.value = ''
    }, { deep: true, immediate: true })

    async function handleClaim() {
      await claimPrize()
      setClaimed(true)
    }

    watch(() => inputText.value, (newVal) => {
      searchedGames.value = gamesInfo.games.filter(game => game.name.includes(newVal.toLowerCase()) || game.type.includes(newVal.toLowerCase()))
    })

    return {
      mouseDown,
      mouseLeave,
      breakpoints,
      menu,
      lang,
      MenuMobile,
      privacyActive,
      currentPath,
      connected,
      isNotLarge,
      router,
      styles,
      isSmall,
      inputText,
      openMenu,
      inputFail,
      isLarge,
      searchedGames,
      clearInput,
      showBuyModal,
      handleClaim,
      currentClaimable,
      account,
      handleNoreward,
      config
    }
  }

}
</script>

<style lang="scss" scoped>
.nav-container {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.networkModal {
  background-color: #251F2D;
  padding: 50px;

  img {
    padding-right: 10px;
    width: 30px;
    display: inline-block;
  }

  h1 {
    @screen sm {
      font-size: 32px;
    }

    font-size: 24px;
    color: white;
    font-weight: 600;
  }

  p {
    padding: 1rem 0rem;
  }

  button {
    padding: 10px;
    border: 1px solid #413c48;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    color: #f6f5fb;
    border-radius: 5px;
    transition-duration: .3s;
  }

  button:hover {
    background-color: #413c48;
  }

  &--content-buttons {
    div {
      padding: 5px 0px;
    }
  }
}

.search_container {
  position: relative;

  ::-webkit-scrollbar {
    width: 6px !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &_results {
    position: absolute;
    width: 100%;
    max-height: 200px;
    background-color: #201A29;
    border-radius: 12px;
    border: 1px solid #424245;
    top: 110%;
    overflow: auto;

    &_container {
      display: flex;
      gap: 15px;
      padding: 12px 16px;
      align-items: center;

      &:hover {
        background-color: #38333F;
        cursor: pointer;
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      &_info {
        display: flex;
        flex-direction: column;

        h3 {
          font-weight: 700;
          font-size: 16px;
        }

        p {
          font-size: 12px;
        }
      }

      &_disabled {
        cursor: not-allowed !important;
      }
    }
  }
}

.header {
  color: #6F6C75;
  transition: .1s;

  &:hover {
    opacity: .8;
  }
}

.navigate {
  background: #251F2D;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0px 4px 10px rgba(18, 18, 18, 0.25);
  min-height: 70px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding-left: 20px;

  @media only screen and (max-width:1216px) {
    overflow: hidden;
  }
}

.openedMenuNav {
  @screen lg {
    height: auto;
    padding-left: 280px !important;
  }
}

.line {
  background: #413c48;
  height: 1px;
  width: 100%;
}

.active-header {
  border-bottom: 1px solid #9E68FF;
  color: white !important;
}

.navigate,
.part-1,
.part-2,
.part-3,
.part-4 {
  display: flex;
  align-items: center;
}

.part-3 {
  position: relative;
}

.part-4 {
  gap: 5px;
}

.part-3>img {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  margin: auto;
}

.search {
  height: 45px !important;
  border-radius: 10px;
  transition: 0.2s;

  @screen lg {
    width: 270px;
    font-size: 18px;
    padding-left: 50px !important;
  }

  width: 150px;
  font-size: 12px;
  padding-left: 40px !important;
}

.part-2 {
  gap: 10px;
  color: rgba(255, 255, 255, 0.87);
}

.chains {
  padding-bottom: 10px;

  ::-webkit-scrollbar {
    width: 20px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #9E68FF;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #9E68FF;
  }
}
</style>
