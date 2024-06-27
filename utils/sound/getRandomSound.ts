const soundsCount = {
  arcade: 6,
  coinflip: 7,
  slidedice: 5,
  wheel: 5,
  'chi-fou-mi': 6,
  'video-poker': 7,
  mine: 5
}

export const getRandomSound = (game) => {
  return new Audio(`/sounds/${game}/back-sounds/${game}_music${Math.floor(Math.random() * soundsCount[game!]) + 1}.mp3`)
}
