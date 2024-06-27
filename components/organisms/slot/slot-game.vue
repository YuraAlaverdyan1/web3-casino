<template>
  <div :style="`background-image: url(${background})`" class="slot-container flex justify-center gap-10">
    <div style="width: 15%;" class="py-6">
      <img :src="namePanel" style="height: 800px;">
    </div>
    <div class="relative flex justify-center items-center flex-col w-1/2">
      <img :src="panel">
      <div>
        <div>
          <img :src="elementsPanel" class="absolute top-0 left-0 m-auto" style="width: 88%; bottom: 17%; right: 68px;">
          <div class="absolute top-40 left-12 right-20 bottom-72 m-auto flex overflow-hidden pr-4">
            <div v-for="(el, index) of data" :key="index" class="slot-images-line gap-2">
              <img v-for="(elm, i) of el" :key="i" :src="elm.image" class="slotImage" style="min-width: 120px">
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center buttons">
        <div class="relative">
          <img :src="`/images/slots/${name}/buttons/balance.png`">
          <div class="slot-font absolute bottom-10 left-24">
            {{ balance }}
          </div>
        </div>
        <input type="image" :src="`/images/slots/${name}/buttons/play.png`" style="height: 70%" @click="spin">
        <BetBtn :bet="`${bet}.00`" :game="name" @dec="bet > 0 ? bet -= 4 : ''" @inc="bet <= 10 ? bet += 4 : ''" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'
import { useLoading } from '~/composables/useLoading'
interface Elements {
  image: string;
  name: string;
}
export default {
    props: {
      background: {
        type: String,
        required: true,
        default: ''
      },
      namePanel: {
        type: String,
        required: true,
        default: ''
      },
      name: {
        type: String,
        required: true,
        default: ''
      },
      panel: {
        type: String,
        required: true,
        default: ''
      },
      elementsPanel: {
        type: String,
        required: true,
        default: ''
      },
      elements: {
        type: Array as PropType<any>,
        required: true,
        default: () => []
      },
      balance: {
        type: String,
        required: true,
        default: ''
      }
    },
    setup(props) {
      const loadingStore = useLoading()
      const bet = ref(4)
      const y = ref(0)
      const spinIndexes = ref<Array<Array<Elements>>>([
        [],
        [],
        []
      ])
      const data: any = ref([
        [...props.elements],
        [...props.elements],
        [...props.elements],
        [...props.elements]
      ])

      const spin = () => {
        document.querySelectorAll('.slot-images-line').forEach(async (el: any, i) => {
          await init(el, i)
          setTimeout(() => {
            el.style.transition = `${1 + i}s`
            spinSlot(el, i)
          }, 50)
          el.style.transition = '0s'
        })
      }

      const init = (el: any, i) => {
        data.value[i] = [...props.elements]
        el.style.transform = 'translateY(0)'
      }

      const spinSlot = (el, i) => {
        const index = Math.round(Math.random() * 60) + 20
        for (let j = 0; j < index + 2; j++) {
          data.value[i].push(props.elements[j % 11])
        }
        el.style.transform = `translateY(${index * -140}px)`
        new Array(3).forEach((_el, Index) => {
          spinIndexes.value[Index].push(data.value[i][index + Index])
        })
      }

      onMounted(() => {
        loadingStore.start('demon-inc')
        setTimeout(() => {
          loadingStore.stop()
        }, 2000)
      })

      watch(spinIndexes.value, () => {
        for (let i = 0; i < spinIndexes.value.length; i++) {
          if (spinIndexes.value[i].every(el => el.name === spinIndexes.value[0][0].name)) {
            y.value++
          } else {
            y.value = 0
          }
        }
      })

      return {
        bet,
        data,
        spin
      }
    }
}
</script>

<style lang="scss" scoped>
    .slot-container {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
    .buttons {
        height: 200px;
    }
    .slot-images-line {
      display: grid;
      grid-template-columns: 25%;
      grid-auto-rows: 33% 33% 33%;
      transition: 1s;
    }
    .noTransition {
      transition: none !important;
      transform: translateY(0);
    }
</style>
