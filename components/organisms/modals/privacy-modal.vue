<template>
  <ModalsBaseModal :active="active" :buy-tickets="true">
    <div class="p-4">
      <div class="absolute top-4 flex w-full px-4 justify-between">
        <div class="text-xl text-white">
          Connect Wallet
        </div>
        <div class="mr-4">
          <input type="image" src="/images/lottery/buy-tickets-modal/close.png" @click="close">
        </div>
      </div>
      <div class="mt-16 px-4 text-white">
        <div class="flex justify-center my-8">
          <img src="/tokens/rdt-big.png" class="mt-1 mb-1 w-16">
        </div>
        <div class="flex">
          <div>
            <o-checkbox v-model="agree" e2e-id="accept-check" variant="info" class="default-text" />
          </div>
          <p>
            By connecting your wallet and using Ridotto, you agree to our <a target="_blank" href="/tos">Terms of Service</a> and <a target="_blank" href="/privacy">Privacy Policy</a>.
          </p>
        </div>
        <div class="flex justify-center my-8 gap-4">
          <button class="cta-normal w-full mt-4 h-14 text-base" @click="cancel">
            Cancel
          </button>
          <button
            e2e-id="accept-button"
            class="cta w-full mt-4 h-14 text-base disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-500  disabled:shadow-none"
            :class="{ 'disabled': !agree }"
            :disabled="!agree"
            @click="accept"
          >
            Accept and Sign
          </button>
        </div>
      </div>
    </div>
  </ModalsBaseModal>
</template>

<script lang="ts">
import { ref } from 'vue'
import { disconnect } from '@wagmi/core'
import { useSigning } from '~/composables/useSigning'
import useSignSafe from '~/web3/contracts/SignSafe'

export default {
  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    isSmall: {
      type: Boolean,
      requred: false,
      default: false
    }
  },
  emits: ['close'],
  setup(_props, { emit }) {
    const agree = ref(false)
    const close = async () => {
      await disconnect()
      emit('close')
    }
    const {
      giveConsent
    } = useSignSafe()
    const { getCurrentTerm, signTerm } = useSigning()

    const cancel = async () => {
      await disconnect()
      close()
    }

    const accept = async () => {
      if (!agree.value) {
        return
      }
      const lastTerm = await getCurrentTerm()
      const signature = await giveConsent(lastTerm.description)
      await signTerm(signature, lastTerm.description, lastTerm.version)

      emit('close')
    }

    return {
      close,
      agree,
      accept,
      cancel
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.modal-container) {
  width: 600px;
  height: 390px;
  overflow: hidden;
}

.cta {
  background-color: #9747FF;
  border-radius: 12px;
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  transition: 0.4s;

  &:hover {
    background-color: white;
    color: #9747FF;
  }

}

a {
  color: #fff947;
  text-decoration: none;
}

.cta-normal {
  border: 1px solid whitesmoke;
  border-radius: 12px;
}
</style>
