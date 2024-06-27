<template>
  <div
    v-if="!showOnlyActive || (showOnlyActive && checkStatus)"
    class="p-[24px] w-full max-w-[328px] border-[2px] rounded-[12px] flex flex-col h-full"
    :class="checkStatus ? 'border-[#60F] bg-[#1F0F38]' : 'border-[#424245] bg-[#251F2D]'"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center" style="paddingRight:30px">
        <img src="/svgs/rdt.svg" class="w-[38px] h-[38px]">
        <img src="/images/profile/user-info/coin-icon.svg" class="w-[40px] h-[40px] -ml-[14px]">
      </div>
      <div class="flex items-center gap-[8px]">
        <div class="w-[65px] h-[24px] flex justify-center items-center rounded-[8px] bg-[#60F]">
          <p class="text-[12px] font-[700]">
            Active
          </p>
        </div>
        <p class="text-[16px] font-[700] whitespace-nowrap">
          <template v-if="item.name === 'Cake LP - RDT/BNB'">
            RDT-BNB LP
          </template>
          <template v-else>
            {{ item.name }}
          </template>
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between mt-[24px]">
      <p class="text-[14px] font-[400]">
        Estimated APR
      </p>
      <div class="flex items-center gap-[8px]">
        <img src="/images/profile/stakedGames/calc.svg">

        <p v-if="poolInfo().APY" class="text-[14px] font-[700]">
          {{
            poolInfo()
              .APY.toFixed(2)
              .replace(/[.,]00$/, '')
          }}%
        </p>
      </div>
    </div>
    <div class="flex items-center mt-[16px] gap-[8px]">
      <div
        class="flex px-[16px] py-[12px] rounded-[12px] border-[1px] border-[#424245] items-center gap-[8px] h-[48px] w-full max-w-[207px]"
        :class="{errorInput: isAmountHigherThenMaxValue}"
      >
        <img src="/svgs/rdt.svg" class="w-[20px] h-[20px]">
        <input
          v-model="amount"
          type="number"
          class="bg-transparent outline-none rounded-none w-full"
        >
      </div>
      <div class="rounded-[12px] flex justify-center items-center bg-[#F60] w-full max-w-[65px] h-[48px] min-w-[60px] cursor-pointer max_btn" @click="setMaxValue">
        <p class="text-[16px] font-[700]">
          Max
        </p>
      </div>
    </div>
    <p class="text-[12px] font-[400] mt-[4px]">
      Available <span class="text-[#FFDC7E] font-[700]">{{ poolInfo()?.walletBalance?.toFixed(2).replace(/[.,]00$/, '') }} {{ item.tokenSymbol }}</span>
    </p>
    <div class="flex justify-between items-center mt-[10px]">
      <p class="text-[12px] font-[400] mt-[4px]">
        Staked
      </p>
      <p class="text-[12px] font-[400] mt-[4px]">
        Reward
      </p>
    </div>
    <div class="flex justify-between items-center -mt-[2px]">
      <p class="text-[16px] font-[400] mt-[4px]">
        {{ poolBlockchainUser?.staked.toFixed(2).replace(/[.,]00$/, '') ?? 0.00 }} {{ item.tokenSymbol }}
      </p>
      <p class="text-[16px] font-[400] mt-[4px]">
        {{ poolBlockchainUser?.rewarded.toFixed(2).replace(/[.,]00$/, '') ?? 0.00 }} RDT
      </p>
    </div>
    <div class="flex justify-between items-center mt-[16px] gap-[8px]">
      <button :disabled="amount <= 0 || amount > poolBlockchainUser?.staked" class="border-[1px] border-[#F5F5F7] rounded-[12px] w-full flex justify-center items-center h-[40px] cursor-pointer unstake_btn" @click="unstake">
        <p class="text-[14px] font-[700]">
          Unstake
        </p>
      </button>
      <button :disabled="isDisabledButtons" class="rounded-[12px] w-full flex justify-center items-center h-[40px] bg-[#9E68FF] cursor-pointer stake_btn" @click="stake">
        <p class="text-[14px] font-[700]">
          Stake
        </p>
      </button>
    </div>
    <button :disabled="+poolBlockchainUser?.rewarded <= 0" class="flex justify-center items-center gap-[8px] bg-[#60F] h-[40px] rounded-[12px] mt-[12px] cursor-pointer reward_btn" @click="claim">
      <p class="text-[16px] font-[700]">
        Claim Reward
      </p>
      <img src="/images/profile/user-info/check-with-bg.svg">
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStaking } from '~/composables/useStaking'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true
    },
    poolBlockchainUser: {
      type: Object,
      required: true
    },
    showOnlyActive: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const amount = ref(0)
    const isShowDetails = ref(false)
    const { handleDeposit, handleWithdraw, poolBlockchain, loadStakingPoolUser } = useStaking()
    const isDisabledButtons = computed(() => amount.value <= 0 || amount.value > poolInfo()?.walletBalance)
    const isAmountHigherThenMaxValue = computed(() => amount.value > poolInfo()?.walletBalance)
    const checkStatus = computed(() => {
      if (!props.poolBlockchainUser) {
        return ''
      }
      if (props.poolBlockchainUser[props.item.address]?.staked) {
        return 'FARMING'
      }
      if (props.poolBlockchainUser?.rewarded > 0) {
        return 'CLAIM REWARD'
      }
      return ''
    })

    const poolInfo = () => poolBlockchain[props.item.pid] ? poolBlockchain[props.item.pid] : {}

    const setMaxValue = () => {
      amount.value = Number(Math.floor(poolInfo().walletBalance * 100000) / 100000)
    }

    const stake = () => {
      handleDeposit(props.item, amount.value).then(() => {
        loadStakingPoolUser()
        amount.value = 0
      })
    }

    const unstake = () => {
      handleWithdraw(props.item, amount.value).then(() => {
        loadStakingPoolUser()
        amount.value = 0
      })
    }

    const claim = () => {
      handleWithdraw(props.item, amount.value, true).then(() => {
        loadStakingPoolUser()
        amount.value = 0
      })
    }

    return {
      amount,
      isShowDetails,
      handleDeposit,
      handleWithdraw,
      poolInfo,
      setMaxValue,
      stake,
      isDisabledButtons,
      isAmountHigherThenMaxValue,
      unstake,
      claim,
      checkStatus
    }
  }
})
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.errorInput{
  border:1px solid #FF4757 !important;
}
.unstake_btn {
  &:hover:not(:disabled) {
    background-color: white;
    color: black;
  }
  &:active:not(:disabled) {
    color: #60F;
  }
  &:disabled{
    color: #6F6C75;
    background-color: #241e2c !important;
    border: 1px solid #5c5c61 !important;
  }
}
.stake_btn {
  &:hover:not(:disabled) {
    background-color: #60F !important;
    box-shadow: 0px 0px 14px 0px #60F;
  }
  &:active:not(:disabled) {
    color: #FFDC7E;
  }
  &:disabled {
    background-color: #424245 !important;
    color: #6F6C75;
  }
}

.reward_btn {
  &:hover:not(:disabled) {
    background-color: #8d52fc !important;
    box-shadow: 0px 0px 15px 0px #8d52fc;
  }
  &:active:not(:disabled) {
    color: #FFDC7E;
    background-color: #60F !important;
    box-shadow: 0px 0px 14px 0px #60F;
  }
  &:disabled {
    background-color: #424245 !important;
    color: #6F6C75;
  }
}

.max_btn {
  &:hover:not(:disabled) {
    color: #60F;
    background-color: #FFDC7E !important;
    box-shadow: 0px 0px 12px 0px #FFDC7E;
  }
  &:active:not(:disabled) {
    color: #60F;
    background-color: #F60 !important;
    box-shadow: 0px 0px 14px 0px #F60;
  }
}
</style>
