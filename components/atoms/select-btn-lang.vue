<template>
  <o-dropdown aria-role="list">
    <template #trigger="{ active }">
      <o-button
        style="
          transition: 0.5s;
          border: none;
          border-radius: 12px;
          height: 48px;
          margin-bottom: 5px;
        "
        class="outline-none !bg-transparent "
        :class="[
          active ? 'active-btn' : 'disabled-btn',
          latestDraw ? 'w-full latest-draw-btn' : '',
          lang ? 'lang-btn' : '',
          isFullWidth ? 'w-full' : 'w-[120px]',
        ]"
      >
        <span class="flex items-center gap-4 pl-[3px] justify-between">
          <div v-if="image" class="flex gap-2">
            <img :src="image" class=" w-[20px] h-[20px]">
            <div v-if="menu" class="font-[700] text-[14px]">{{ text }}</div>
          </div>
          <div v-else-if="token" class="flex items-center gap-2  font-[700]">
            <img :src="`/images/lang/${text.toLowerCase()}.svg`" alt="lang">
            <p class="font-[700]">
              {{ text }}
            </p>
          </div>
          <div v-else style="font-size: 16px">
            <template v-if="isTokens">
              <div class="tokens">
                <img v-if="isTokens" :src="`/images/${text.symbol.toLowerCase()}.png`" alt="token">
                <p class="font-[700]">
                  {{ text.name }}
                </p>
              </div>
            </template>
            <template v-else>
              <p class="font-[700]">{{ text }}</p>
            </template>
          </div>
          <img
            src="/images/menu/arrow-right.svg"
            class="arrow w-[25px] mr-[1px]"
            :class="active ? 'rotate-[270deg]' : 'rotate-[90deg]'"
          >
        </span>
      </o-button>
    </template>
    <div v-if="!wallet">
      <o-dropdown-item
        v-for="(item, index) of items"
        :key="index"
        class="flex items-center justify-between drop-item bg-[#251F2D]"
        :class="item === text ? 'bg-[#2C2634] !text-[#9E68FF]' : 'hover:bg-[#2C2634]'"
        aria-role="listitem"
        @click="$emit('select', item)"
      >
        <div v-if="!item.url" class="flex items-center justify-between w-full">
          <img v-if="isTokens" :src="`/images/${item.symbol.toLowerCase()}.png`" class="token" alt="token">
          <div class="flex items-center gap-2">
            <img v-if="image" :src="`/images/lang/${item.toLowerCase()}.svg`" class="w-6">
            <template v-if="isTokens">
              {{ item.name }}
            </template>
            <template v-else>
              <p :class="item === text ? 'text-[#9E68FF]' : ''">
                {{ item }}
              </p>
            </template>
          </div>
        </div>
        <NuxtLink
          v-else
          :to="item.url"
          class="default-text flex items-center gap-2 py-2"
          :class="userNav ? 'user-nav' : ''"
        >
          <img :src="item.img" style="width: 30px; height: 30px">
          {{ item.title }}
        </NuxtLink>
      </o-dropdown-item>
    </div>
    <div v-else>
      <DepositContainer />
    </div>
  </o-dropdown>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { useMenu } from '~/composables/useMenu'
export default {
  props: {
    isFullWidth: { type: Boolean, default: false, required: false },
    text: { type: [String, Object], default: '', required: true },
    items: {
      type: Array as PropType<Array<any>>,
      default: () => [],
      required: true
    },
    latestDraw: { type: Boolean, required: false, default: false },
    wallet: { type: Boolean, required: false, default: false },
    image: { type: String, required: false, default: '' },
    lang: { type: Boolean, required: false, default: false },
    token: { type: String, required: false, default: '' },
    userNav: { type: Boolean, required: false, default: false },
    isTokens: { type: Boolean, required: false, default: false }
  },
  emits: ['select'],
  setup() {
    const store = useMenu()

    const menu = computed(() => {
      return store.menu.value
    })

    return {
      menu
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-drop__menu) {
  padding: 0 !important;
  min-width: 100px !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  width: 100% !important;
  background-color: transparent !important;
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

.active-btn {
  border: 1px solid #E6E6E6 !important;
}

.disabled-btn {
  border: 1px solid #424245 !important;
}

.latest-draw-btn {
  border: 1px solid rgba($color: #e6e6e6, $alpha: 0.5) !important;
  color: #e6e6e6;
  background: rgba($color: #000000, $alpha: 0);
}

.lang-btn {
  height: 55px;
  width: 120px;
  background: rgba($color: #000000, $alpha: 0);
  border: 1px solid rgba($color: #8d8686, $alpha: 0.5) !important;
}

.icon {
  min-width: 25px;
}

.tokens {
  display: flex;
  gap: 10px;
  align-items: center;

  img {
    height: 100%;
    object-fit: cover;
  }
}

.arrow {
  transition: 0.5s;
}

.token {
  width: 20px;
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

@media (max-width: 1550px) {
  .btn {
    width: 100px;
    font-size: 12px;
    padding-left: 10px !important;
  }
}

@media (max-width: 1216px) {
  .lang-btn {
    width: 100% !important;
    height: 50px !important;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .btn {
    padding: 22px 0px !important;
  }

  .lang-btn {
    padding: 0 !important;
    padding-left: 20px !important;
  }
}
</style>
