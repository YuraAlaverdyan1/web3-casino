const multipliers = {
  1000: {
    label: 'block-1000',
    color: '#D00000',
    texture: '/games/plinko/multipliers/1000x.png',
    smallTexture: '/games/plinko/multipliers/small/1000x.png'
  },
  130: {
    label: 'block-130',
    color: '#DC2F02',
    texture: '/games/plinko/multipliers/130x.png',
    smallTexture: '/games/plinko/multipliers/small/130x.png'
  },
  26: {
    label: 'block-26',
    color: '#DC2F02',
    texture: '/games/plinko/multipliers/26x.png',
    smallTexture: '/games/plinko/multipliers/small/26x.png'
  },
  9: {
    label: 'block-9',
    color: '#E85D04',
    texture: '/games/plinko/multipliers/9x.png',
    smallTexture: '/games/plinko/multipliers/small/9x.png'
  },
  4: {
    label: 'block-4',
    color: '#E85D04',
    texture: '/games/plinko/multipliers/4x.png',
    smallTexture: '/games/plinko/multipliers/small/4x.png'
  },
  2: {
    label: 'block-2',
    color: '#E85D04',
    texture: '/games/plinko/multipliers/2x.png',
    smallTexture: '/games/plinko/multipliers/small/2x.png'
  },
  0.2: {
    label: 'block-0.2',
    color: '#F48C06',
    texture: '/games/plinko/multipliers/0.2x.png',
    smallTexture: '/games/plinko/multipliers/small/0.2x.png',
    middleTexture: { small: '/games/plinko/multipliers/small/0.2x-middle.png', big: '/games/plinko/multipliers/0.2x-middle.png' }
  }
  // 10: {
  //   label: 'block-10'
  // },
  // 5: {
  //   label: 'block-5'
  // },
  // 3: {
  //   label: 'block-3'
  // },
  // 2: {
  //   label: 'block-2'
  // },
  // 1.5: {
  //   label: 'block-1.5'
  // },
  // 1: {
  //   label: 'block-1'
  // },
  // 0.5: {
  //   label: 'block-0.5'
  // },
  // 0.3: {
  //   label: 'block-0.3'
  // }
}

export function getMultiplier(value) {
  return multipliers[value]
}

export const multiplyBlocks16Lines = [
  getMultiplier(1000),
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130),
  getMultiplier(1000)
]

export const multiplyBlocks15Lines = [
  getMultiplier(1000),
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130),
  getMultiplier(1000)
]
export const multiplyBlocks14Lines = [
  getMultiplier(1000),
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130),
  getMultiplier(1000)
]
export const multiplyBlocks13Lines = [
  getMultiplier(1000),
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130),
  getMultiplier(1000)
]
export const multiplyBlocks12Lines = [
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130)
]
export const multiplyBlocks11Lines = [
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130)
]
export const multiplyBlocks10Lines = [
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26)
]
export const multiplyBlocks9Lines = [
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26)
]
export const multiplyBlocks8Lines = [
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9)
]

export const multiplyBlocksByLinesQnt = {
  8: multiplyBlocks8Lines,
  9: multiplyBlocks9Lines,
  10: multiplyBlocks10Lines,
  11: multiplyBlocks11Lines,
  12: multiplyBlocks12Lines,
  13: multiplyBlocks13Lines,
  14: multiplyBlocks14Lines,
  15: multiplyBlocks15Lines,
  16: multiplyBlocks16Lines
}

export function getMultiplierByLinesQnt(value) {
  return multiplyBlocksByLinesQnt[value]
}
