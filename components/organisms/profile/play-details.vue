<template>
  <div
    class="play-details-container w-full flex flex-col gap-[40px] md:max-w-[calc(100%-360px)]"
  >
    <refferal :code="referralCode" />
    <div
      class="flex gap-[24px] px-[24px] md:px-[0px] flex-col sm:flex-row w-full"
    />
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { PropType, onMounted, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { BreakPoint } from '~/model/break-points'
import Refferal from '~/components/molecules/profile/refferal.vue'
import { useAuth } from '~/store/useAuth'

export default {
  components: { Refferal },

  props: {
    data: {
      type: Object as PropType<any>,
      required: true,
      default: () => {
        return {}
      }
    },
    refLink: {
      type: String,
      required: false,
      default: ''
    },
    isInviteFriendsModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['isInviteFriendsModal', 'changeActive'],
  setup() {
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    const breakpoints = useBreakpoints(BreakPoint)
    const isSmall = breakpoints.smaller('sm').value
    const { jwtToken } = useAuth()
    const referralCode = ref('')
    onMounted(async () => {
      const { data: { result } } = await axios.get(`${config.public.apiBase}auth/details`, {
          headers: {
            Authorization: `Bearer ${jwtToken.value}`
          }
        })
        referralCode.value = result.referralCode
    })
    return {
      isSmall,
      referralCode,
      config
    }
  }
}
</script>

<style lang="scss" scoped>
.play-details-container {
  border-radius: 12px;
}
</style>
