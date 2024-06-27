<template>
  <div class="game">
    <img :src="image" class="ss:h-44 h-32 w-full">
    <div class="p-4">
      <div class="lottery-title text-lg">
        {{ name }}
      </div>
      <div class="flex justify-between">
        <div class="subtitle">
          {{ game[0].toUpperCase() + game.slice(1) }} Game
        </div>
        <div class="flex items-center" style="color: #E6E6E6;">
          <img :src="`/images/${token}.png`"> {{ percent }}
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
        name: {
           type: String,
           required: true,
           default: ''
        },
        game: {
            type: String,
            required: true,
            default: ''
        },
        token: {
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
.subtitle {
    font-size: 14px;
    color: #FFFFFF;
}
.game {
    width: 100%;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F;
    mix-blend-mode: normal;
    border-radius: 0px 0px 20px 20px;
}
</style>
