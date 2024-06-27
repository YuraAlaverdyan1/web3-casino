import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useAuth = createGlobalState(
  () => {
    const isAuth = ref<boolean>(false)
    const signatureId = ref<string>('')
    const chains = ref<unknown>({})
    const nonce = ref<string>('')
    const userId = ref<string>('')
    const userDetails = ref<unknown>({})
    const jwtToken = ref<string>('')
    const signModal = ref<boolean>(false)
    const isAcceptTerm = ref<boolean | string>(false)

    const setUserId = (newID: string) => {
      userId.value = newID
    }

    const setNonce = (newNonce: string) => {
      nonce.value = newNonce
    }

    const setSignatureId = (newID: string) => {
      signatureId.value = newID
    }

    const setChains = (newChains: string) => {
      chains.value = newChains
    }

    const setJwtToken = (newToken: string) => {
      jwtToken.value = newToken
    }

    const setUserDetails = (newUser: string) => {
      userDetails.value = newUser
    }

    const setAuth = (value: boolean) => {
      isAuth.value = value
    }
    const setSignModal = (value: boolean) => {
      signModal.value = value
    }
    const setIsAcceptTerm = (value: boolean) => {
      isAcceptTerm.value = value
    }

    const t = localStorage.getItem('jwtToken') as string
    if (t) {
      setJwtToken(t)
    }

    return {
      setUserId,
      setNonce,
      setSignatureId,
      setChains,
      setJwtToken,
      setUserDetails,
      setAuth,
      isAuth,
      signatureId,
      chains,
      nonce,
      userId,
      userDetails,
      jwtToken,
      signModal,
      setSignModal,
      isAcceptTerm,
      setIsAcceptTerm
    }
  }
)
