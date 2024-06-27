<template>
  <div class="player-container flex items-center justify-between">
    <div class="flex items-center gap-5">
      <img :src="`/images/home/top-winners/${index}.png`">
      <img :src="`/images/casino/top-players/${name}.png`">
      <div>
        <div class="white-text">
          {{ name }}
        </div>
        <div class="default-text">
          {{ staked }} {{ token.toUpperCase() }}
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1 white-text">
      {{ earned }} <img :src="`/images/${token}.png`">
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        index: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        staked: {
            type: String,
            required: true
        },
        earned: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
    .white-text {
        @apply text-white font-semibold text-lg;
    }
    .player-container {
        border: 1px solid #3A393E;
        padding: 10px 20px;
        border-radius: 15px;
    }
</style>
