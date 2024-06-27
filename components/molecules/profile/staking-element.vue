<template>
  <div ref="element" v-click-outside="outsideClick" :style="!staked ? 'padding: 30px' : ''" class="element-container flex flex-col gap-5" @click="addBorders">
    <a href="#">
      <div :style="staked ? `background-image:url(${bigImage}); background-repeat: no-repeat; background-size: cover;padding: 20px;` : ''">
        <div class="between-items lottery-title">
          {{ title }}
          <img v-if="!staked" :src="bigImage">
        </div>
        <div class="between-items default-text" :style="staked ? 'padding-left: 10px; padding-right: 10px;' : ''">
          Estimated APR
          <StakingBtn :disabled="true" :color="staked ? '#B9FF6E' : ''" :fill="staked" :class="staked ? 'text-black' : 'text-white'" class="my-4">
            {{ estimated }}
          </StakingBtn>
        </div>
      </div>
      <div :style="staked ? 'padding: 30px' : ''">
        <div class="flex flex-col">
          <div class="between-items gap-4">
            <div class="stake flex items-center gap-2 pl-4 py-3 font-medium">
              <img :src="`/images/${token}.png`">{{ stake }}
            </div>
            <StakingBtn
              :fill="true"
              :color="'#FF6600'"
              :hover-color="'#FFDC7E'"
              :hover-text-color="'#6600FF'"
              :shadow="'0px 2px 20px rgba(255, 220, 126, 0.25)'"
              class="p-3"
            >
              Max
            </StakingBtn>
          </div>
          <div class="default-text">
            Balance: <span class="text-white font-semibold">{{ balance }} {{ token.toUpperCase() }}</span>
          </div>
        </div>
        <div class="default-text text-lg mt-6 pb-1">
          Total Reward
        </div>
        <div class="flex items-center gap-1">
          <img :src="`/tokens/rdt-big.png`">
          <div class="w-full">
            <div class="lottery-title font-medium">
              {{ totalReward.reward }}
            </div>
            <div class="flex items-center gap-2">
              <div v-if="totalReward.lockTime" class="text-white">
                %{{ totalReward.progress }}
              </div>
              <div class="line-container w-full">
                <div class="line" :style="`width: ${totalReward.progress}%`" />
              </div>
              <div v-if="!totalReward.lockTime" class="text-white">
                %{{ totalReward.progress }}
              </div>
              <div v-if="totalReward.lockTime" class="default-text flex">
                <div class="w-20">
                  Lock Time
                </div>
                <span class="text-white w-20">{{ totalReward.lockTime }}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="link-text flex items-center gap-2 mt-8 mb-6">
          <img src="/images/profile/user-info/info.png">
          Info
        </button>
        <div class="flex gap-2">
          <StakingBtn :fill="false" :hover-color="'#F5F5F7'" :hover-text-color="'#171120'" :hover-shadow="'0px 2px 20px rgba(245, 245, 247, 0.25)'" class="w-full">
            Unstake
          </StakingBtn>
          <StakingBtn :fill="true" :color="'#9E68FF'" :hover-color="'#6600FF'" :hover-shadow="'0px 2px 20px rgba(102, 0, 255, 0.5);'" class="w-full">
            Stake
          </StakingBtn>
        </div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
    props: {
        title: { type: String, required: true, default: '' },
        estimated: { type: String, required: true, default: '' },
        staked: { type: Boolean, default: false, required: false },
        balance: { type: String, required: true, default: '' },
        token: { type: String, required: true, default: '' },
        stake: { type: String, required: true, default: '' },
        btnColor: { type: String, required: true, default: '' },
        totalReward: {
          type: Object as PropType<any>,
          required: true,
          default: () => {
          return {}
        }
      },
      bigImage: { type: String, required: true, default: '' }
    },
    setup() {
      const element = ref()

      const addBorders = () => {
        element.value.style.border = '2px solid #424245'
      }

      const outsideClick = () => {
        element.value.style.border = ''
      }

      return {
        element,
        addBorders,
        outsideClick
      }
    }
}
</script>

<style lang="scss" scoped>
  .element-container {
    background: #251F2D;
    border-radius: 12px;
    width: 100%;
    transition: .1s;
    &:hover {
      background: #2C2634;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    }
  }
  .stake {
    width: 100%;
    height: 100%;
    border: 1.8px solid rgb(88, 88, 88);
    border-radius: 12px;
    color: white;
  }

  .line-container, .line {
    border-radius: 8px;
  }

  .line-container {
    background: #413C48;
    height: 10px;
  }
  .line {
    height: 100%;
    background: #B9FF6E;
  }
  .between-items {
    @apply flex justify-between items-center;
  }
</style>
