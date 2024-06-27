import { signMessage } from '@wagmi/core'
import { useAuth } from '~/store/useAuth'

export default function useSignSafe() {
  async function giveConsent(message: string) {
    const { setIsAcceptTerm } = useAuth()
    const signature2 = await signMessage({
      message
    })
    setIsAcceptTerm(true)
    return signature2
  }

  return {
    giveConsent
  }
}
