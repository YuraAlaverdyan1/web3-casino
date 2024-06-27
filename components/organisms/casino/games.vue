<template>
  <div class="my-[16px] lg:my-10" :class="line === 2 ? 'rows-2' : ''">
    <div class="flex justify-between" :class="isProfile && 'px-[24px]'">
      <div data-aos="fade-right" data-aos-delay="700" data-aos-once="true" class="lottery-title">
        {{ title }}
      </div>
      <LotteryArrows
        v-if="items.length > itemsToShow"
        data-aos="fade-left"
        data-aos-once="true"
        data-aos-delay="700"
        :disable-buttons="showAllItems"
        :all="items.length > itemsToShow && all"
        :active="active"
        :items="itemsToShow"
        class="hidden lg:flex"
        @show-all-items="items.length > itemsToShow ? (showAllItems = !showAllItems) : ''"
        @prev="active > 0 ? active-- : ''"
        @next="active < items.length - 4 ? active++ : ''"
      />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="false"
      :has-drag="true"
      class="mt-[20px]"
      :class="[
        isProfile && 'translate-x-[20px]',
        showAllItems ? 'hidden' : 'hidden lg:block',
      ]"
    >
      <o-carousel-item v-for="(item, index) of items" :id="item.formattedName" :key="index" :class="line === 2 ? 'row-2-item' : ''">
        <div data-aos="fade-up" data-aos-once="true" :data-aos-delay="index * 100" class="w-full h-full">
          <NuxtLink :to="item.link ? `/games/${item.link}` : ''" :e2e-id="`/games/${item.link}`">
            <div class="flex flex-col h-full w-[96%] scale-100 transition-all hover:scale-[1.02]">
              <div class="image_container h-[82%]">
                <img :src="item.image" class="w-full">
                <div v-if="!item.contracts[config.public.appEnvConfig].isActive" class="comingSoon">
                  <p>Coming Soon</p>
                </div>
              </div>
              <div class="bg-[#201A29] px-[16px] py-[8px] flex flex-col justify-between info">
                <div class="flex justify-between items-center">
                  <p class="text-[14px] capitalize">
                    {{ item.type }}
                  </p>
                  <img
                    src="/images/casino/info-icon.svg"
                    :title="item.tooltip"
                    @click="(e) => openModal(e, item.formattedName)"
                  >
                </div>
                <p class="text-[14px] font-[700] info_desc capitalize">
                  {{ item.name }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </o-carousel-item>
    </o-carousel>
    <o-carousel
      v-if="!isOneRow"
      v-model="secondSlider"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="false"
      :has-drag="true"
      class="mt-[20px]"
      :class="[
        isProfile && 'translate-x-[20px]',
        showAllItems ? 'hidden' : 'hidden lg:block',
      ]"
    >
      <o-carousel-item v-for="(item, index) of items" :id="item.id" :key="index" :class="line === 2 ? 'row-2-item' : ''">
        <div data-aos="fade-up" data-aos-once="true" :data-aos-delay="index * 100" class="w-full h-full">
          <NuxtLink :to="item.link ? `/games/${item.link}` : ''" :e2e-id="`carousel:/games/${item.link}`">
            <div class="flex flex-col h-full w-[96%] scale-100 transition-all hover:scale-[1.02]">
              <div class="image_container h-[82%]">
                <img :src="item.image" class="w-full">
                <div v-if="!item.contracts[config.public.appEnvConfig].isActive" class="comingSoon">
                  <p>Coming Soon</p>
                </div>
              </div>
              <div class="bg-[#201A29] px-[16px] py-[8px] flex flex-col justify-between info">
                <div class="flex justify-between items-center">
                  <p class="text-[14px] capitalize">
                    {{ item.type }}
                  </p>
                  <img
                    src="/images/casino/info-icon.svg"
                    :title="item.tooltip"
                    @click="(e) => openModal(e, item.formattedName)"
                  >
                </div>
                <p class="text-[14px] font-[700] info_desc capitalize">
                  {{ item.name }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </o-carousel-item>
    </o-carousel>
    <div
      class="grid-cols-2 sm:grid-cols-4 grid justify-between gap-x-[14px] lg:gap-x-[4px] gap-y-[35px] ss:gap-y-[24px] mt-[22px] px-[2px]"
      :class="!showAllItems && 'lg:hidden'"
    >
      <NuxtLink v-for="(item, index) of items" :key="index" :to="item.link ? `/games/${item.link}` : ''">
        <div class="flex flex-col h-full lg:w-[96%] scale-100 transition-all hover:scale-[1.02]">
          <div class="image_container h-[82%]">
            <img :src="item.image" class="w-full">
            <div v-if="!item.contracts[config.public.appEnvConfig].isActive" class="comingSoon">
              <p>Coming Soon</p>
            </div>
          </div>
          <div class="bg-[#201A29] px-[16px] py-[8px] flex flex-col justify-between info">
            <div class="flex justify-between items-center">
              <p class="text-[14px] capitalize">
                {{ item.type }}
              </p>
              <img
                src="/images/casino/info-icon.svg"
                :title="item.tooltip"
                @click="(e) => openModal(e, item.formattedName)"
              >
            </div>
            <p class="text-[14px] font-[700] info_desc capitalize">
              {{ item.name }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
    <games-help v-if="helpContainer" @close="helpContainer = false" @closed="helpContainer = false" />
  </div>
</template>

<script lang="ts">
import { PropType, ref, watch } from 'vue'
import gamesHelp from '~/components/organisms/modals/games-help.vue'
import { useMiniGames } from '~/composables/useMiniGames'

export default {
  components: {
    gamesHelp
  },
  props: {
    title: { type: String, requried: true, default: '' },
    all: { type: Boolean, required: true, default: false },
    itemsToShow: { type: Number, required: true, default: 1 },
    items: { type: Array as PropType<any>, required: true, default: () => [] },
    line: { type: Number, required: false, default: 1 },
    partnerShip: { type: Boolean, required: false, default: false },
    isProfile: { type: Boolean, required: false, default: false },
    isOneRow: { type: Boolean, required: false, default: false }
  },
  setup(props) {
    const active = ref(0)
    const secondSlider = ref(props.items.length - props.itemsToShow)
    const helpContainer = ref(false)
    const { currentGame } = useMiniGames()
    const showAllItems = ref(false)
     // eslint-disable-next-line no-undef
 const config = useRuntimeConfig()
    watch(
      () => showAllItems.value,
      () => {
        active.value = 0
        secondSlider.value = props.items.length - props.itemsToShow
      }
    )

    watch(
      () => active.value,
      (newValue, oldValue) => {
        if (newValue > oldValue) {
          secondSlider.value = secondSlider.value - 1
        } else if (newValue < oldValue) {
          secondSlider.value = secondSlider.value + 1
        }
      }
    )
    const openModal = (e, name) => {
      e.preventDefault()
      currentGame.value = name
      helpContainer.value = true
    }

    return {
      active,
      showAllItems,
      helpContainer,
      openModal,
      secondSlider,
      config
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  width: 90%;
}

.rows-2:deep(.o-car__items) {
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto auto;
}

.row-2-item {
  width: 100% !important;
}

.info {
  height: 64px;

  &_desc {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: 1216px) {
    height: 80px;
  }
}

.image_container {
  position: relative;

  img {
    height: 100%;
    width: 100%;
  }

  .comingSoon {
    background-color: transparent;
    height: 100%;
    width: 100%;
    position: absolute;
    bottom: 0;

    p {
      opacity: 0;
    }

    &:hover {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      backdrop-filter: blur(8px);
      font-weight: 900;
      font-size: 20px;
      letter-spacing: 2px;
      white-space: nowrap;

      p {
        opacity: 1;
        border-radius: 4px;
        background: #60f;
        padding: 8px 12px;
        color: #f5f5f7;
        font-variant-numeric: lining-nums proportional-nums;
        font-family: Exo 2;
        font-weight: 700;

        @screen xs {
          font-size: 16px;
        }

        @screen ss {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
