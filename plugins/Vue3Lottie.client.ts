// eslint-disable-next-line import/no-named-as-default
import Vue3Lottie from 'vue3-lottie'

// eslint-disable-next-line no-undef
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Lottie, { name: 'Vue3Lottie' })
})
