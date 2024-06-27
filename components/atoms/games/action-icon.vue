<template>
  <div>
    <div
      class="action-icon"
      :style="`background: url(${icon})`"
      @mouseover="(e) => mouseOver(e)"
      @mouseleave="(e) => mouseLeave(e)"
      @mousedown="(e) => mouseDown(e)"
      @click="name === 'help' && $emit('openHelpModal')"
    >
      <info-window v-if="name === 'info' && index === 0 && infoWindowActive" class="info-window">
        <p class="ss:whitespace-nowrap">
          {{ windowText }}
        </p>
      </info-window>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import infoWindow from '~/components/atoms/info-window.vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  hover: {
    type: String,
    required: true
  },
  selected: {
    type: String,
    required: true
  },
  disabled: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const infoWindowActive = ref(false)

const mouseLeave = (e) => {
  e.target.style = `box-shadow: none; background: url(${props.icon});background-repeat:no-repeat`
  if (props.name === 'info') {
    infoWindowActive.value = false
  }
}

const windowText = ref('The earned rewards are automatically transferred to your account in the next round')

const mouseDown = (e) => {
  e.target.style = `box-shadow: 0px 10px 20px 0px rgba(102, 0, 255, 0.50); background: url(${props.selected});background-repeat:no-repeat`
  if (props.name === 'info') {
    infoWindowActive.value = true
  }
}

const mouseOver = (e) => {
  e.target.style.background = `url(${props.hover});background-repeat:no-repeat`
  if (props.name === 'info') {
    infoWindowActive.value = true
  }
}
</script>

<style lang="scss" scoped>
.action-icon {
  background-repeat: no-repeat !important;
  background-size: contain !important;
  transition: .4s;
  @apply relative w-[32px] h-[32px] rounded-full cursor-pointer;
}
</style>
