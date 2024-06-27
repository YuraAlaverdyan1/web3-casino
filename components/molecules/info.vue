<template>
  <div class="text-center flex flex-col gap-4 mb-4" :class="lottery ? 'flex-col-reverse mt-10' : ''">
    <div class="mt-6">
      <div class="default-text text-xl">
        {{ data.smallSubTitle }}
      </div>
      <div style="font-size: 40px; font-weight: 600; line-height: 1.1; color: white;">
        {{ data.smallTitle1 }} <span style="color: #FF6600;">{{ data.smallTitle2 }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
    props: {
        data: {
            type: Object as PropType<any>,
            required: true,
            default: () => {
                return {}
            }
        },
        button1Color: {
          type: String,
          required: false,
          default: 'blue'
        },
        button2Color: {
          type: String,
          required: false,
          default: 'blue'
        },
        lottery: {
          type: Boolean,
          required: false,
          default: false
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
