<template>
  <div class="video-poker-info">
    <div
      v-for="(info, index) of data"
      :key="index"
      class="info-element"
      :class="{ highlighted: combination === info.name.toLowerCase() }"
    >
      <div class="name" :class="!table && 'disabled'">
        <div class="name_content">
          <o-tooltip multiline>
            <template #content>
              <h1>
                {{ info.name }}
              </h1>
              <p>
                {{ winCombinations[info.name.toLowerCase()].placeholder }}
              </p>
            </template>
            <o-button>i</o-button>
          </o-tooltip>
          {{ info.name }}
        </div>
        <div class="info-element_images">
          <img
            v-for="(image, i) in winCombinations[info.name.toLowerCase()].value"
            :key="i"
            alt="card"
            :src="`/games/video-poker/cards/${image}.png`"
          >
        </div>
      </div>
      <div class="multiplier">
        {{ info.multiplier }}{{ info.multiplier < 10 ? ".00" : "" }}x
      </div>
      <div class="multiplier-usdt" :class="!table && 'disabled'">
        <img src="/tokens/usdt.png"> {{ info.multiplier }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import videoPokerInfo from '~/data/video-poker-info.json'
import winCombinations from '~/data/games/video-poker/win-combinations.json'
import { useVideoPoker } from '~/composables/games/useVideoPoker'
const props = defineProps({
  table: {
    type: Boolean,
    required: true
  }
})

const { combination } = useVideoPoker()

const data = computed(() => {
  return props.table ? videoPokerInfo : [videoPokerInfo[0]]
})
</script>

<style lang="scss" scoped>
.multiplier {
  background: #2c2634;
  @apply text-center justify-center;
}
.video-poker-info {
  border-radius: 12px;
  .highlighted {
    div {
      background: #9e68ff !important;
    }
  }
}

.info-element {
  border-bottom: 1px solid #2c2d3a;
  display: flex;
  justify-content: center;
  position: relative;
  .name {
    padding: 0 40px;
    text-wrap: nowrap;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    div {
      width: max-content;
      padding: 5px 0;
    }
  }
  div {
    @apply w-full p-2 flex items-center gap-2;
  }
  &_images {
    display: flex;
    img {
      height: 40px;
      object-fit: contain;
    }
  }
  &_placeholder {
    width: 20px !important;
    height: 20px;
    border: 1px solid #f5f5f7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.name,
.multiplier-usdt {
  background: #201a29;
  padding-left: 25px;
}

.name {
  font-size: 14px;
}

.disabled {
  background: #201a29 !important;
}
</style>
<style lang="scss">
.v-popper__popper {
  display: flex;
  flex-direction: column;
  div {
    background-color: #2c2634 !important;
    border-radius: 8px !important;
  }
}

.o-tip__content {
  width: 230px !important;
  background-color: #2c2634 !important;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 15px;
  white-space: wrap;
  text-wrap: wrap;
  overflow-wrap: break-word;
  p {
    width: 100%;
    white-space: wrap;
    text-wrap: wrap;
    overflow-wrap: break-word;
  }
  padding: 16px !important;
  text-align: start;
  z-index: 9999;
}
.o-tip__trigger {
  button {
    background: transparent !important;
    border: 1px solid #f5f5f7 !important;
    border-radius: 50% !important;
    width: 24px;
    height: 24px;
    margin: 0 !important;
  }
  .o-btn__label {
    margin-left: 0;
  }
  aspect-ratio: 1 / 1;
}
</style>
