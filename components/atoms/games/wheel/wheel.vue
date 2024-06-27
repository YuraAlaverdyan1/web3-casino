<template>
  <div class="relative wheel-container pb-[18px] pt-[60px]">
    <img src="/games/wheel/stop.png" class="stop">
    <div class="wheel">
      <div class="colors">
        <div
          v-for="(color, i) of wheelColors"
          :key="i"
          :color="color.multiple"
          class="line"
          :style="`transform: rotate(${i * 20}deg)`"
        >
          <div class="line-item" :class="`m-${color.multiple}x`" />
        </div>
        <div class="wheel-blur-bg">
          <div ref="wheelDataContainer" class="wheel-data-container" :class="wheelDataContainerColor">
            {{ wheelText.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import wheelColors from '~/data/wheel-colors.json'
import { useSound } from '~/composables/useSound'
import numberForTransition from '~/data/games/wheel/numberForTransition.json'

const props = defineProps({
  isRotating: {
    type: Boolean,
    required: true
  },
  winningNumber: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['changeWinningNumber', 'rotatedColor'])
const { isDisabledSound } = useSound()
const winSound = new Audio('/sounds/wheel/wheel_win.mp3')
const loseSound = new Audio('/sounds/wheel/wheel_lose.mp3')
const playSound = new Audio('/sounds/wheel/wheel_play.mp3')
const wheelText = ref('Spin')
const wheelDataContainerColor = ref('default-container')

const wheelDataContainer = ref(null)
const isError = ref(false)
const data = wheelColors.reverse()
const rotated = ref(0)

const index = ref(17)
const rotCount = ref(0)

const winnerColor = ref(-1)
const rotateTo = ref(0)
const prevIndex = ref(null)

const activePlayIndex = ref(0)
const wheelDataContainerClassList = computed(() => wheelDataContainer.value?.classList)
const lines = computed(() => document.querySelectorAll('.line'))
const oneRotateDeg = 360
const defaultRotationsCount = 40
const randomRotateDeg = oneRotateDeg * defaultRotationsCount
const eachChildDeg = 20
const defaultTransition = 120

const changeWheelColor = (delay) => {
  const interv = setInterval(() => {
    const { multiple } = data[index.value]
    wheelText.value = `${multiple}X`
    wheelDataContainerColor.value = `m-${multiple}x`
    index.value = index.value > 0 ? index.value - 1 : 17
    if (
      typeof prevIndex.value === 'number'
        ? index.value === prevIndex.value
        : index.value === 17
    ) {
      rotCount.value = rotCount.value + 1
    }

    if (props.winningNumber === index.value || isError.value) {
      emits('rotatedColor', index.value)
      if (isError.value) {
        index.value = 17
      }
      prevIndex.value = index.value
      rotCount.value = 0

      clearInterval(interv)
      if (!isDisabledSound) {
        if (props.winningNumber === 14) {
          loseSound.play()
        } else {
          winSound.play()
        }
      }
    }
  }, delay)
}

const rotate = (rotateTo, firstTime = false) => {
  const childs = document.querySelectorAll('.line')
  for (let i = 0; i < childs.length; i++) {
    const wheelTransform = childs[i].style.transform
    const rotated = !firstTime
      ? +wheelTransform.match(/(\d+)/)?.[0] -
      (defaultRotationsCount - rotCount.value) * oneRotateDeg
      : +wheelTransform.match(/(\d+)/)?.[0]
    childs[i].style.transform = `rotate(${+rotated + rotateTo}deg)`
    if (!(+childs[i].style.transform.match(/(\d+)/)?.[0] % oneRotateDeg)) {
      winnerColor.value = childs[i]?.attributes.color?.value
    }
  }
}

watch(
  () => [props.isRotating, props.winningNumber],
  () => {
    if (props.isRotating) {
      if (props.winningNumber == null) {
        wheelDataContainerClassList.value.add('animate')
        rotateTo.value =
          randomRotateDeg + (rotated.value ? oneRotateDeg - rotated.value : 0)
        const oneDegTime = ((defaultTransition * 1000) / rotateTo.value) * eachChildDeg
        changeWheelColor(oneDegTime)
        activePlayIndex.value = activePlayIndex.value + 1
        rotate(rotateTo.value, true)
        lines.value.forEach((line) => {
          line.style.transition = `${defaultTransition}s linear`
        })
      } else {
        playSound.play()
        const x =
          (props.winningNumber > 6 ? randomRotateDeg + oneRotateDeg : randomRotateDeg) -
          (defaultRotationsCount - 1) * oneRotateDeg +
          (props.winningNumber + 1) * -eachChildDeg
        lines.value.forEach((line) => {
          line.style.transition = `${((x -
            oneRotateDeg / 2 +
            (typeof prevIndex.value === 'number'
              ? numberForTransition[props.winningNumber]
              : 0)) *
            defaultTransition) /
            rotateTo.value -
            (activePlayIndex.value === 1 ? 0.5 : 0)
            }s linear`
        })

        rotateTo.value = x + (x > oneRotateDeg ? 0 : oneRotateDeg)
        rotated.value = rotateTo.value
        wheelDataContainerClassList.value.add('animate')
        rotate(rotateTo.value)
      }
    } else if (!props.winningNumber) {
      isError.value = true
      wheelDataContainerClassList.value.add('animate')
      lines.value.forEach((line) => {
        line.style.transition = `4s linear`
      })
      rotate(720)
      setTimeout(() => {
        wheelDataContainerColor.value = 'default-container'
        wheelText.value = 'Spin'
      }, 300)
      setTimeout(() => {
        isError.value = false
      }, 4100)
    }
  }
)
</script>

<style lang="scss" scoped>
.default-container {
  background: #2c2634;
  color: white;
}

.wheel-container {
  @screen sm {
    height: fit-content;
  }

  height: 370px;
  @apply flex items-center justify-center w-full;
}

.wheel {
  @screen sm {
    width: 420px;
    height: 420px;
  }

  width: 320px;
  height: 320px;
  background: #38333f;
}

.colors {
  @apply relative h-full overflow-hidden;
}

.line {
  height: 101%;
  width: 68px;
}

.line-item {
  height: 50%;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
}

.wheel-data-container,
.line,
.wheel-blur-bg {
  @apply absolute top-0 left-0 right-0 bottom-0 m-auto;
}

.wheel-data-container,
.wheel,
.wheel-blur-bg,
.colors {
  clip-path: circle(50% at 50% 50%);
}

.wheel-blur-bg {
  width: 82%;
  height: 82%;
  background: rgba(44, 38, 52, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 320px;
  border: 4px solid #38333f;
}

.wheel-data-container {
  width: 92%;
  height: 92%;
  transition: 0.07s;
  @apply flex items-center justify-center sm:text-7xl text-6xl font-semibold;
}

.stop {
  @screen sm {
    top: 5%;
  }

  z-index: 10;
  top: -10px;
  width: 80px;
  @apply absolute left-0 right-0 m-auto;
}
</style>
