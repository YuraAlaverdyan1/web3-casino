<template>
  <div
    v-if="details"
    class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
    :class="showModal ? 'z-[100] scale-100 opacity-100' : '-z-[100] scale-0 opacity-0'"
  >
    <div class="w-full h-full absolute left-0 top-0" @click="$emit('showModal', false)" />

    <div
      class="bg-[#251F2D] rounded-[12px] p-[24px] lg:p-[40px] w-full max-w-[576px] relative z-[10] scale-[.8] xs:scale-[.9] lg:scale-[.8] xl:scale-1"
    >
      <img
        src="/images/nav/close.svg"
        class="w-[16px] h-[16px] absolute right-[30px] top-[30px] lg:right-[40px] lg:top-[40px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
        @click="$emit('showModal', false)"
      >
      <p class="text-[18px] lg:text-[20px] font-[700]">
        {{ details.TopTitle }}
      </p>
      <p class=" text-[14px] font-[400] mt-[16px]">
        {{ details.TopSubTitle }}
      </p>
      <p
        class="text-[34px] lg:text-[44px] xl:text-[48px] font-[700] mt-[20px] xl:mt-[40px] leading-[42px] lg:leading-[56px]"
        v-html="details.BodyTitle"
      />
      <p class=" text-[16px] font-[400] mt-[16px] lg:mt-[24px]" v-html="details.BodyDescription" />
      <div class="w-full p-[24px] bg-[#2C2634] rounded-[12px] mt-[20px] xl:mt-[40px] BottomBox" v-html="details.BottomBox" />
    </div>
  </div>
</template>

<script lang="ts">

export default {
    props: {
        showModal: {
            type: Boolean,
            required: true,
            default: true
        },
        details: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },

    emits: ['showModal'],

    setup() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.BottomBox {
  :deep(h3,h4) {
    font-size: 24px;
    font-weight: 700;
  }
  :deep(ul,ol) {
    margin-top: 10px;
    padding-left: 20px;
    margin-left: 20px;
  }
}
</style>
