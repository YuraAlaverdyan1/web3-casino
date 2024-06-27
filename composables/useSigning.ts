import { createGlobalState } from '@vueuse/core'
import axios from 'axios'

import { useWalletConnect } from '~/composables/useWalletConnect'
import { useAuth } from '~/store/useAuth'

export const useSigning = createGlobalState(
  () => {
    const { account } = useWalletConnect()
    const { setIsAcceptTerm } = useAuth()
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()

    async function getCurrentTerm() {
      const { data } = await axios.get<any>(`${config.public.apiBase}terms`)
      return data.result
    }

    async function getCurrentTermByUser() {
      const { data } = await axios.get<any>(`${config.public.apiBase}terms/${account.value.address}`)
      setIsAcceptTerm(true)
      return data.result
    }

    async function signTerm(signature: any, message: any, termVersion: any) {
      const { data } = await axios.post<any>(`${config.public.apiBase}terms/sign`, {
        address: account.value.address,
        signature,
        message: `${message}`,
        termVersion
      })
      return data.result
    }

    return {
      getCurrentTerm,
      getCurrentTermByUser,
      signTerm
    }
  })
