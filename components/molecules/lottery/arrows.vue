<template>
  <div class="flex gap-2 text-white">
    <button v-if="all" class="all text-base" @click="$emit('showAllItems')">
      All
    </button>
    <button
      class="prev"
      :class="(disableButtons || active === 0) ? 'opacity-50 cursor-default' : 'active:scale-[.95]'"
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
      :class="(disableButtons || active && active === items + 1) ? 'opacity-50 cursor-default' : 'active:scale-[.95]'"
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
</template>

<script lang="ts">
export default {
  props: {
    all: {
      type: Boolean,
      required: false,
      default: false
    },
    disableButtons: {
      type: Boolean,
      required: false,
      default: false
    },
    active: {
      type: Number || Boolean,
      required: false,
      default: false
    },
    items: {
      type: Number || Boolean,
      required: false,
      default: false
    }
  },
  emits: ['showAllItems']
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

  &:hover {
    opacity: 0.8;
  }
}
</style>
