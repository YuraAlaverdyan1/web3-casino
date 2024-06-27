import oruga from '@oruga-ui/oruga-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(oruga)
})
