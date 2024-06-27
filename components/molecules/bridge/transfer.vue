<template>
  <div class="transfer">
    <div class="transfer_container">
      <div class="transfer_container_header">
        <span>From:</span>
        <SelectBtn
          :items="tokens"
          :text="from"
          :is-full-width="true"
          is-tokens="true"
          @select="(e) => (from = e)"
        />
      </div>
      <div class="transfer_amount">
        <img src="/tokens/rdt.png" alt="token">
        <CustomInput
          :fill="true"
          :initial-value="fromAmount"
          class="transfer_amount_input"
        />
        <button>MAX</button>
      </div>
      <span>Balance: 0.79</span>
    </div>
    <div class="transfer_switch">
      <img src="/bridge/switch_icon.svg" alt="switch_icon">
    </div>
    <div class="transfer_container">
      <div class="transfer_container_header">
        <span>To:</span>
        <SelectBtn
          :items="tokens"
          :text="to"
          :is-full-width="true"
          is-tokens="true"
          @select="(e) => (to = e)"
        />
      </div>
      <div class="transfer_amount">
        <img src="/tokens/rdt.png" alt="token">
        <CustomInput
          :fill="true"
          :initial-value="toAmount"
          class="transfer_amount_input"
        />
        <button>MAX</button>
      </div>
      <span>Balance: 8.52</span>
    </div>
    <button class="transfer_transfer">
      Transfer
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { chainsSupported } from '~/web3/model/chain.model'
const tokens = computed(() =>
  chainsSupported.map((item) => {
    return {
      name: item.name,
      symbol: item.symbol
    }
  })
)
const from = ref({ name: chainsSupported[0].name, symbol: chainsSupported[0].symbol })
const fromAmount = ref<number>(0.35)
const to = ref({ name: chainsSupported[3].name, symbol: chainsSupported[3].symbol })
const toAmount = ref<number>(97.95709175)
</script>

<style lang="scss" scoped>
:deep(.o-btn) {
  background: transparent !important;
  padding-left: 0 !important;
}

:deep(.o-drop__item) {
  white-space: nowrap;
  display: flex !important;
  div {
    text-align: left !important;
    justify-content: left !important;
    gap: 5px;
  }
}
.transfer {
  background-color: #201a29;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;

  &_switch {
    img {
      width: 36px;
      cursor: pointer;
    }
  }

  &_amount {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #171120;
    border: 1px solid #424245;
    border-radius: 12px;
    width: 100%;

    &_input {
      background-color: #171120;
      font-weight: bolder;
      color: white;
      margin-left: 24px;
    }

    button {
      position: absolute;
      right: 16px;
      background-color: #f60;
      border-radius: 4px;
      font-size: 12px;
      padding: 3px 16px;
      font-weight: bolder;
      &:hover:not(:disabled) {
        color: #60f;
        background-color: #ffdc7e !important;
        box-shadow: 0px 0px 12px 0px #ffdc7e;
      }
      &:active:not(:disabled) {
        color: #60f;
        background-color: #f60 !important;
        box-shadow: 0px 0px 14px 0px #f60;
      }
    }

    img {
      position: absolute;
      left: 12px;
    }
  }

  &_container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    span {
      color: #e6e6e6;
      font-size: 12px;
    }

    &_header {
      display: flex;
      align-items: center;
      span {
        color: #e6e6e6;
        font-size: 14px;
      }
    }
  }

  &_transfer {
    background: #60f;
    width: 100%;
    border-radius: 12px;
    margin-top: 60px;
    padding: 16px;
    &:hover:not(:disabled) {
      background-color: #8d52fc !important;
      box-shadow: 0px 0px 15px 0px #8d52fc;
    }
    &:active:not(:disabled) {
      color: #ffdc7e;
      background-color: #60f !important;
      box-shadow: 0px 0px 14px 0px #60f;
    }
    &:disabled {
      background-color: #424245 !important;
      color: #6f6c75;
    }
  }
}
</style>
