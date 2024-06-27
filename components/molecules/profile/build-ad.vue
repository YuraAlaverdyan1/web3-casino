<template>
  <div
    ref="buildAd"
    v-click-outside="() => setBorders('')"
    class="ad-container"
    :onmouseover="() => doSomething(linkHoverColor)"
    :onmouseout="() => doSomething('')"
    @click="() => setBorders('2px solid #424245')"
  >
    <a href="#">
      <div class="relative">
        <img :src="image" class="w-full image">
        <div class="flex flex-col items-start justify-between gap-2 absolute left-5 top-4 bottom-4 m-auto">
          <div class="flex flex-col justify-between items-start h-full">
            <img v-if="rdt" src="/tokens/rdt.png">
            <div class="text-white font-semibold text-3xl">
              {{ subtitle }}
            </div>
            <div class="text-white font-semibold text-4xl">
              {{ title }}
            </div>
          </div>
          <StakingBtn
            :color="btnColor"
            :fill="true"
            :style="`color: ${btnTextColor}`"
            :hover-text-color="btnTextColor"
            class="w-48"
            style="min-height: 45px; max-height: 45px;"
          >
            {{ btnText }}
          </StakingBtn>
        </div>
      </div>
      <div class="py-8 px-6 details flex flex-col items-start justify-between">
        <div>
          <div class="text-xl font-bold text-white mb-10">
            {{ details.title }}
          </div>
          <div class="default-text font-normal text-base">
            {{ details.subtitle }}
          </div>
        </div>
        <a ref="link" href="#" class="font-bold text-base flex items-center gap-4 mt-8 linkText">
          {{ details.linkText }} <img :src="btnTextColor === 'black' ? '/images/lottery/buy-tickets-modal/direct.png': '/images/lottery/buy-tickets-modal/direct-purple.png'">
        </a>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
    props: {
        image: {
            type: String,
            required: true,
            default: ''
        },
        subtitle: {
            type: String,
            required: true,
            default: ''
        },
        title: {
            type: String,
            required: true,
            default: ''
        },
        title2: {
            type: String,
            required: false,
            default: ''
        },
        btnText: {
            type: String,
            required: true,
            default: ''
        },
        linkHoverColor: {
          type: String,
          required: true
        },
        details: {
            type: Object as PropType<any>,
            required: true,
            default: () => {
                return {}
            }
        },
        rdt: {
            type: Boolean,
            required: true,
            default: false
        },
        btnColor: {
          type: String,
          required: false,
          default: ''
        },
        btnTextColor: {
          type: String,
          required: false,
          default: ''
        }
    },
    setup() {
      const link = ref()
      const buildAd = ref()

      const doSomething = (color: string) => {
        link.value.style.color = color
      }

      const setBorders = (border: string) => {
        buildAd.value.style.border = border
      }

      return {
        link,
        buildAd,
        doSomething,
        setBorders
      }
    }
}
</script>

<style lang="scss" scoped>
    .linkText {
      color: white;
      transition: .5s;
    }
    .image {
      transition: .5s;
    }
    .details, .ad-container {
      background: #201A29;
      transition: .1s;
    }
    .ad-container {
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        overflow: hidden;
        &:hover {
          .image {
            transform: scale(1.08);
          }
          .details {
            background: #2C2634;
          }
          background: #2C2634;
        }
    }
</style>
