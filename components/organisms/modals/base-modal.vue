<template>
  <div class="w-full h-full modal flex justify-center items-center">
    <div v-click-outside="() => $emit('closed')" class="modal-container" :style="styles" :class="[classes, prize ? 'prize-modal' : '', buyTickets ? 'buy-tickets-modal' : '']">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from 'vue'
export default {
    props: {
      prize: {
        type: Boolean,
        required: false,
        default: false
      },
      buyTickets: {
        type: Boolean,
        required: false,
        default: false
      },
      classes: {
        type: String,
        required: false,
        default: ''
      },
      styles: {
        type: String,
        required: false,
        default: ''
      }
    },
    emits: ['close'],
    setup() {
      onMounted(() => {
        document.body.style.overflow = 'hidden'
      })
      onUnmounted(() => {
        document.body.style.overflow = 'auto'
      })
    }
}
</script>

<style lang="scss" scoped>
.modal-container {
  z-index: 1000;
  width: 65%;
  height: 90%;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 15px;
  background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.prize-modal {
  padding: 30px;
  width: 50%;
  overflow: hidden;
  height: 80%;
}
.buy-tickets-modal {
  width: 80%;
  position: relative;
  background-color: #201A29;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: rgba($color: #000000, $alpha: 0.2);
  backdrop-filter: blur(10px);
}
</style>
