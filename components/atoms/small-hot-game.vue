<template>
  <div class="relative">
    <img :src="image" class="w-full">
    <div class="flex justify-between items-center absolute top-0 bottom-0 left-0 right-0 m-auto px-4">
      <div class="title">
        {{ title }}
      </div>
      <div>
        <div class="title">
          {{ game }}
        </div>
        <div class="percent">
          {{ percent }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
        game: {
            type: String,
            required: true,
            default: ''
        },
        percent: {
            type: Number,
            required: true,
            default: 0
        }
    }
}
</script>

<style lang="scss" scoped>
    .percent {
        background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .title {
        color: white;
        font-size: 18px;
    }
</style>
