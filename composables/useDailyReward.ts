import { createGlobalState } from '@vueuse/core'
import axios from 'axios'
import { ref, watch } from 'vue'
import { watchAccount } from '@wagmi/core'
import { useAuth } from '~/store/useAuth'

export const useDailyReward = createGlobalState(() => {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const { jwtToken } = useAuth()
  const claimed = ref(false)
  const noreward = ref(false)
  const waitUntil = ref(0)

  const currentClaimable = ref<{amount?: number, dayIndex?: number, canClaimDate?: number }>({})

  function setClaimed(value: boolean) {
    claimed.value = value
  }

  function setNoreward(value: boolean) {
    noreward.value = value
  }

  async function claimPrize() {
    await axios.get(
      `${config.public.apiBase}auth/rewards/claim`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`
        }
      })
    claimHistory()
  }

  async function claimHistory() {
    currentClaimable.value = {}

    const { data } = await axios.get(
      `${config.public.apiBase}auth/rewards/weekly`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`
        }
      }
    )
    const result = data?.result

    const currentNoClaim = result?.find((item: any) => !item.isClaimed)

    const canClaim = currentNoClaim?.canClaimDate * 1000

    const now = new Date().getTime()

    if (now > canClaim) {
      currentClaimable.value = currentNoClaim
    } else {
      currentClaimable.value = { amount: 0 }
    }

    const differenceMilliseconds = canClaim - now
    const hoursToClaim = Math.floor(differenceMilliseconds / (1000 * 60 * 60))
    waitUntil.value = hoursToClaim
  }

  watchAccount((value) => {
    if (value?.address && jwtToken.value) {
      claimHistory()
    } else {
      currentClaimable.value = {}
    }
  })

  watch(
    () => jwtToken.value,
    () => {
      claimHistory()
    }
  )

  return {
    claimed,
    setClaimed,
    claimHistory,
    currentClaimable,
    claimPrize,
    waitUntil,
    setNoreward,
    noreward
  }
})
