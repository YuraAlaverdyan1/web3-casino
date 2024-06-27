import { createGlobalState, watchDebounced } from '@vueuse/core'
import axios from 'axios'
import { ref, watch } from 'vue'
import { useWeb3 } from '~/composables/useWeb3'
import { useAuth } from '~/store/useAuth'

export const useLeaderboard = createGlobalState(() => {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const { jwtToken } = useAuth()
  const { web3Global } = useWeb3()
  const leaderBoardList = ref([])
  const filterBy = ref('all_time')

  async function getLeaderboard(chainId) {
    const { data } = await axios.post(
      `${config.public.apiBase}metrics/leaderboard/${parseInt(chainId, 16)}`,
      {
        timeFilter: filterBy.value
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`
        }
      }
    )
    leaderBoardList.value = data.result.sort((a, b) => b.volume - a.volume)
  }

  watchDebounced(() => web3Global?.chain?.chainId,
    () => {
      if (web3Global?.chain?.chainId) {
        getLeaderboard(web3Global.chain.chainId)
      } else {
        getLeaderboard(56)
      }
    },
    { deep: true, immediate: true, debounce: 1000 }
  )

  watch(filterBy, () => {
    if (web3Global?.chain?.chainId) {
      getLeaderboard(web3Global.chain.chainId)
    } else {
      getLeaderboard(56)
    }
  })

  return {
    leaderBoardList,
    filterBy
  }
})
