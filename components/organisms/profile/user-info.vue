<template>
  <div
    class="user-info-container"
    :class="[
      active === 2 ? 'bankroll-container' : '',
      edit ? 'edit-container' : '',
      active === 1 ? 'build-container' : '',
      active === 0 ? 'play-container' : ''
    ]"
  >
    <div class="sm:p-0">
      <div class="flex justify-between items-center mt-[24px]">
        <div class="flex items-center gap-[16px]">
          <div class="rounded-full overflow-hidden w-[64px] h-[64px]">
            <img :src="makeBlockie(`${userDetails.address}`)">
          </div>
          <div>
            <div e2e-id="username" class="text-white font-medium">
              {{ userDetails.userName ? userDetails.userName : 'Change Name' }}
            </div>
            <div
              class="flex items-center gap-[10px] text-[14px] text-[#6F6C75] mt-[4px] cursor-pointer"
              e2e-id="user-name"
              @click="copySign(userDetails.address && userDetails.address)"
            >
              {{
                userDetails.address &&
                  userDetails.address.split('').slice(0, 6).join('')
              }}...{{
                userDetails.address &&
                  userDetails.address
                    .split('')
                    .slice(
                      userDetails.address.split('').length - 4,
                      userDetails.address.split('').length
                    )
                    .join('')
              }}
              <img src="/images/profile/user-info/copy-icon.svg">
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <div
            e2e-id="edit"
            class="border-[1px] border-[#9E68FF] rounded-[8px] p-[3px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
            :class="edit && 'hidden'"
            @click="$emit('edit', !edit)"
          >
            <img src="/images/profile/user-info/edit-pink.svg">
          </div>
          <div
            class="border-[1px] border-[#9E68FF] rounded-[8px] p-[3px] ml-[8px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
            :class="edit && 'hidden'"
            @click="$emit('showSocialModal', !showSocialModal)"
          >
            <img src="/images/profile/user-info/share-pink.svg">
          </div>

          <img
            src="/images/profile/user-info/edit.svg"
            :class="!edit && 'hidden'"
            class="scale-100 hover:scale-[1.05] transition-all cursor-pointer"
            @click="$emit('edit', !edit)"
          >
        </div>
      </div>
    </div>
    <div>
      <div
        :class="edit
          ? 'max-h-[125px] min-h-[125px] mt-[24px]'
          : ' min-h-[0px] max-h-[0px] mt-0'
        "
        class="flex flex-col gap-[8px] transition-all overflow-hidden"
      >
        <div class="relative">
          <div class="default-text text-[12px] text-[#E6E6E6] pl-[16px]">
            Username
          </div>
          <CustomInput
            class="mt-[3px]"
            :initial-value="userName"
            :type="'text'"
            :placeholder="'Type Name'"
            :fill="false"
            :border-color="'rgba(255,255,255,0.7)'"
            :fail="nameError"
            :change-input-name="changeInputName"
            e2e-id="user-name-input"
          />
          <img class="input-image" alt="input image" src="/images/profile/user-info/edit-white.svg">
        </div>
        <div
          class="cursor-pointer text-[14px] bg-[#9E68FF] rounded-[12px] flex justify-center items-center h-[40px] font-[700] gap-[5px] relative"
          e2e-id="confirm"
          @click="setUserName(userName)"
        >
          <div class="absolute top-[50%] -translate-y-[40%] left-[33%]">
            <span v-if="isLoading" class="loader" />
          </div>
          Confirm
        </div>
      </div>
      <div class="p-[24px] bg-[#2C2634] rounded-[12px] mt-[24px] flex flex-col gap-[8px]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[8px]">
            <img src="/images/profile/user-info/lottery-nft.svg">
            <p class="text-[14px] font-[400]">
              Lottery NFT’s
            </p>
          </div>
          <p class="text-[14px] font-[700]">
            {{ lotteryNFT }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[8px]">
            <img src="/images/profile/user-info/slot-nft.svg">
            <p class="text-[14px] font-[400]">
              Slot NFT’s
            </p>
          </div>
          <p class="text-[14px] font-[700]">
            {{ slotNFT }}
          </p>
        </div>
      </div>

      <!--  <div class="flex flex-col gap-6 details-container play-details mt-[24px]">
        <div class="flex items-start gap-[16px]">
          <img :src="`/images/profile/user-info/lvl${Data.rank.lvl}.png`">
          <div class="w-full">
            <div class="text-white text-xl font-semibold">
              My Rank: <span class="rank">{{ Data.rank.name }}</span>
            </div>
            <div class="flex items-center gap-[8px] mt-[4px]">
              <div class="flex default-text">
                Lv <span>{{ Data.rank.lvl }}</span>
              </div>
              <div class="line-container">
                <div class="line" :style="`width: ${Data.rank.progress}%`" />
              </div>
              <div class="text-white font-medium">
                {{ Data.rank.progress }}%
              </div>
            </div>
            <button class="link-text text-[12px]">
              View All Rank
            </button>
          </div>
        </div>
      </div> -->
      <div
        v-if="active === 0 && config.public.isHideRefferal !== 'true'"
        class="w-full bg-[#2C2634] p-[24px] rounded-[12px] details-container flex flex-col gap-[8px] mt-[24px]"
      >
        <div class="flex items-center justify-between">
          <p class="text-[14px] text-[#E6E6E6]">
            Total Referred Users
          </p>
          <div class="flex items-center gap-[4px]">
            <p>Soon</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-[14px] text-[#E6E6E6]">
            Total Earned from Referrals
          </p>
          <div class="flex items-center gap-[4px]">
            <img src="/svgs/diamond.svg">
            <p>{{ userDetails.referralPoints }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-[14px] text-[#E6E6E6]">
            Last 7 Days Referral
          </p>
          <div class="flex items-center gap-[4px]">
            <p>Soon</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-[14px] text-[#E6E6E6]">
            Total Ref. Last 7 Days
          </p>
          <div class="flex items-center gap-[4px]">
            <img src="/svgs/diamond.svg">
            <p>Soon</p>
          </div>
        </div>
      </div>
      <!--
      <div v-if="active === 1" class="w-full bg-[#2C2634] rounded-[12px] p-[24px] mt-[24px]">
        <div class="flex items-center justify-between">
          <p class="text-[14px]">
            Total NFTs
          </p>
          <p class="text-[14px] font-[700]">
            1512
          </p>
        </div>
        <div class="flex items-center justify-between mt-[8px]">
          <p class="text-[14px]">
            Active Users Farming
          </p>
          <p class="text-[14px] font-[700]">
            6067
          </p>
        </div>
      </div>
      <div v-if="active === 2" class="w-full bg-[#2C2634] rounded-[12px] p-[24px] mt-[24px]">
        <div class="flex items-center justify-between">
          <p class="text-[14px]">
            TVL
          </p>
          <p class="text-[14px] font-[700]">
            $42,520,682
          </p>
        </div>
        <div class="flex items-center justify-between mt-[8px]">
          <p class="text-[14px]">
            Total Holders
          </p>
          <p class="text-[14px] font-[700]">
            6067
          </p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { computed, PropType, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import makeBlockie from 'ethereum-blockies-base64'

import { AccountController } from '@ridotto-io/w3-core'

import { useAuth } from '~/store/useAuth'
import { useWeb3 } from '~/composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
export default {
  props: {
    active: {
      type: Number,
      required: true,
      default: 0
    },
    data: {
      type: Object as PropType<any>,
      required: true,
      default: () => {
        return {}
      }
    },
    wallet: {
      type: Object as PropType<any>,
      required: true,
      default: () => {
        return {}
      }
    },
    edit: {
      type: Boolean,
      required: true,
      default: false
    },
    showSocialModal: {
      type: Boolean,
      required: true,
      default: false
    },
    isAvatarModal: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['edit', 'showSocialModal', 'isAvatarModal'],
  setup(props, { emit }) {
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    const router = useRouter()
    const route = useRoute()
    const { account } = useWalletConnect()
    const inputName = ref('')
    const nameError = ref(false)
    const userName = ref('')
    const isLoading = ref(false)
    const { jwtToken, setUserDetails, setAuth, userDetails } = useAuth()
    const { slotNFT, lotteryNFT, getNftSlots, currentChain } = useWeb3()

    const Data = computed(() => {
      return props.data.play
    })
    watch(
      () => userName.value,
      () => {
        nameError.value = false
      }
    )

    const changeInputName = (newValue) => {
      userName.value = newValue
    }

    watch(
      () => props.edit,
      () => {
        nameError.value = false
        userName.value = userDetails.value.userName
      }
    )

    watch(
      () => [userDetails.value.userName, router, route.name],
      (newData) => {
        userName.value = newData[0]
      }
    )

    watch(
      () => currentChain.value,
      () => {
        if (account.value.address) {
          getNftSlots(
            account.value.address,
            currentChain.value.smartContracts.contracts.NftFactory.address
          )
        }
      }
    )

    const setUserName = (value) => {
      if (value.trim() === '') {
        nameError.value = true
        return emit('edit', true)
      }
      if (userDetails.value.userName === userName.value) {
        return emit('edit', !props.edit)
      }

      if (value.trim() === '') {
        nameError.value = true
      }
      if (value.trim() !== '') {
        isLoading.value = true
        axios
          .post(
            `${config.public.apiBase}auth/updateProfile`,
            {
              email: 'ibrahim@ridotto.com',
              userName: value.trim()
            },
            {
              headers: {
                Authorization: `Bearer ${jwtToken.value}`
              }
            }
          )
          .then(function () {
            axios
              .get(`${config.public.apiBase}auth/details`, {
                headers: {
                  Authorization: `Bearer ${jwtToken.value}`
                }
              })
              .then(function (userInfo) {
                isLoading.value = false
                setUserDetails(userInfo.data.result)
                AccountController.setUserName(userInfo.data.result.userName)
                setAuth(true)
                emit('edit', !props.edit)
                nameError.value = false
              })
          })
          .catch(() => {
            isLoading.value = false
            nameError.value = true
          })
      }
    }

    const roundsCount = (index) => {
      return index + 1 <= Math.floor(Data.value.consumed / 30)
    }

    const copySign = (copyText) => {
      navigator.clipboard.writeText(copyText)
    }

    return {
      Data,
      userName,
      roundsCount,
      inputName,
      copySign,
      setUserName,
      changeInputName,
      userDetails,
      nameError,
      isLoading,
      makeBlockie,
      slotNFT,
      lotteryNFT,
      config
    }
  }
}
</script>

<style lang="scss" scoped>
.line-container {
  width: 100%;
  height: 8px;
  background: #413c48;
  border-radius: 8px;
}

.line {
  height: 100%;
  background: #b9ff6e;
  border-radius: 8px;
}

.rank {
  color: #9e68ff;
}

.round {
  width: 30px;
  height: 15px;
  border-radius: 8px;
}

.active-round {
  background: white;
}

.disabled-round {
  background: #1c1b1f;
}

.details-container {
  background: #2c2634;
  border-radius: 12px;
  padding: 24px;
  @apply flex flex-col gap-4 mt-10;
}

.user-info-container {
  @screen sm {
    padding: 24px;
    min-width: 336px;
    border-radius: 12px;
  }

  @screen lg+ {
    min-width: 376px;
  }

  background: #201a29;
  padding: 24px;
  border-radius: 0px;
  width: 100%;
  transition: 0.5s;

  .details-container {
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
  }
}

.bankroll-container {
  height: fit-content;
}

.build-container {
  height: fit-content;
}

.input-image {
  position: absolute;
  top: 25%;
  bottom: 0;
  right: 4%;
  margin: auto;
}

@media (max-width: 1540px) {
  .cashback-text {
    font-size: 20px !important;
  }
}

@media (max-width: 768px) {
  .play-details {
    padding: 30px;

    border-radius: 12px;
  }

  .cashback-text {
    font-size: 48px !important;
  }
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
~/store/useAuth
