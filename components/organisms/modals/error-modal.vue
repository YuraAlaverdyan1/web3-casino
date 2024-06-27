<template>
  <div
    class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
    :class="
      isError !== '' && config.public.isProduction === 'false'
        ? 'z-[100] scale-100 opacity-100'
        : '-z-[100] scale-0 opacity-0'
    "
  >
    <div class="w-full h-full absolute left-0 top-0" @click.stop.prevent="isError = ''" />
    <div
      class="bg-[#251F2D] border-[1px] border-[#424245] rounded-[12px] px-[24px] pb-[24px] w-full max-w-[370px] lg:max-w-[624px] relative z-[10] error_modal"
    >
      <img
        src="/images/nav/close.svg"
        class="w-[24px] h-[24px] absolute right-[24px] top-[24px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
        @click.stop.prevent="isError = ''"
      >
      <div class="error_modal_head">
        Something went wrong
      </div>
      <div class="error_modal_container">
        <img src="/images/404/404-cat.png" class="w-full">
        <div class="error_modal_container_head">
          <p>Error Content</p>
          <div>
            <img src="/svgs/copy.svg" @click="copyText">
            <img
              class="arrow"
              :class="{ rotated: showError }"
              src="/games/to-the-moon/arrow.svg"
              @click="() => (showError = !showError)"
            >
          </div>
        </div>
        <p v-if="showError" class="break-words max-h-[500px] overflow-y-auto mt-[4px]">
          {{ isError }}
        </p>
        <a
          :href="`mailto:requests@ridotto.io?subject=Ridotto%20Error&body=${errorMessage}`"
        >
          Send Report
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'

export default {
  setup() {
    const isError = ref('')
    const errorMessage = computed(() => isError.value.split(' ').join('%20'))
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    const showError = ref(true)

    const copyText = () => {
      navigator.clipboard.writeText(isError.value)
    }

    return {
      config,
      isError,
      showError,
      copyText,
      errorMessage
    }
  }
}
</script>
<style lang="scss" scoped>
.error_modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 30vw !important;
  &_head {
    color: var(--text-01, #f5f5f7);
    font-size: 20px;
    font-weight: 700;
    margin-top: 20px;
  }
  &_container {
    border-radius: 12px;
    background: #201a29;
    padding: 20px;
    &_head {
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      div {
        display: flex;
        align-items: center;
        img {
          cursor: pointer;
        }
        .arrow {
          transform: rotate(-90deg);
        }
        .rotated {
          transform: rotate(90deg);
        }
      }
    }
    a {
      background-color: #9e68ff;
      width: 100%;
      border-radius: 12px;
      padding: 8px 16px;
      margin-top: 20px;
      display: block;
      text-align: center;
      &:hover:not(:disabled) {
        background-color: white;
        color: black;
      }

      &:active:not(:disabled) {
        color: #60f;
      }

      &:disabled {
        color: #6f6c75;
        background-color: #241e2c !important;
        border: 1px solid #5c5c61 !important;
      }
    }
  }
}
</style>
