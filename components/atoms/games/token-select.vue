<template>
  <div>
    <div v-if="items.length === 0" class="w-full lg:w-auto max-w-[150px] cursor-pointer">
      <div
        v-if="selectedToken"
        style="
          border: 1px solid #424245;
          transition: 0.5s;
          border-radius: 12px;
          height: 48px;
        "
        class="w-full lg:max-w-[98px] bg-transparent btn pr-[4px] pl-[0px] min-w-[98px]"
        :class="[latestDraw ? 'w-full latest-draw-btn' : '']"
        @mouseenter="hoverSound()"
        @click="openDropdown()"
      >
        <span class="flex items-center gap-4 h-full">
          <div class="w-full flex items-center justify-between mx-[3px]">
            <img :src="`/tokens/rdt.png`">
            <p class="text-[14px] font-[700]">RDT</p>
            <img
              src="/images/nav/arrow.svg"
              class="arrow"
              :style="active ? 'transform:rotate(180deg)' : ''"
            >
          </div>
        </span>
      </div>
    </div>
    <div v-if="items.length > 0" class="token_select">
      <o-dropdown aria-role="list" class="w-full lg:w-auto max-w-[150px]">
        <template #trigger="{ active }">
          <o-button
            style="
              border: 1px solid #424245;
              transition: 0.5s;
              border-radius: 12px;
              height: 48px;
            "
            class="w-full lg:max-w-[98px] bg-transparent pr-[4px] pl-[0px] min-w-[98px]"
            :class="[latestDraw ? 'w-full latest-draw-btn' : '', active ? 'btn active' : 'btn']"
            @mouseenter="hoverSound()"
            @click="openDropdown()"
          >
            <span class="flex items-center gap-4">
              <div
                v-if="selectedToken.symbol"
                class="w-full flex items-center justify-between"
              >
                <img :src="`/tokens/${selectedToken.symbol.toLowerCase()}.png`">
                <p class="text-[14px] font-[700]">
                  {{ selectedToken.symbol }}
                </p>
                <img
                  src="/images/nav/arrow.svg"
                  class="arrow"
                  :style="active ? 'transform:rotate(180deg)' : ''"
                >
              </div>
              <div v-else class="w-full flex items-center justify-between">
                <img :src="`/tokens/rdt.png`">
                <p class="text-[14px] font-[700]">RDT</p>
                <img
                  src="/images/nav/arrow.svg"
                  class="arrow"
                  :style="active ? 'transform:rotate(180deg)' : ''"
                >
              </div>
            </span>
          </o-button>
        </template>
        <div v-if="!wallet">
          <o-dropdown-item
            v-for="(item, index) of items"
            :key="index"
            class="flex items-center gap-2 drop-item w-full bg-[#251F2D]"
            :class="selectedToken.symbol === item.symbol ? 'bg-[#2C2634]' : 'hover:bg-[#2C2634]'"
            aria-role="listitem"
            :style="itemStyles"
            @click="[$emit('select', item), selectDropdown()]"
          >
            <div v-if="typeof item !== 'object'" class="flex items-center gap-2">
              {{ item }}
              <img v-if="check" src="/public/images/nav/check.png">
            </div>
            <NuxtLink
              v-else
              :to="item.url"
              class="default-text flex items-center gap-2 py-2"
              :class="userNav ? 'user-nav icon' : ''"
            >
              <img
                :src="`/tokens/${item.symbol.toLowerCase()}.png`"
                style="width: 24px; height: 24px; object-fit: contain"
              >
              <p :class="selectedToken.symbol === item.symbol ? 'text-[#9E68FF]' : 'text-[#fff]'">
                {{ item.symbol }}
              </p>
            </NuxtLink>
          </o-dropdown-item>
        </div>
        <div v-else>
          <DepositContainer />
        </div>
      </o-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { useSound } from '../../../composables/useSound'
import { useMiniGames } from '~/composables/useMiniGames'

export default {
  props: {
    items: { type: Array as PropType<Array<any>>, default: () => [], required: true },
    latestDraw: { type: Boolean, required: false, default: false },
    wallet: { type: Boolean, required: false, default: false },
    userNav: { type: Boolean, required: false, default: false },
    check: { type: Boolean, required: false, default: true },
    itemStyles: { type: String, required: false, default: '' }
  },
  emits: ['select'],
  setup() {
    const { selectedToken } = useMiniGames()
    const { hoverSound, openDropdown, selectDropdown } = useSound()
    return {
      selectedToken,
      hoverSound,
      openDropdown,
      selectDropdown
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-drop__menu) {
  padding: 0 !important;
  border-radius: 12px;
  border: 1px solid #424245;
  background: #251F2D;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  top: 118% !important;
}

.drop-item::hover {
  background: rgba($color: #fff, $alpha: 0.01) !important;
  color: rgb(31, 192, 240) !important;
}

.btn,
:deep(.o-drop__item) {
  background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)),
    #1c1b1f;
  color: white !important;
}

.btn.active {
  border: 1px solid #fff !important
}

.token_select {
  :deep(.o-drop--mobile > .o-drop__menu) {
    position: static;
  }
}

.active-btn {
  background: #6600ff !important;
}

.disabled-btn {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)),
    #1c1b1f;
}

.latest-draw-btn {
  border: 1px solid rgba($color: #e6e6e6, $alpha: 0.5) !important;
  color: #e6e6e6;
  background: rgba($color: #000000, $alpha: 0);
}

.lang-btn {
  height: 55px;
  width: 120px;
  margin-left: 10px;
  background: rgba($color: #000000, $alpha: 0);
  border: 1px solid rgba($color: #8d8686, $alpha: 0.5) !important;
}

.token_icon {
  min-width: 25px;
}

.arrow {
  transition: 0.5s;
}

.btn:hover {
  background: #413c48;
}

.user-nav {
  width: 100%;
  height: 35px;
  border-radius: 12px;
  transition: 0.4s;
  padding-left: 10px;
  margin: 5px 0;
}

.user-nav:hover {
  background: #6600ff;
}

@media (max-width: 1216px) {
  .lang-btn {
    width: 100% !important;
    height: 50px !important;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .lang-btn {
    padding: 0 !important;
    padding-left: 20px !important;
  }
}
</style>
