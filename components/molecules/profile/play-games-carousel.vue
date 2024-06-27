<template>
  <div>
    <div class="text-[18px] font-[700] mb-[16px]">
      {{ title }}
    </div>
    <div class="flex items-center justify-between gap-[24px]">
      <div v-for="(item, index) of games" :key="index" class="w-full">
        <div class="item flex flex-col sm:gap-4">
          <a href="#">
            <div class="image-container">
              <img :src="item.image">
            </div>
            <div v-if="!isSmall">
              <div class="name flex">
                <div class="default-text text-[14px] font-[400]">
                  {{ item.type }}
                </div>
                <div class="text-white text-bold text-[14px]">
                  {{ item.name }}
                </div>
              </div>
              <div class="wagered">
                <div class="default-text text-[14px] font-[400]">
                  Wagered
                </div>
                <div class="text-white text-bold text-[14px]">
                  {{ item.wagered }}
                </div>
              </div>
            </div>
            <div v-if="isSmall" class="p-3">
              <div class="lottery-title text-lg">
                {{ item.name }}
              </div>
              <div class="flex justify-between items-center">
                <div class="text-white text-xs">
                  {{ item.type }}
                </div>
                <div class="flex items-center gap-1 default-text">
                  <img :src="`/images/${item.token}.png`">
                  {{ item.percent }}
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    games: {
      type: Array as PropType<Array<any>>,
      required: true,
      default: () => []
    },
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const active = ref(0)
    return {
      active
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes hover {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: .5;
  }
  100% {
    transform-origin: top;
    transform: scale(1.1);
    opacity: 1;
  }
}
@keyframes afterHover {
  0% {
    transform: scale(1.1);
    transform-origin: top;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
  }
}
.wagered {
  display: none;
}
.image-container {
  width: 100%;
  overflow: hidden;
}
.image-container > img {
  width: 100%;
  transition: .6s;
  animation: afterHover .6s forwards;
}
.name, .wagered {
  @apply flex-col mt-3
}
.item {
  position: relative;
  &:hover {
    .image-container > img {
      animation: hover .6s forwards;
    }
      .name {
        display: none !important;
      }
      .wagered {
        display: block;
      }
    }
}
@media (max-width: 768px) {
  :deep(.o-car__items) {
    display: grid !important;
    grid-template-columns: 48% 48%;
    grid-auto-rows: 50% 50%;
    gap: 5px;
  }
  :deep(.o-car__item) {
    width: 100% !important;
  }
  .item {
    background: linear-gradient(0deg, rgba(31, 192, 240, 0.05), rgba(31, 192, 240, 0.05)),
      #1c1b1f;
    backdrop-filter: blur(30px);
    border-radius: 0px 0px 20px 20px;
  }
}
</style>
