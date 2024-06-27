<template>
  <div class="flex flex-col gap-10 mb-10">
    <div class="small-detail-container">
      <StakingBtn :disabled="true" :color="'#FFDC7E'" class="w-28 flex items-center pl-3 text-base gap-2" style="border-radius: 20px;">
        <img src="/images/profile/play/affiliate.png"> Affiliate
      </StakingBtn>
      <div class="details-container">
        <div class="lottery-title">
          Invite Friends to Earn
        </div>
        <div class="purple-text">
          €927.25 + 25% COMMISSION
        </div>
        <button v-if="!isSmall" class="text_image">
          <div class="link-text-underlined">
            {{ wallet.wallet }}
          </div>
          <img src="/images/profile/user-info/copy.png">
        </button>
        <div v-if="isSmall">
          <div class="div-like-input flex gap-4 items-center p-2">
            <div>
              <div class="purple-text">
                Referral Link
              </div>
              <div class="text-white">
                {{ refLink }}
              </div>
            </div>
            <StakingBtn :color="'#FFDC7E'" :active="true" class="flex items-center pl-3" style="border-radius: 20px;">
              Copy
            </StakingBtn>
          </div>
          <div style="color: #B8B8B8; font-size: 14px;">
            Join the referral program to win  with your friends!
          </div>
        </div>
      </div>
    </div>
    <div class="small-detail-container">
      <StakingBtn :disabled="true" :color="'#FFDC7E'" class="w-28 mb-2 flex items-center gap-2 text-base pl-3" style="border-radius: 20px;">
        <img src="/images/profile/play/tickets.png"> Lottery
      </StakingBtn>
      <div class="details-container">
        <div class="lottery-title">
          Claim Prize
        </div>
        <div class="purple-text">
          You have {{ tickets.toBeClaimed }} ticket with prize to be claimed.
        </div>
        <button class="text_image">
          <img src="/images/profile/user-info/rewards.png">
          <div class="link-text-underlined">
            Claim Prize
          </div>
        </button>
        <div class="details-container">
          <div class="lottery-title">
            Wait for Draw
          </div>
          <div class="purple-text">
            You have {{ tickets.draw }} tickets waiting for draw.
          </div>
          <button class="text_image">
            <img src="/images/profile/user-info/ticket.png">
            <div class="link-text-underlined">
              View Tickets
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
  props: {
    wallet: {
      type: Object as PropType<any>,
      required: false,
      default: () => {
        return {}
      }
    },
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    },
    refLink: {
      type: String,
      required: false,
      default: ''
    },
    tickets: {
      type: Object as PropType<any>,
      required: false,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.purple-text {
  color: #9E68FF;
}
.details-container {
  @apply flex flex-col gap-4 sm:my-8;
}
.small-detail-container {
  @screen sm {
    padding: 25px;
  }
  padding: 15px 25px;
  border-radius: 12px;
}
.div-like-input {
  border: 1px solid rgba($color: #3b393944, $alpha: .4);
  border-radius: 12px;
}
</style>
