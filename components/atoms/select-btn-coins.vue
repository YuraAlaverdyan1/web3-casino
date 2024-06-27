<template>
  <o-dropdown aria-role="list">
    <template #trigger="{ active }">
      <o-button
        style="width:120px;border: none; border-radius: 15px; padding: 22px 30px;"
        class="btn"
        :class="[active ? 'active-btn' : 'disabled-btn', latestDraw ? 'w-full latest-draw-btn' : '', image ? 'lang-btn' : '', lang ? 'lang-btn' : '']"
      >
        <span class="flex items-center gap-2 px-2" :class="[latestDraw || image ? 'justify-between' : '']">
          <div v-if="image" class="flex gap-2">
            <img :src="image" class="icon">
            <div v-if="menu">{{ text }}</div>
          </div>
          <div v-else-if="token" class="flex items-center gap-2">
            <img :src="`/images/${token}.png`">
            {{ text }}
          </div>
          <div v-else>
            {{ text }}
          </div>
          <img src="/images/nav/arrow-right.png" :style="active ? 'transform:rotate(180deg)' : ''">
        </span>
      </o-button>
    </template>
    <div style="background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;">
      <div class="part-3">
        <img src="/images/nav/search.png">
        <input type="text" placeholder="Search Token" class="search">
      </div>
      <div class="content-items">
        <o-dropdown-item
          v-for="(item, index) of items"
          :key="index"
          aria-role="listitem"
          :style="item === text ? 'color: #1FC0F0 !important;' : ''"
          @click="void (0)"
        >
          <div class="coin-list">
            <div style="display: flex;align-items: center;">
              <img :src="item.img" style="padding-right: 10px;" class="w-6">
              {{ item.balance }}
            </div>
            <div>
              {{ item.coin }}
            </div>
          </div>
        </o-dropdown-item>
      </div>
      <div class="pt-2">
        <div class="item-switch">
          <div>Display in Fiat</div><div><o-switch /></div>
        </div>
        <div class="item-switch">
          <div>Hide 0 Balances</div><div><o-switch /></div>
        </div>
      </div>
    </div>
  </o-dropdown>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { useMenu } from '~/composables/useMenu'
export default {
  props: {
    text: { type: String, default: '', required: true },
    items: { type: Array as PropType<Array<any>>, default: () => [], required: true },
    latestDraw: { type: Boolean, required: false, default: false },
    image: { type: String, requried: false, default: '' },
    token: { type: String, required: false, default: '' },
    lang: { type: Boolean, required: false, default: false }
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
  :deep(.o-switch__check) {
      background: linear-gradient(0deg, rgba(31, 192, 240, 0.05), rgba(31, 192, 240, 0.05)), #1C1B1F;
    }
    :deep(.o-switch__check--checked) {
      background: #1FC0F0;
    }
:deep(.o-drop__menu) {
  background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;
  padding: 1rem;

}
.item-switch{
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top:1rem;
}
.search {
  border: 0.8px solid rgba($color: #E6E6E6, $alpha: 0.5);
  background: rgba(255, 255, 255, 0);
  height: 45px;
  border-radius: 10px;
  transition: 0.2s;
  color: white;
  width: 100%;
  font-size: 12px;
  padding-left: 40px;

  &:hover {
    opacity: 0.8;
    border-width: 1px;
  }
}

.part-3 {
  display: flex;
  position: relative;
  align-items: center;
}

.part-3 > img {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  margin: auto;
}

.content-items {
  padding: 1rem 0rem;
  border-bottom: 1px solid #37343d;
}

.o-drop__item:hover:not(.o-drop__item--active),
.o-drop__item[data-v-f469b615]:hover:not(.o-drop__item--active) {
  background: rgba($color: rgb(0, 0, 0), $alpha: 0.8) !important;
}

.drop-item::hover {
  background: rgba($color: #fff, $alpha: 0.01) !important;
  color: rgb(31, 192, 240) !important;
}

.coin-list {
  display: flex;
  width: 100%;
  justify-content: space-between;

}

.btn,
:deep(.o-drop__item) {
  background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;
  color: white !important;
}

.active-btn {
  background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%);
}

.disabled-btn {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #1C1B1F;
}

.latest-draw-btn {
  border: 1px solid rgba($color: #E6E6E6, $alpha: 0.5) !important;
  color: #E6E6E6;
  background: rgba($color: #000000, $alpha: 0);
}

.lang-btn {
  height: 55px;
  width: 90%;
  margin-left: 10px;
  background: rgba($color: #000000, $alpha: 0);
  border: 1px solid rgba($color: #8d8686, $alpha: 0.5) !important;
}

.icon {
  min-width: 25px;
}

@media (max-width: 1550px) {
  .btn {
    width: 100px;
    font-size: 12px;
    padding-left: 10px !important;
  }
}

@media (max-width: 768px) {
  .btn {
    padding: 22px 0px !important;
  }

  .lang-btn {
    width: 100%;
    font-size: 16px;
    padding-left: 20px !important;
  }
}</style>
