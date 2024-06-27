<template>
  <div ref="gameElement" v-click-outside="() => doSomething('')" class="game-container p-7 py-10" @click="() => doSomething('2px solid #424245')">
    <a href="#">
      <div class="flex justify-between items-center">
        <div class="flex items-center w-full gap-4">
          <img :src="image" class="w-10">
          <button class="lottery-title text-lg flex items-center gap-2">
            {{ title }}
            <img v-if="editable" type="image" src="/images/nav/arrow-right.png" style="transform: rotate(-90deg)">
            <img v-else src="/images/lottery/buy-tickets-modal/direct-purple.png">
          </button>
        </div>
        <input v-if="editable" type="image" src="/images/profile/user-info/edit.png">
      </div>
      <div class="mt-8 flex flex-col gap-4">
        <div v-for="(detail, index) of details" :key="index" class="flex justify-between default-text">
          {{ detail.key }}
          <div class="text-white font-semibold">
            <img v-if="detail.value.type === 'image'" :src="detail.value.text">
            <div v-else :style="`color: ${detail.value.color}`">
              {{ detail.value.text }}
            </div>
          </div>
        </div>
      </div>
      <button v-if="linkText" class="flex items-center gap-2 lottery-title text-lg mt-8">
        {{ linkText }} <img src="/images/lottery/buy-tickets-modal/direct.png">
      </button>
    </a>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
    props: {
        image: {
            type: String,
            required: true,
            default: ''
        },
        title: {
            type: String,
            required: true,
            default: ''
        },
        editable: {
            type: Boolean,
            required: true,
            default: false
        },
        details: {
            type: Array as PropType<Array<any>>,
            required: true,
            default: () => []
        },
        linkText: {
            type: String,
            required: true,
            default: ''
        }
    },
    setup() {
      const gameElement = ref()

      const doSomething = (border: string) => {
        gameElement.value.style.border = border
      }

      return {
        gameElement,
        doSomething
      }
    }
}
</script>

<style lang="scss" scoped>
    .game-container {
        background: #201A29;
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        transition: .1s;
        &:hover {
          background: #2C2634;
        }
    }
</style>
