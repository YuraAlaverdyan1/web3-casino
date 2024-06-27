<template>
  <div class="flex justify-between">
    <div class="flex gap-4">
      <StakingBtn
        :fill="true"
        :color="active === 0 ? '#6600FF' : '#2C2634'"
        :active="active === 0"
        class="text-base w-20 h-12"
        @click="active = 0; $emit('all')"
      >
        All Bets
      </StakingBtn>
      <StakingBtn
        :fill="true"
        :color="active === 1 ? '#6600FF' : '#2C2634'"
        :active="active === 1"
        class="text-base w-20 h-12"
        @click="active = 1; $emit('mine')"
      >
        My Bets
      </StakingBtn>
    </div>
    <div v-if="showArrows" class="flex gap-2 text-white">
      <button class="all text-base" @click="$emit('all')">
        All
      </button>
      <button
        class="prev"
        :class="(disableButtons || activeItem === 0) ? 'opacity-50 cursor-default' : 'active:scale-[.95]'"
        @click="$emit('prev')"
      >
        <svg
          class="m-auto"
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 1L1 5L5 9" stroke="#F5F5F7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        class="next"
        :class="(disableButtons || activeItem && activeItem === activeItem) ? 'opacity-50 cursor-default' : 'active:scale-[.95]'"
        @click="$emit('next')"
      >
        <svg
          class="m-auto"
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 9L5 5L0.999999 1"
            stroke="#F5F5F7"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <SelectBtn v-if="!isSmall" :text="sortCount" :items="sortCounts" @select="(e) => handleSortCount(e)" />
  </div>
</template>

<script lang="ts">
import {
  ref
} from 'vue'
export default {
  emits: ['all', 'mine', 'prev', 'next', 'all'],
  props: {
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    },
    disableButtons: {
      type: Boolean,
      required: false,
      default: false
    },
    activeItem: {
      type: Number,
      required: false,
      default: 0
    },
    items: {
      type: Number,
      required: false,
      default: 0
    },
    showArrows: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const active = ref<number>(0)
    const sortCount = ref<string>('10')
    const sortCounts = ref([
      '10',
      '15',
      '20'
    ])
    const handleSortCount = (el) => {
      sortCount.value = el
    }

    return {
      active,
      sortCount,
      handleSortCount,
      sortCounts
    }
  }
}
</script>

<style lang="scss" scoped>
.prev,
.next,
.all {
  border: 0.5px solid rgba($color: #E6E6E6, $alpha: 0.4);
  width: 40px;
  border-radius: 7px;
  height: 40px;
  scale: 1;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
