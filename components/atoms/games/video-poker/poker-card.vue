<template>
  <div>
    <div
      class="card"
      :style="cardImage"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
      @click="selectCard"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVideoPoker } from '~/composables/games/useVideoPoker'

const { selectedHand, status } = useVideoPoker()
const select1 = new Audio('~/public/sounds/video-poker/select1.wav')
const select2 = new Audio('~/public/sounds/video-poker/select2.mp3')
const isHovered = ref(false)

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const cardImage = computed(() => {
  if (props.card.number && props.selected) {
    return `background:url(/games/video-poker/cards/${props.card.number}-${
      props.card.suit
    }${isHovered.value ? '-hover' : ''}.png);`
  } else {
    return `background:url(/games/video-poker/cards/front${
      isHovered.value ? '-hover' : ''
    }.png)`
  }
})

const selectCard = () => {
  if (status.value) {
    if (selectedHand.value[props.index]) {
      select1.play()
    } else {
      select2.play()
    }
    selectedHand.value[props.index] = !selectedHand.value[props.index]
  }
}
</script>

<style lang="scss" scoped>
.card {
  cursor: pointer;
  transition: 0.3s;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  width: 8vw;
  height: 11.2vw;
}

@media (max-width: 1440px) {
  .card {
    width: 6.4vw;
    height: 9vw;
  }
}

@media (max-width: 1216px) {
  .card {
    width: 13vw;
    height: 18.2vw;
  }
}

@media (max-width: 540px) {
  .card {
    width: 110px;
    height: 155px;
  }
}
</style>
