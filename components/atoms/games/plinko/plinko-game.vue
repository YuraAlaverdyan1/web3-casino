<template>
  <div ref="plinkoContainer" class="plinko-container">
    <div id="plinko" />
  </div>
</template>

<script setup>
import { Bodies, Composite, Engine, Events, Render, Runner, World } from 'matter-js'
import { useBreakpoints } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { BreakPoint } from '~/model/break-points'
import { random } from '~/utils/helpers'
import config from '~/data/plinko-config'
import { getMultiplierByLinesQnt } from '~/data/multipliers'
import { usePlinko } from '~/composables/games/usePlinko'

const props = defineProps({
  selectedBet: {
    type: Number,
    required: true
  }
})

const { rows, ballsInGame, decrementGamesRunning, addMultiplier } = usePlinko()

const {
  pins: pinsConfig,
  colors,
  engine: engineConfig,
  sizes: sizesConfig
} = config

const plinkoContainer = ref(null)
const breakpoints = useBreakpoints(BreakPoint)

const screenSize = computed(() => {
  const lastPoints = breakpoints.current().value
  return lastPoints[lastPoints.length - 1]
})

const engine = ref(Engine.create())
const render = ref(null)

const inGameBallsCount = computed(() => {
  return ballsInGame.value
})

const pinGap = computed(() => {
  return sizesConfig[screenSize.value]?.pinGap
})

const pinSize = computed(() => {
  return sizesConfig[screenSize.value]?.pinSize
})

const ballSize = computed(() => {
  return sizesConfig[screenSize.value]?.ballSize
})

const worldWidth = computed(() => {
  return plinkoContainer.value?.offsetWidth
})

const worldHeight = computed(() => {
  return 550
})

function removeInGameBall() {
  decrementGamesRunning()
}

const pins = ref([])

const addPins = async () => {
  await Composite.remove(engine.value.world, pins.value)
  pins.value = []
  for (let l = 0; l < rows.value; l++) {
    const linePins = pinsConfig.startPins + l
    const lineWidth = linePins * pinGap.value
    for (let i = 0; i < linePins; i++) {
      const pinYMultiplier = 27
      const pinX =
        worldWidth.value / 2 - lineWidth / 2 + i * pinGap.value + pinGap.value / 2
      const first = (16 - rows.value) * 27 + 60
      const pinY = !l ? first : l * pinYMultiplier + first
      const pin = Bodies.circle(pinX, pinY, pinSize.value, {
        label: `pin-${i}`,
        render: {
          fillStyle: '#F5DCFF'
        },
        isStatic: true
      })
      pins.value.push(pin)
    }
  }
}

const addBall = (ballValue) => {
  const minBallX = worldWidth.value / 2 - pinSize.value * 3 + pinGap.value
  const maxBallX =
    worldWidth.value / 2 - pinSize.value * 3 - pinGap.value + pinGap.value / 2
  const ballY = (16 - rows.value) * 27 + 30
  const ballX = random(minBallX, maxBallX)
  const ballColor = ballValue <= 0 ? colors.text : colors.purple
  const ball = Bodies.circle(ballX, ballY, ballSize.value, {
    restitution: 1,
    friction: 0.6,
    label: `ball-${ballValue}`,
    id: new Date().getTime(),
    frictionAir: 0.05,
    collisionFilter: {
      group: -1
    },
    render: {
      fillStyle: ballColor
    },
    isStatic: false
  })
  Composite.add(engine.value.world, ball)
}

const pinsMaxCount = computed(() => {
  return rows.value + 2
})

const wallAngle = computed(() => {
  switch (screenSize.value) {
    case 'xs':
      return (Math.PI / 180) * 112
    case 'ss':
      return (Math.PI / 180) * 112
    case 'sm':
      return (Math.PI / 180) * 120
    case 'md':
      return (Math.PI / 180) * 123
    case 'lg':
      return (Math.PI / 180) * 122
    case 'xl':
      return (Math.PI / 180) * 133
    default:
      return 1
  }
})

const spaceBetweenWalls = () => {
  switch (screenSize.value) {
    case 'ss':
      return 22
    case 'sm':
      return 45
    case 'md':
      return 70
    case 'lg':
      return 90
    case 'xl':
      return 130
    default:
      return 1
  }
}

const walls = ref([])

const createWalls = () => {
  walls.value = []
  const x = (pinsMaxCount.value / 2) * (pinGap.value + pinSize.value) - 50
  const y = 7
  for (let i = 0; i < 2; i++) {
    const angle = i ? wallAngle.value : -wallAngle.value
    walls.value.push(
      Bodies.rectangle(
        i
          ? worldWidth.value / 2 - x + spaceBetweenWalls()
          : worldWidth.value / 2 + x - spaceBetweenWalls(),
        worldHeight.value / 2 + (17 - rows.value) * y,
        worldWidth.value * 2,
        40,
        {
          angle,
          render: {
            visible: false
          },
          isStatic: true
        }
      )
    )
  }
}

const getYStartCoordinate = () => {
  switch (screenSize.value) {
    case 'xl':
      return 40
    case 'lg':
      return 55
    case 'md':
      return 40
    case 'sm':
      return 45
    case 'ss':
      return 53
    default:
      return 50
  }
}

const createCanvas = () => {
  render.value?.canvas.remove()
  engine.value.gravity.y = engineConfig.engineGravity
  const element = document.getElementById('plinko')
  render.value = Render.create({
    element,
    bounds: {
      max: {
        y: worldHeight.value,
        x: worldWidth.value
      },
      min: {
        y: 0,
        x: 0
      }
    },
    options: {
      background: colors.background,
      hasBounds: true,
      width: worldWidth.value,
      height: worldHeight.value,
      wireframes: false
    },
    engine: engine.value
  })
  const runner = Runner.create()
  Runner.run(runner, engine.value)
  Render.run(render.value)
}

const isSmall = computed(() => {
  return breakpoints.smaller('lg').value
})

const multipliers = ref(getMultiplierByLinesQnt(rows.value))

const multipliersBodies = ref([])

const getMultipliersLineCount = computed(() => {
  if (rows.value >= 12) {
    if (
      ['xs', 'ss', 'md'].includes(screenSize.value) ||
      (screenSize.value === 'lg' && rows.value > 14)
    ) {
      return +rows.value
    } else if (screenSize.value === 'sm') {
      return +rows.value + 1
    } else if (screenSize.value === 'lg' && rows.value <= 14) {
      return +rows.value + 0.5
    }
  }
  switch (screenSize.value) {
    case 'xs':
    case 'ss':
    case 'lg':
      return +rows.value + 1
    case 'sm':
      return +rows.value + 1.5
    case 'md':
      return +rows.value + 0.7
    default:
      return +rows.value + 2
  }
})

const getBlockHeight = () => {
  switch (breakpoints.current().value.at(-1)) {
    case 'xl':
      return 4
    case 'lg':
      return 28
    case 'md':
      return 70
    case 'sm':
      return 60
    case 'ss':
      return 44
    default:
      return 40
  }
}

const createMultipliers = async (multiplierWidth) => {
  await Composite.remove(engine.value.world, multipliersBodies.value)
  multipliersBodies.value = []
  const backgroundRectangle = Bodies.rectangle(
    worldWidth.value / 2,
    worldHeight.value - 20,
    worldWidth.value,
    80,
    {
      isStatic: true,
      render: {
        fillStyle: '#171120'
      }
    }
  )
  let lastMultiplierX =
    worldWidth.value / 2 -
    (getMultipliersLineCount.value / 2) * (pinGap.value + pinSize.value)
  for (const multiplier of multipliers.value) {
    const multiplierTexture = isSmall.value
      ? multiplier.smallTexture
      : multiplier.texture
    const { width, scale } = multiplierWidth
    const blockHeight = getBlockHeight()
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + width + 8,
      worldHeight.value - getYStartCoordinate(),
      width,
      blockHeight,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            xScale: scale,
            yScale: scale,
            texture: multiplierTexture
          }
        }
      }
    )
    lastMultiplierX = multiplierBody.position.x
    multipliersBodies.value.push(multiplierBody)
  }
  multipliersBodies.value.unshift(backgroundRectangle)
}

function bet(betValue) {
  addBall(betValue)
}

function onCollideWithMultiplier(ball, multiplier) {
  ball.collisionFilter.group = 2
  World.remove(engine.value.world, ball)
  const ballValue = multiplier.label.split('-')[1]
  addMultiplier(ballValue)
  removeInGameBall()
  if (+ballValue <= 0) {
    return ''
  }
}

function onBodyCollision(event) {
  const pairs = event.pairs
  for (const pair of pairs) {
    const { bodyA, bodyB } = pair
    if (bodyA.label.includes('block')) {
      onCollideWithMultiplier(bodyB, bodyA)
    }
  }
}

const updateComposite = () => {
  Composite.add(engine.value.world, [
    ...pins.value,
    ...multipliersBodies.value,
    ...walls.value
  ])
}

const getSizeOfMultipliers = (width) => {
  switch (breakpoints.current().value.at(-1)) {
    case 'xl':
      return 1.14
    case 'lg':
      return 1.39
    case 'md':
      return width > 1000 ? (width > 1050 ? 2.3 : 2.14) : width > 960 ? 2.04 : 1.95
    case 'sm':
      return width > 800 ? (width < 880 ? 2.01 : 2.26) : width < 750 ? 1.75 : 1.86
    case 'ss':
      return width > 650 ? (width > 695 ? 2.8 : 2.5) : width > 605 ? 2.4 : 2.1
    default:
      return width > 450 ? (width > 500 ? 2.2 : 1.95) : width > 410 ? 1.83 : 1.65
  }
}

const getScaleOfMultipliers = (width) => {
  switch (breakpoints.current().value.at(-1)) {
    case 'xl':
      return 1.14
    case 'lg':
      return width > 685 ? (width > 740 ? 0.96 : 0.9) : width > 630 ? 0.84 : 0.76
    case 'md':
      return width > 1000 ? (width > 1050 ? 1.7 : 1.65) : width > 960 ? 1.7 : 1.65
    case 'sm':
      return width > 800 ? (width < 880 ? 1.5 : 1.47) : width < 750 ? 1.4 : 1.45
    case 'ss':
      return width > 650 ? (width > 695 ? 1.13 : 1.1) : width > 605 ? 1.07 : 1.05
    default:
      return 1
  }
}

onMounted(async () => {
  createCanvas()
  await addPins()
  createWalls()
  updateComposite()
  Events.on(engine.value, 'collisionStart', onBodyCollision)
})

onUnmounted(() => {
  World.clear(engine.value.world, true)
  Engine.clear(engine.value)
  render.value.canvas.remove()
  render.value.textures = {}
})

watch(
  () => inGameBallsCount.value,
  (newQuestion, oldQuestion) => {
    if (newQuestion > oldQuestion) {
      bet(props.selectedBet)
    }
  }
)

watch(
  () => rows.value,
  async () => {
    if (!inGameBallsCount.value) {
      multipliers.value = getMultiplierByLinesQnt(rows.value)
      await createMultipliers()
      await addPins()
      createWalls()
      updateComposite()
    }
  }
)

watch(
  () => worldWidth.value,
  async () => {
    sizesConfig.lg.pinGap = worldWidth.value / 20
    await createMultipliers({
      width: (worldWidth.value - 48) / (17 * getSizeOfMultipliers(worldWidth.value)),
      scale: getScaleOfMultipliers(worldWidth.value)
    })
  }
)
</script>

<style lang="scss" scoped>
.circles {
  @apply flex flex-col items-center justify-center gap-6;
}
.row {
  @apply flex items-center justify-center gap-10;
}
.circle {
  background: #e6e6e6;
  border-radius: 50px;
  height: 10px;
  width: 10px;
}
.plinko-container {
  min-height: 600px;
  @apply flex flex-col items-center gap-10 justify-end overflow-hidden;
}
</style>
