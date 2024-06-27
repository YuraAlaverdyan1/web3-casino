<template>
  <div class="bg" @click="playSound()">
    <div v-if="loading.loading" class="loading backdrop-blur-lg">
      <div class="w-screen h-screen backdrop-blur-lg flex justify-center items-center">
        <vue3-lottie :animation-data="loadingAnimation" :height="600" :width="600" />
      </div>
    </div>
    <sign-message-modal />
    <buy-token-modal />
    <navigate />
    <div class="flex">
      <nav-menu />
      <div class="bg-[#171120]">
        <page404-nav v-if="path.includes('/404')" :is-small="isSmall" />
        <error-modal />
        <div
          class="relative lg:mr-[40px] max-w-none flex mx-auto lg:ml-auto"
          :class="[
            menu ? 'wide-screen' : 'narrow-screen',
            !path.includes('/404')
              ? 'justify-center md:justify-end'
              : 'justify-center'
          ]"
        >
          <slot />
        </div>
        <MobileBottomMenu v-if="isSmall || isLarge && path.includes('sports')" />
        <footer-part v-if="!path.includes('browse')" :is-small="isSmall" class="mt-[20px] sm:mt-[40px]" />
      </div>
    </div>
    <ShowMessageModal v-if="showMessage" :show-message="showMessage" :on-close="closeMessageModal" />
  </div>
</template>

<script lang="ts">
import { watch, computed, onBeforeMount, ref } from 'vue'
import { disconnect, signMessage } from '@wagmi/core'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useBreakpoints } from '@vueuse/core'
import makeBlockie from 'ethereum-blockies-base64'
import { Vue3Lottie } from 'vue3-lottie'
import { AccountController } from '@ridotto-io/w3-core'
import * as Sentry from '@sentry/vue'
import { useWalletConnect } from '../composables/useWalletConnect'
import BuyTokenModal from '~/components/organisms/modals/buy-token-modal.vue'
import { useMenu } from '~/composables/useMenu'
import loadingAnimation from '~/public/loading/loading.json'
import page404Nav from '~/components/atoms/page-404-nav.vue'
import navMenu from '~/components/organisms/home/menu.vue'
import { useLoading } from '~/composables/useLoading'
import Navigate from '~/components/Navigate.vue'
import FooterPart from '~/components/Footer.vue'
import { BreakPoint } from '~/model/break-points'
import { useAuth } from '~/store/useAuth'
import signMessageModal from '~/components/organisms/modals/sign-message-modal.vue'
import { useMobileMenu } from '~/composables/useMobileMenu'
import { useSound } from '~/composables/useSound'
import ErrorModal from '~/components/organisms/modals/error-modal.vue'

export default {
  components: {
    Navigate,
    navMenu,
    FooterPart,
    page404Nav,
    signMessageModal,
    Vue3Lottie,
    ErrorModal,
    BuyTokenModal
  },
  setup() {
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()

    Sentry.init({
      dsn: 'https://7b6145fff6347e777b5c43aa86d60aee@o4504219984003072.ingest.sentry.io/4506509114343424',
      environment: config.public.appEnv,
      initialScope: {
        tags: { baseHost: window.location.host }
      },
      integrations: [
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false
        })
      ],
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    })
    const breakpoints = useBreakpoints(BreakPoint)
    const router = useRouter()
    const route = useRoute()
    const { loading } = useLoading()
    const {
      setUserDetails,
      setAuth,
      setSignatureId,
      setJwtToken,
      setNonce,
      nonce,
      isAuth,
      jwtToken,
      signatureId,
      userId,
      isAcceptTerm
    } = useAuth()
    const { createMenu } = useMobileMenu()
    const localNonce = localStorage.getItem('nonce')
    const signatureLocal = localStorage.getItem('signatureId')
    const isAuthLocal = localStorage.getItem('isAuth')
    const showMessage = ref('')
    const { menu } = useMenu()
    const { isSoundReady } = useSound()
    const { getNonce, account, referralCode } = useWalletConnect()
    watch(
      () => menu.value,
      () => {
        if (menu.value) {
          document.body.classList.add('menu')
        } else {
          document.body.classList.remove('menu')
        }
      }
    )

    const playSound = () => {
      const isLocalSound = sessionStorage.getItem('isPlaySound')
      if (!isSoundReady.value && (isLocalSound === '1' || !isLocalSound)) {
        isSoundReady.value = true
      }
    }
    const path = computed(() => {
      return route.path
    })

    const isSmall = computed(() => breakpoints.smaller('sm').value)
    const isLarge = computed(() => breakpoints.smaller('lg').value)

    const closeMessageModal = () => {
      showMessage.value = ''
    }

    onBeforeMount(() => {
      createMenu('originals')
      if (
        (isAuthLocal === 'false' ||
          isAuthLocal === 'in-progress' ||
          isAuthLocal === 'none' ||
          !isAuthLocal) &&
        route.name === 'profile' &&
        !account.value.isConnected
      ) {
        router.push({
          name: 'index'
        })
      }
    })

    watch(
      () => route.path,
      () => {
        if (route.path.includes('sports')) {
          createMenu()
        } else {
          createMenu('originals')
        }
      })

    watch(
      () => loading.value.loading,
      () => {
        if (loading.value.loading) {
          document.body.style.overflowY = 'hidden'
        } else {
          document.body.style.overflowY = 'visible'
        }
      }
    )

    watch(
      () => [isAuth.value, route.name],
      () => {
        if (
          !isAuth.value &&
          route.name === 'profile' &&
          account.value.isConnected
        ) {
          showMessage.value = 'Please sign the message in the metamask'
        } else if (
          !isAuth.value &&
          route.name === 'profile' &&
          !account.value.isConnected
        ) {
          showMessage.value = 'Please connect your wallet first'
          router.push({
            name: 'index'
          })
        }
      }
    )

    watch(
      () => [nonce.value, isAcceptTerm.value],
       () => {
        if (
          ((!localNonce && !document.hidden) ||
            (localNonce !== `${nonce.value}` &&
              nonce.value &&
              !document.hidden) ||
            (!signatureLocal && !document.hidden)) &&
          isAcceptTerm.value
        ) {
          localStorage.setItem('signatureId', '')
          setSignatureId('')
          setUserDetails({})
          localStorage.setItem('isAuth', 'in-progress')
          setAuth(false)
          showMessage.value = 'Please sign the message in the metamask'
          setTimeout(() => {
            signMessage({
              message: `${nonce.value}`
            })
              .then((res) => {
                showMessage.value = ''
                setSignatureId(res)
                localStorage.setItem('isAuth', 'true')
                localStorage.setItem('nonce', nonce.value)
                localStorage.setItem('signatureId', res)
                setAuth(true)
              })
              .catch(async () => {
                setNonce('')
                showMessage.value = ''
                await disconnect()
                localStorage.setItem('isAuth', 'false')
              })
          }, 2000)
        } else {
          setSignatureId(signatureLocal)
        }
      }
    )

    watch(
      () => signatureId.value,
      () => {
        if (signatureId.value && nonce.value && userId.value) {
          setAuth(false)
          axios
            .post(`${config.public.apiBase}auth/logInWithEthereum`, {
              signature: `${signatureId.value}`,
              message: `${nonce.value}`,
              address: `${userId.value}`
            })
            .then((data) => {
              if (data.data.result) {
                setJwtToken(data.data.result)
                setAuth(true)
                localStorage.setItem('jwtToken', data.data.result)
              }
            })
        }
      }
    )

    watch(
      () => [router, route.name, jwtToken.value, account.value],
      (newValue) => {
        if (route.query.referral) {
          referralCode.value = route.query.referral as string
        }
        if (isAuth.value) {
          try {
            axios
              .get(`${config.public.apiBase}auth/details`, {
                headers: {
                  Authorization: `Bearer ${jwtToken.value}`
                }
              })
              .then(function (userInfo) {
                setUserDetails(userInfo.data.result)
                AccountController.setUserName(userInfo.data.result.userName)
                AccountController.setProfileImage(
                  `${makeBlockie(`${userInfo.data.result.address}`)}`
                )
                setAuth(true)
              })
              .catch((e) => {
                if (e.response.data.statusCode === 401 && userId.value) {
                  getNonce(userId.value)
                }
              })
          } catch {
            loading.value.loading = false
          } finally {
            loading.value.loading = false
          }
        }
        if (
          !newValue[2] &&
          route.name === 'profile' &&
          !account.value.isConnected
        ) {
          router.push({
            name: 'index'
          })
        }
      },
      { immediate: true }
    )

    return {
      loading,
      menu,
      isSmall,
      isLarge,
      path,
      isSoundReady,
      loadingAnimation,
      showMessage,
      playSound,
      closeMessageModal
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  background: linear-gradient(178.27deg,
      rgba(100, 65, 165, 0.04) -8.11%,
      rgba(42, 8, 69, 0.04) 107.72%),
    #1c1b1f;
}

.narrow-screen {
  @screen md {
    width: 96vw;
  }

  @screen lg {
    width: calc(100vw - 144px);
  }

  width: 100vw;
  margin: 0 auto;
}

.wide-screen {
  @screen lg {
    width: calc(100vw - 320px);
  }

  width: 100vw;
  margin: 0 auto;
}

.news-container {
  top: 7.2%;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 10%;
    transition: 0.7s;
  }
}
</style>
