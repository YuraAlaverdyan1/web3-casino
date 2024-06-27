<template>
  <div
    class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
    :class="signModal ? 'z-[100] scale-100 opacity-100' : '-z-[100] scale-0 opacity-0'"
  >
    <div class="w-full h-full absolute left-0 top-0" @click.stop.prevent="setSignModal(false)" />
    <div class="bg-[#251F2D] border-[1px] border-[#0A0A0A] rounded-[12px] p-[24px] w-full max-w-[368px] relative z-[10]">
      <img
        src="/images/nav/close.svg"
        class="w-[24px] h-[24px] absolute right-[24px] top-[24px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
        @click.stop.prevent="setSignModal(false)"
      >
      <p class="uppercase text-[18px] text-[400] pr-[50px]">
        Please sign the letter in your wallet
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '~/store/useAuth'

export default {
  setup() {
    const {
      setSignModal,
      signModal
    } = useAuth()
    return {
      setSignModal,
      signModal
    }
  }
}
</script>
