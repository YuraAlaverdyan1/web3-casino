<template>
  <div
    v-if="!showOnlyActive || (showOnlyActive && checkStatus)"
    class="w-full max-w-[328px] border-[2px] rounded-[12px] flex flex-col h-full overflow-hidden"
    :class="checkStatus ? 'border-[#60F] bg-[#1F0F38]' : 'border-[#424245] bg-[#251F2D]'"
    @mouseover="() => (startVideo = true)"
    @mouseleave="() => (startVideo = false)"
  >
    <div
      class="w-full h-[328px] bg-cover py-[24px] px-[12px] relative"
      :style="`background:url(${item.metadata?.image})`"
    >
      <div class="flex items-center justify-center gap-[8px] relative z-10">
        <div v-if="checkStatus" class="px-[12px] py-[4px] bg-[#60F] rounded-[8px]">
          <p class="text-[12px] font-[700]">
            {{ checkStatus }}
          </p>
        </div>

        <p class="text-[16px] font-[700]">
          {{ item.name }}
        </p>
      </div>
      <video v-if="startVideo" autoplay loop class="startVideo">
        <source :src="item.metadata?.animation_url" type="video/mp4">
      </video>
    </div>

    <div class="p-[24px]">
      <div>
        <div class="flex items-center gap-[8px] mt-[2px]">
          <img src="/images/profile/user-info/rdt-blue.svg">
          <div class="flex items-center gap-[8px] w-full mt-[1px]">
            <p class="text-[12px]">
              %{{ percentage }}
            </p>
            <div class="w-full bg-[#38333F] rounded-[8px] relative min-h-[8px]">
              <div
                :class="`absolute left-0 top-0 rounded-[8px] bg-[#B9FF6E] min-h-[8px]`"
                :style="`width:${percentage}%`"
              />
            </div>
          </div>
        </div>
      </div>
      <p class="text-[12px] font-[400] mt-[4px]">
        Balance
        <span class="text-[#FFDC7E] font-[700]">{{ balanceNFT?.toFixed(0).replace(/[.,]000$/, "") ?? 0 }} NFT</span>
      </p>
      <div class="flex items-center mt-[16px] gap-[8px]">
        <div
          class="flex px-[16px] py-[12px] rounded-[12px] border-[1px] border-[#424245] items-center gap-[8px] h-[48px] w-full max-w-[207px]"
          :class="{ errorInput: isAmountHigherThenMaxValue }"
        >
          <img src="/svgs/rdt.svg" class="w-[20px] h-[20px]">
          <input v-model="amount" type="number" class="bg-transparent outline-none rounded-none w-full">
        </div>
        <div
          class="rounded-[12px] flex justify-center items-center bg-[#F60] w-full max-w-[65px] h-[48px] cursor-pointer max_btn"
          @click="setMaxCount"
        >
          <p class="text-[16px] font-[700]">
            Max
          </p>
        </div>
      </div>
      <p class="text-[12px] font-[400] mt-[4px]">
        Available
        <span class="text-[#FFDC7E] font-[700]">{{ available?.toFixed(2).replace(/[.,]000$/, "") }} {{ tokenName }}</span>
      </p>

      <div class="flex justify-between items-center mt-[16px] gap-[8px]">
        <button
          :disabled="amount <= 0 || amount > balance"
          class="border-[1px] border-[#F5F5F7] rounded-[12px] w-full flex justify-center items-center h-[40px] cursor-pointer unstake_btn"
          @click="unstake"
        >
          <p class="text-[14px] font-[700]">
            Unstake
          </p>
        </button>
        <button
          :disabled="isDisabledButtons"
          class="rounded-[12px] w-full flex justify-center items-center h-[40px] bg-[#9E68FF] cursor-pointer stake_btn"
          @click="stake"
        >
          <p class="text-[14px] font-[700]">
            Stake
          </p>
        </button>
      </div>
      <button
        :disabled="balanceNFT < 1"
        class="flex w-full justify-center items-center gap-[8px] bg-[#60F] h-[40px] rounded-[12px] mt-[12px] cursor-pointer reward_btn"
        @click="claimNFT"
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
        <img src="/games/arcade/yellow-arrow.svg" :class="isShowDetails ? 'rotate-180' : 'rotate-0'" class="transition-all">
      </div>
      <div
        class="h-full transition-all overflow-hidden duration-500"
        :class="isShowDetails
          ? 'max-h-[293px] min-h-[293px] mt-[35px]'
          : 'max-h-[0px] min-h-[0px]'
        "
      >
        <p class="text-[16px] font-[700]">
          {{ item.name }}
        </p>
        <p class="text-[14px] mt-[8px] leading-[24px]">
          Ridotto’s Proof of Casino Ownership NFTs are the solution to decentralized
          casino ownership. Become the house and enjoy the benefits of profits, community
          engagement, native token utility, and non-inflationary staking.
        </p>
        <div class="flex justify-between items-center mt-[8px]">
          <p class="text-[14px]">
            Daily Emission
          </p>
          <p class="text-[14px] font-[700]">
            {{ item.dailyEmission }} NFTs
          </p>
        </div>
        <div class="flex justify-between items-center mt-[8px]">
          <p class="text-[14px]">
            Total value locked
          </p>
          <p v-if="item.totalSupply" class="text-[14px] font-[700]">
            {{
              item.totalSupply.indexOf(".") !== -1
                ? item.totalSupply.slice(0, item.totalSupply.indexOf(".") + 2)
                : item.totalSupply
            }}
          </p>
        </div>
        <div class="flex justify-between items-center mt-[8px]">
          <p class="text-[14px]">
            Balance
          </p>
          <p class="text-[14px] font-[700]">
            {{ balance?.toFixed(3).replace(/[.,]000$/, "") ?? 0 }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { caclulatePercentage } from '~/utils/web3/caclulatePercentage'
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
    const startVideo = ref(false)
    const isDisabledButtons = computed(
      () => amount.value <= 0 || amount.value > available.value
    )
    const isAmountHigherThenMaxValue = computed(() => amount.value > available.value)
    const checkStatus = computed(() => {
      if (!props.poolBlockchainUser) {
        return ''
      }

      if (balance.value) {
        return balance.value >= 1 ? 'CLAIM REWARD' : 'FARMING'
      }

      return ''
    })
    const { handleStake, handleUnstakeNFT, handleClaimNFT, loadPoolUser } = useStaking()
    const earned = computed(() => props.poolBlockchainUser[props.item.address]?.earned)
    const balanceNFT = computed(() => props.poolBlockchainUser[props.item.address]?.balanceNFT)

    const balance = computed(
      () =>
        props.poolBlockchainUser[props.item.address]?.balance
    )

    const tokenName = computed(() => {
      return props.poolBlockchainUser[props.item.address]?.tokenName
    })
    const available = computed(
      () => props.poolBlockchainUser[props.item.address]?.walletBalance
    )
    const percentage = computed(() => {
     return caclulatePercentage({
        poolBlockchainUser: props.poolBlockchainUser,
        item: props.item
      })
}
    )

    const setMaxCount = () => {
      amount.value = Number(Math.floor(available.value * 100000) / 100000)
    }

    const stake = () => {
      handleStake(props.item, amount.value).then(() => {
        loadPoolUser()
        amount.value = 0
      })
    }

    const unstake = () => {
      handleUnstakeNFT(props.item, amount.value).then(() => {
        loadPoolUser()
        amount.value = 0
      })
    }

    const claimNFT = () => {
      handleClaimNFT(props.item).then(() => {
        loadPoolUser()
      })
    }

    return {
      amount,
      isShowDetails,
      handleStake,
      handleUnstakeNFT,
      handleClaimNFT,
      balance,
      percentage,
      setMaxCount,
      available,
      isDisabledButtons,
      isAmountHigherThenMaxValue,
      startVideo,
      stake,
      unstake,
      claimNFT,
      checkStatus,
      tokenName,
      earned,
      balanceNFT
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

input[type="number"] {
  -moz-appearance: textfield;
  /* Firefox */
}

.errorInput {
  border: 1px solid #ff4757 !important;
}

.startVideo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  object-fit: cover;
}

.unstake_btn {
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

.stake_btn {
  &:hover:not(:disabled) {
    background-color: #60f !important;
    box-shadow: 0px 0px 14px 0px #60f;
  }

  &:active:not(:disabled) {
    color: #ffdc7e;
  }

  &:disabled {
    background-color: #424245 !important;
    color: #6f6c75;
  }
}

.reward_btn {
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

.max_btn {
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
</style>
