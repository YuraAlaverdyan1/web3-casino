<template>
  <div class="container p-10">
    <div :style="`color: ${titleColor}`" class="lottery-title text-2xl">
      {{ title }}
    </div>
    <ul class="pl-6 mt-2">
      <li v-for="(el, index) of subtitles" :key="index" class="li font-medium">
        {{ el }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        subtitles: {
            type: Array as PropType<Array<string>>,
            required: true,
            default: () => []
        },
        titleColor: {
          type: String,
          default: 'white'
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F;
        border-radius: 12px;
        width: 100%;
        transition: 0.4s;
        &:hover {
          background: #2C2634;
        }
    }
    .li {
        font-weight: normal !important;
        font-size: 18px;
        color: #E6E6E6;
        list-style-type:disc;
    }
</style>
