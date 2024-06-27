<template>
  <button v-if="!amount" class="btn text-white" :class="max ? 'max-btn' : ''">
    <slot />
  </button>
  <div v-else class="amount text-white text-center">
    <input
      v-model="Text"
      class="w-full h-full inp"
      maxlength="2"
      readonly
      type="number"
    >
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
export default {
    props: {
        amount: {
            type: Boolean,
            required: false,
            default: false
        },
        max: {
            type: Boolean,
            required: false,
            default: false
        },
        text: {
            type: Number,
            required: false,
            default: 0
        },
        maxTickets: {
            type: Number,
            required: false,
            default: 0
        }
    },
    emits: ['selectCount'],
    setup(props) {
        const Text = ref<number>(1)

        watch(() => props.text, () => {
            Text.value = props.text
        })

        return {
            Text
        }
    }
}
</script>

<style lang="scss" scoped>
    .btn, .amount {
        width: 160px;
        height: 35px;
        font-weight: 500;
    }
    .btn {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #1C1B1F;
        border-radius: 8px;
    }
    .amount {
        position: relative;
        background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;
        border: 1px solid transparent;
        border-radius: 8px;
        background-clip: padding-box;
    }
    .amount::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        margin: -1px;
        border-radius: inherit;
        background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%) !important;
      }
    .inp {
      border-radius: 8px;
      background: transparent;
      text-align: center;
    }
    .max-btn {
        background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%);
    }
</style>
