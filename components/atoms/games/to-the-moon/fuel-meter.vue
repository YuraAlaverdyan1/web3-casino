<template>
  <div class="fuel_meter">
    <div v-for="(_, index) in emptyArray" :key="index" :class="{active:isPlaying}" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToTheMoon } from '~/composables/games/useToTheMoon'
import { useMiniGames } from '~/composables/useMiniGames'
const { isPlaying, valueBet } = useMiniGames()
const { fuelCount, setFuelCount } = useToTheMoon()
const isActiveText = ref<boolean>(false)
watch(() => valueBet.value, () => {
    setFuelCount(valueBet.value)
})
watch(() => fuelCount.value, () => {
    if (isPlaying.value) {
      isActiveText.value = true
    }
})
const emptyArray = computed(() => new Array(fuelCount.value))
</script>

<style lang="scss" scoped>
.fuel_meter{
    display: flex;
    gap: 2px;
    padding: 6px;
    border-radius: 6px;
    border: 2px solid #F5F5F7;
    height: 40px;
    width: 70px;
    div{
        width: 5px;
        height: 100%;
        background-color: #60F;
    }
    .active:last-child{
        animation: 1s activeFuel;
    }
    @keyframes activeFuel{
        0%{
            background-color: #60F;
        }
        25%{
            background-color: #F5F5F7;
        }
        50%{
            box-shadow: 0px 0px 3.12px 0px #F60, 0px 0px 6.24px 0px #F60, 0px 0px 21.84px 0px #F60, 0px 0px 43.68px 0px #F60, 0px 0px 74.88px 0px #F60, 0px 0px 131.04px 0px #F60;
        }
        75%{
            background: #F60;
            box-shadow:none;
        }
        100%{
            background-color: #60F;
        }
    }
}
</style>
