<template>
  <o-carousel
    v-model="Active"
    :arrow="false"
    :indicator="false"
    :items-to-show="itemsToShow"
    :repeat="false"
    :has-drag="true"
  >
    <o-carousel-item v-for="(item, index) of data" :key="index">
      <WishlistItem
        :key="index"
        :first-item="index === Active"
        :limit="item.limit"
        :completed="item.completed"
        :token="item.token"
        :image="item.image"
      />
    </o-carousel-item>
  </o-carousel>
</template>

<script lang="ts">
import { PropType, ref, watch } from 'vue'
export default {
    props: {
        data: {
            type: Array as PropType<Array<any>>,
            default: () => []
        },
        active: {
          type: Number,
          required: true,
          default: 0
        },
        itemsToShow: {
          type: Number,
          required: true,
          default: 1
        }
    },
emits: ['setActive'],
    setup(props, { emit }) {
      const Active = ref(props.active)

      watch(() => props.active, () => {
        Active.value = props.active
      })

      watch(() => Active.value, () => {
        emit('setActive', Active.value)
      })
      return {
        Active
      }
    }
}
</script>
