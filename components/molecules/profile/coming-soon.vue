<template>
  <div class="w-full bg-[#201A29] rounded-[12px] overflow-hidden">
    <div
      :style="`background-image: url(${image})`"
      class="w-full h-[188px] bg-cover bg-no-repeat flex items-end "
      :class="[isLeftStyle && 'text-right', !withoutLink ? 'bg-top' : 'bg-bottom']"
    >
      <div
        :style="`background: ${gradient}`"
        :class="!withoutLink ? 'h-[60%]' : 'h-[188px] bg-bottom'"
        class="w-full  pt-[5px] px-[24px] mt-auto flex flex-col justify-end pb-[7px]"
      >
        <p :class="!withoutLink ? 'text-[#B9FF6E]' : 'text-[#fff]'" class="text-[20px] font-[700]">
          {{ subtitle }}
        </p>
        <p
          :class="withoutLink ? 'text-[#B9FF6E]' : 'text-[#fff]'"
          class="text-[32px] font-[700] -mt-[0px] leading-[38px]"
        >
          {{ title }}
        </p>
      </div>
    </div>
    <div
      :class="!withoutLink ? 'h-[260px]' : 'h-[193px]'"
      class="pt-[24px] px-[24px] pb-[42px]  flex flex-col justify-between"
    >
      <div>
        <p class="text-[18px] font-[700]">
          {{ descriptionTitle }}
        </p>
        <p class="text-[14px] font-[400] leading-[24px] mt-[10px]">
          {{ description }}
        </p>
      </div>
      <div
        v-if="!withoutLink"
        class="flex items-center gap-[15px] scale-100 hover:scale-[1.05] transition-all origin-left cursor-pointer"
      >
        <p
          class=" font-[700] mt-auto tracking-[.5px]"
          @click="[$emit('changeActive', linkPath), activeProfileIndex = linkPath]"
        >
          {{ link }}
        </p>
        <img src="/images/menu/link-arrow.svg">
      </div>
      <div v-if="withoutLink" class="flex items-center gap-[15px] transition-all origin-left">
        <p class=" font-[700] mt-auto tracking-[.5px] text-[#B9FF6E]">
          {{ link }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMenu } from '~/composables/useMenu'
import profileData from '~/data/profile.json'
export default {
  props: {
    image: {
      type: String,
      required: true,
      default: 'coming-soon-2.png'
    },
    gradient: {
      type: String,
      required: true,
      default: 'linear-gradient(1deg, rgba(255, 102, 0, 0.81) 12.17%, rgba(255, 102, 0, 0.63) 29.82%, rgba(255, 102, 0, 0.22) 54.7%, rgba(255, 255, 255, 0.00) 73.69%)'
    },
    isLeftStyle: {
      type: Boolean,
      required: false,
      default: false
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
    descriptionTitle: {
      type: String,
      required: true,
      default: ''
    },
    description: {
      type: String,
      required: true,
      default: ''
    },
    link: {
      type: String,
      required: true,
      default: ''
    },
    linkPath: {
      type: Number,
      required: true,
      default: 1
    },
    withoutLink: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['changeActive'],
  setup() {
    const { activeProfileIndex } = useMenu()
    const copySign = () => {
      navigator.clipboard.writeText('1Lbcfr7s****4ZnX71')
    }
    return {
      copySign,
      profileData,
      activeProfileIndex
    }
  }
}
</script>
