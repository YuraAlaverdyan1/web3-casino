<template>
  <div
    v-if="!showOnlyActive || (showOnlyActive && checkStatus)"
    class="w-full max-w-[328px] border-[2px] rounded-[12px] flex flex-col h-full overflow-hidden"
    :class="checkStatus ? 'border-[#60F] bg-[#1F0F38]' : 'border-[#424245] bg-[#251F2D]'"
  >
    <div
      :style="`background: url(${index % 2 == 0 ? '/images/profile/nfts/lego-1.png' : '/images/profile/nfts/lego-2.png'})`"
      :class="`flex flex-col justify-between w-full h-[328px] bg-center bg-cover p-[24px]`"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center" style="paddingRight:30px">
          <img :src="headIcon">
        </div>
        <div class="flex items-center gap-[8px]">
          <div v-if="item.isValid" class="w-[65px] h-[24px] flex justify-center items-center rounded-[8px] bg-[#60F]">
            <p class="text-[12px] font-[700] uppercase">
              Active
            </p>
          </div>
          <div v-if="!item.isValid" class="w-[65px] h-[24px] flex justify-center items-center rounded-[8px] bg-[#EBEBEB]">
            <p class="text-[12px] font-[700] text-[#6F6C75] uppercase">
              INACTIVE
            </p>
          </div>
          <p class="text-[16px] font-[700] whitespace-nowrap uppercase">
            {{ token }}
          </p>
        </div>
      </div>
      <div class="flex items-center justify-between mt-[24px] select-none">
        <p class="text-[14px] font-[400]">
          Estimated APR
        </p>
        <div class="flex items-center gap-[4px] relative tooltip-main">
          <div class="tooltip absolute bottom-[100%] -right-[12px] bg-[#2C2634] rounded-[8px]">
            <p>
              APY information will be available once we've compiled historical data for precise forecasting
            </p>
          </div>
          <img src="/images/profile/stakedGames/calc.svg">

          <p class="text-[14px] font-[700]">
            Pending
          </p>
        </div>
      </div>
    </div>

    <div class="p-[24px] w-full">
      <div class="flex items-center mt-[16px] gap-[8px]">
        <div
          class="flex px-[16px] py-[12px] rounded-[12px] border-[1px] border-[#424245] items-center gap-[8px] h-[48px] w-full max-w-[207px]"
          :class="{ errorInput: isAmountHigherThenMaxValue }"
        >
          <img :src="icon" class="w-[20px] h-[20px]">
          <input v-model="amount" type="number" class="bg-transparent outline-none rounded-none w-full">
        </div>
        <button
          class="rounded-[12px] flex justify-center items-center bg-[#F60] w-full max-w-[65px] h-[48px] min-w-[60px] cursor-pointer max_btn"
          @click="setMaxValue"
        >
          <p class="text-[16px] font-[700]">
            Max
          </p>
        </button>
      </div>
      <p class="text-[12px] font-[400] mt-[4px]">
        Available <span class="text-[#FFDC7E] font-[700]">{{ available.toFixed(2) }} {{ item.tokenSymbol }}</span>
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
          {{ staked.toFixed(2) }} {{ item.tokenSymbol }}
        </p>
        <div class="flex items-center gap-[5px] mt-[4px]">
          <p class="text-[16px] font-[400]">
            {{ earned?.toFixed(2).replace(/[.,]00$/, '') ?? 0.00 }}
          </p>
          <p class="text-[16px] font-[400] uppercase">
            {{ token }}
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-[16px] gap-[8px]">
        <button
          :disabled="amount <= 0 || amount > staked || staked <= 0"
          class="border-[1px] border-[#F5F5F7] rounded-[12px] w-full flex justify-center items-center h-[40px] cursor-pointer unstake_btn"
          @click="unstake"
        >
          <p class="text-[14px] font-[700]">
            Unstake
          </p>
        </button>
        <button
          :disabled="!item.isValid || amount <= 0 || amount > available"
          class="rounded-[12px] w-full flex justify-center items-center h-[40px] bg-[#9E68FF] cursor-pointer stake_btn"
          @click="stake"
        >
          <p class="text-[14px] font-[700]">
            Stake
          </p>
        </button>
      </div>
      <button
        :disabled="earned === 0"
        class="flex justify-center items-center gap-[8px] bg-[#60F] h-[40px] rounded-[12px] mt-[12px] cursor-pointer reward_btn w-full"
        @click="claim"
      >
        <p class="text-[16px] font-[700]">
          Claim Reward
        </p>
        <img src="/images/profile/user-info/check-with-bg.svg">
      </button>

      <div
        class="flex items-center justify-center gap-[4px] mt-[17px] mb-[12px] cursor-pointer scale-100 hover:scale-[1.05]"
        @click="isShowDetails = !isShowDetails"
      >
        <p class="text-[12px] text-[#FFDC7E] font-[700]">
          Details
        </p>
        <img
          src="/games/arcade/yellow-arrow.svg"
          :class="isShowDetails ? 'rotate-180' : 'rotate-0'"
          class="transition-all"
        >
      </div>
      <div
        class="h-full transition-all overflow-hidden duration-500"
        :class="isShowDetails
          ? 'max-h-[273px] min-h-[273px] mt-[35px]'
          : 'max-h-[0px] min-h-[0px]'
        "
      >
        <p class="text-[16px] font-[700]">
          {{ item.name }}
        </p>
        <p class="text-[15px] mt-[8px] leading-[24px] text-justify">
          By staking <span class="uppercase">{{ token }}</span>, you tap into the casino's
          ecosystem, benefiting from the house edge. Your contributions
          with <span class="uppercase">{{ token }}</span> enhance gameplay and secure profits
          linked to player activity. Higher stakes in <span class="uppercase">{{ token }}</span> translate
          to greater rewards, and extended staking periods mitigate impermanent
          loss, maximizing your advantages from the house edge.
        </p>
        <div class="flex justify-between items-center mt-[8px]">
          <p class="text-[14px]">
            Total value locked
            <span class="uppercase">{{ token }}</span>
          </p>
          <p class="text-[14px] font-[700]">
            {{ staked.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGamesPool } from '../../composables/useGamesPool'
import { useWeb3 } from '~/composables/useWeb3'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
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
    const staked = ref(0)
    const available = ref(0)
    const earned = ref(0)
    const { handleDeposit, handleWithdraw, userEarned, userBalance, userMaxBalance, handleGetReward, loadGlobalBankroll } = useGamesPool()
    const { format, web3Global, currentChain } = useWeb3()
    const isAmountHigherThenMaxValue = computed(() => amount.value > available.value)
    const checkStatus = computed(() => !!(staked.value && props.item.isValid))
    const icon = ref('/tokens/rdt.svg')
    const headIcon = ref('tokens/bnb.svg')

    const token = ref('usdt')
    const loadUserDetails = async () => {
      staked.value = format(await userBalance(props.item.address))
      available.value = await userMaxBalance(props.item.address)
      earned.value = format(await userEarned(props.item.address))
      if (isNaN(earned.value)) {
        earned.value = 0
      }
    }

    const route = useRoute()

    watch(() => [currentChain.value, route], () => {
      if (currentChain.value) {
        if (currentChain.value.symbol === 'ETH') {
          headIcon.value = '/tokens/eth-black.svg'
          if (currentChain.value.priceCalculation.usdt.toLowerCase() === props.item.address.toLowerCase()) {
            icon.value = '/tokens/busd.png'
            token.value = 'rusdt'
          } else {
            token.value = 'rtd'
            icon.value = '/tokens/rdt.svg'
          }
        } else if (currentChain.value.symbol === 'BNB') {
          headIcon.value = '/tokens/bnb.svg'
          if (currentChain.value.priceCalculation.usdt.toLowerCase() === props.item.address.toLowerCase()) {
            icon.value = '/tokens/usdt.png'
            token.value = 'usdt'
          } else {
            icon.value = '/tokens/usdt.png'
            token.value = 'bnb'
          }
        }
      }
    }, { deep: true, immediate: true })

    watch(() => [web3Global.walletConnected, web3Global.chain], () => {
      loadUserDetails()
    }, { deep: true, immediate: true })

    onMounted(async () => {
      await loadUserDetails()
      await loadGlobalBankroll()
    })

    const setMaxValue = async () => {
      if (!props.item.isValid) {
        amount.value = staked.value
      } else {
        amount.value = await userMaxBalance(props.item.address)
      }
    }

    const stake = () => {
      handleDeposit(props.item.address, amount.value).then(async () => {
        loadGlobalBankroll()
        await loadUserDetails()
        amount.value = 0
      })
    }

    const unstake = () => {
      handleWithdraw(props.item.address, amount.value).then(async () => {
        loadGlobalBankroll()
        await loadUserDetails()
        amount.value = 0
      })
    }

    const claim = () => {
      if (earned.value > 0) {
        handleGetReward(props.item.address).then(async () => {
          loadGlobalBankroll()
          await loadUserDetails()
          amount.value = 0
        })
      }
    }

    return {
      amount,
      isShowDetails,
      handleDeposit,
      handleWithdraw,
      setMaxValue,
      stake,
      isAmountHigherThenMaxValue,
      unstake,
      claim,
      checkStatus,
      staked,
      available,
      earned,
      icon,
      token,
      headIcon
    }
  }
})
</script>

<style lang="scss" scoped>
.tooltip {
  max-height: 0px;
  width: 300px;
  padding: 0px 10px;
  overflow: hidden;
  transition: all .3s;
}

.tooltip-main:hover .tooltip {
  max-height: 500px;
  width: 300px;
  overflow: hidden;
  padding: 10px;
  transition: all .3s 500ms;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.errorInput {
  border: 1px solid #FF4757 !important;
}

.unstake_btn {
  &:hover:not(:disabled) {
    background-color: white;
    color: black;
  }

  &:active:not(:disabled) {
    color: #60F;
  }

  &:disabled {
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
