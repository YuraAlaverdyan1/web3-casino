<template>
  <div class="item-container">
    <a href="#">
      <img :src="image" class="image w-full">
      <div class="details flex flex-col pt-4 gap-2 px-6">
        <div v-if="title" class="title">
          {{ title }}
        </div>
        <div v-if="subtitle" class="default-text subtitle">
          {{ subtitle }}
        </div>
        <div v-if="!finished" class="flex text-white gap-1 text-xl items-center">
          {{ completed }}/ <span class="limit font-medium">{{ limit }}</span> <img :src="`/images/${token}.png`">
        </div>
        <div v-if="!finished" class="flex items-center gap-2 text-white font-semibold">
          <div class="line">
            <div :style="`width: ${completedByPercent}%`" class="inner-line" />
          </div>
          {{ completedByPercent }}%
        </div>
        <div v-if="!collected && finished" class="flex justify-between">
          <div>
            <div class="subtitle">
              Jackpot
            </div>
            <div class="title flex items-center">
              {{ jackpot }} {{ token.toUpperCase() }} <img :src="`/images/${token}.png`">
            </div>
          </div>
          <div>
            <div class="subtitle">
              Ends in
            </div>
            <div class="title">
              {{ endIn }}
            </div>
          </div>
        </div>
        <div v-if="!finished || (finished && collected)" class="info-container relative">
          <div class="flex items-center gap-1 font-medium" :style="finished && collected ? `color: #B9FF6E` : 'color: #FFDC7E'">
            <img src="/images/profile/user-info/info.png">
            info
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
export default {
    props: {
        firstItem: { type: Boolean, default: false, required: false },
        image: { type: String, required: true, default: '' },
        title: { type: String, required: false, default: '' },
        subtitle: { type: String, required: false, default: '' },
        limit: { type: String, required: true, default: '' },
        completed: { type: String, required: true, default: '' },
        token: { type: String, required: true, default: '' },
        finished: { type: Boolean, requried: false, default: false },
        collected: { type: Boolean, required: false, default: false },
        jackpot: { type: String, required: false, default: '' },
        endIn: { type: String, required: false, default: '' }
    },
    setup(props) {
        const completedByPercent = computed(() => {
            const Completed = props.completed.split('.').join('')
            const limit = props.limit.split('.').join('')
            return Math.round((+Completed / +limit) * 100)
        })

        return {
            completedByPercent
        }
    }
}
</script>

<style lang="scss" scoped>
    .line, .inner-line {
        border-radius: 8px;
    }
    .line {
        width: 82%;
        height: 8px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #1C1B1F;
    }
    .inner-line {
        height: 8px;
        background: #B9FF6E;
    }
    .limit {
      color: #9E68FF;
    }
    .tooltip {
        position: absolute;
        left: -100%;
        top: -200%;
    }
    .image {
      animation: dropImage .6s forwards;
    }
    .title {
        font-size: 20px;
        color: white;
        font-weight: 600;
    }
    .subtitle {
        font-size: 16px;
        color: #E6E6E6;
        font-weight: 500;
    }
    .details {
      position: relative;
      z-index: 20px;
      transition: .6s;
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F;;
    }
    .item-container {
      position: relative;
      padding-bottom: 10px;
      transition: .6s;
      overflow: hidden;
      background: #201A29;
      height: 200px;
      &:hover {
        .image {
          animation: imageHover .6s forwards;
        }
        .details {
          background: #2C2634;
        }
        background: #2C2634;
        border-radius: 15px;
      }
    }
    .info-container {
        .tooltip {
            display: none;
        }
        &:hover {
            .tooltip {
                display: flex;
            }
        }
    }
</style>
