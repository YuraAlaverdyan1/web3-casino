<template>
  <div
    class="rounded-lg p-[8px] w-full flex flex-col min-w-[185px] max-h-[60px]"
    :style="{ 'background-color': bgColor }"
  >
    <div class="flex items-center w-full">
      <div class="w-fit">
        <slot name="leftIcon" />
      </div>
      <div class="grow text-[14px] font-light ml-[5px]">
        {{ title }}
      </div>
      <div class="justify-self-end text-[14px] font-semibold">
        {{ rightText }}
      </div>
    </div>

    <div>
      <input
        v-model="inputText"
        class="range w-full"
        type="range"
        name="slider"
        :min="1"
        :max="100"
        :style="{ 'accent-color': accentColor }"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    progressBar: {
      type: Number,
      default: 10
    },
    rightText: {
      type: Number,
      default: 0
    },
    accentColor: {
      type: String,
      default: '#ff8000'
    },
    bgColor: {
      type: String,
      default: '#000'
    },
    changeInput: {
      type: Function,
      required: false,
      default: () => { }
    }
  },
  setup(props) {
    const inputText = ref<string | number>(props.rightText)

    watch(() => inputText.value, () => {
      props.changeInput(inputText.value)
    })

    return { inputText }
  }
}
</script>

<style scoped>
.range {
  background: #000;
  height: 4px;
  outline: none;
  cursor: pointer;
  transition: 0.4s all ease-out;
}
</style>
