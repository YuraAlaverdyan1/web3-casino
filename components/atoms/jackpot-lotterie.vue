<template>
  <div class="relative lotterie-container">
    <div class="info-container text-white text-5xl font-semibold flex justify-center items-center" :style="`background-image: url(${image})`">
      {{ title }}
    </div>
    <div class="flex flex-col justify-between h-full py-2 pl-4">
      <div class="flex flex-col">
        <div class="default-text def">
          Jackpot:
        </div>
        <div class="flex items-center gap-2 title">
          {{ jackpot }} {{ token.toUpperCase() }} <img :src="`/images/${token}.png`">
        </div>
      </div>
      <div class="flex flex-col">
        <div class="default-text def">
          Ends in:
        </div>
        <div class="flex items-center gap-2 subtitle">
          {{ endIn }} <img src="/images/profile/play/time.png">
        </div>
      </div>
      <div class="flex flex-col">
        <div class="default-text def">
          Tickets Bought:
        </div>
        <div class="flex items-center gap-2 subtitle">
          {{ tickets }} <img src="/images/profile/play/tickets.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        jackpot: {
            type: String,
            default: '',
            required: true
        },
        image: {
            type: String,
            default: '',
            required: true
        },
        endIn: {
            type: String,
            required: true,
            default: ''
        },
        tickets: {
            type: Number,
            requried: true,
            default: 0
        },
        token: {
            type: String,
            required: true,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .title, .subtitle {
        color: white;
    }
    .title {
        font-size: 18px;
        font-weight: 600;
    }
    .subtitle {
        font-size: 16px;
        font-weight: 500;
    }
    .lotterie-container {
        &:hover {
            .info-container {
                opacity: 0;
            }
            background: #35343A;
        }
    }
    .info-container, .lotterie-container {
        width: 190px;
        height: 190px;
        border-radius: 8px;
    }
    .info-container {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        background-repeat: no-repeat;
        background-size: cover;
        transition: 0.2s;
    }
    @media(max-width: 1750px) {
      .info-container, .lotterie-container {
        width: 140px;
        height: 140px;
      }
      .title, .def {
        font-size: 12px;
      }
      .subtitle {
        font-size: 10px;
      }
    }
    @media (max-width: 1440px) {
      .title, .def {
        font-size: 10px;
      }
      .subtitle {
        font-size: 8px;
      }
    }
</style>
