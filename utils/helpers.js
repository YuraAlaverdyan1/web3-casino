import { useChiFouMi } from '~/composables/games/useChiFouMi'
import { useSound } from '~/composables/useSound'
import { ESports, SportMarkets, Sports } from '~/composables/useAzuro'
import chainsData from '~/data/web3/chains.json'

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const setDisable = (gsap) => {
  gsap.to('.animation-second-hand', { opacity: 0 }, '<')
  gsap.to('.selected-hand', { opacity: 1, right: 0 }, '<')
}

export const chiFouMiLoopedAnimation = (gsap, tl) => {
  setDisable(gsap)
  gsap.to('.selected-hand', { right: '15%' })
  gsap.to('.number', { opacity: 1, display: 'block' }, '>')
  gsap.to('.number', { background: 'url(/games/chi-fou-mi/last.png)' }, '>')
  gsap.to('.number', { background: 'url(/games/chi-fou-mi/second.png)' }, '>')
  gsap.to('.number', { background: 'url(/games/chi-fou-mi/first.png)' }, '>')
  gsap.to('.number', { opacity: 0, display: 'none' }, '>')
  gsap.to('.number', { background: 'url(/games/chi-fou-mi/last.png)' }, '>')
  gsap.fromTo('.chi', { opacity: 0 }, { opacity: 1 }, '>')
  gsap.fromTo('.fou', { opacity: 0 }, { opacity: 1 }, '>')
  gsap.fromTo('.mi', { opacity: 0 }, { opacity: 1 }, '>')
  gsap.fromTo('.chi-fou-mi-animation', { opacity: 1 }, { opacity: 0 }, '>')
  gsap.fromTo('.chi-fou-mi-animation', { display: 'flex' }, { display: 'none' }, '>')
  gsap.fromTo('.animation-second-hand', { left: 0 }, { opacity: 1, left: '20%' }, '>')
  const animations = [
    { background: 'url(/games/chi-fou-mi/paper.png)' },
    { background: 'url(/games/chi-fou-mi/scissors.png)' },
    { background: 'url(/games/chi-fou-mi/rock.png)' }
  ]

  for (const animation of animations) {
    tl.to('.animation-second-hand', animation, '>')
  }

  tl.repeat(-1)
}

export const chiFouMiAnimation = (gsap, hand, winner, tl) => {
  tl.pause()
  const { winSound, loseSound } = useChiFouMi()
  const { isDisabledSound } = useSound()
  gsap.to('.selected-hand', { opacity: 1, right: '15%' }, '>')
  gsap.to('.animation-second-hand', { opacity: 1, left: '20%', background: `url(/games/chi-fou-mi/${hand}.png)` }, '<')

  if (winner === 'win') {
    gsap.to('.animation-second-hand', { opacity: 0 }, '+=1')
    gsap.to('.selected-hand', {
      right: 0
    }, '+=1')

    gsap.to('.selected-hand', {
      onStarted: () => {
        if (!isDisabledSound.value) {
          winSound.play()
        }
      }
    }, '>')
  } else if (winner === 'lose') {
    gsap.to('.selected-hand', { opacity: 0 }, '+=1')
    gsap.to('.animation-second-hand', {
      left: '5%'
    }, '+=1')
    gsap.to('.animation-second-hand', {
      onStarted: () => {
        if (!isDisabledSound.value) {
          loseSound.play()
        }
      }
    }, '>')
  } else {
    gsap.to('.selected-hand', { scale: 0.9 }, '+=0.5')
    gsap.to('.animation-second-hand', { scale: 0.9, background: `url(/games/chi-fou-mi/${hand}.png)` }, '<')
    gsap.to('.selected-hand', { scale: 1 }, '+=0.5')
    gsap.to('.animation-second-hand', { scale: 1, background: `url(/games/chi-fou-mi/${hand}.png)` }, '<')
  }
}

export function random(min, max) {
  const random = Math.random()
  min = Math.round(min)
  max = Math.floor(max)

  return random * (max - min) + min
}

export const resolveGameIcons = (sport, random = 1) => {
  if (sport === Sports.Football) {
    return {
      image: `/betting/banners/football_${random}.webp`,
      icon: '/betting/icons/top-football.svg',
      bg: '/betting/icons/football-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_football_'
    }
  } else if (sport === Sports.Basketball) {
    return {
      image: `/betting/banners/basketball_${random}.webp`,
      icon: '/betting/icons/top-basketball.svg',
      bg: '/betting/icons/basketball-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_basketball_'
    }
  } else if (Object.values(ESports).find(e => e.includes(sport))) {
    return {
      image: `/betting/banners/e-sport_${random}.webp`,
      icon: '/betting/icons/e-sport-icon.svg',
      bg: '/betting/icons/e-sport-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_e-sport_'
    }
  } else if (sport === Sports.Tennis) {
    return {
      image: `/betting/banners/tennis_${random}.webp`,
      icon: '/betting/icons/top-tennis.svg',
      bg: '/betting/icons/tennis-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_tennis_'
    }
  } else if (sport === Sports.Cricket) {
    return {
      image: `/betting/banners/cricket_${random}.webp`,
      icon: '/betting/icons/top-cricket.svg',
      bg: '/betting/icons/cricket-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_cricket_'
    }
  } else if (sport === Sports.MMA) {
    return {
      image: `/betting/banners/mma_${random}.webp`,
      icon: '/betting/icons/top-boxing.svg',
      bg: '/betting/icons/octagon-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_mma_'
    }
  } else if (sport === Sports.Boxing) {
    return {
      image: `/betting/banners/boxing_${random}.webp`,
      icon: '/betting/icons/top-boxing.svg',
      bg: '/betting/icons/boxing-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_boxing_'
    }
  } else if (sport === Sports.IceHockey) {
    return {
      image: `/betting/banners/ice-hockey_${random}.webp`,
      icon: '/betting/icons/top-ice-hockey.svg',
      bg: '/betting/icons/ice-hockey-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_hockey_'
    }
  } else if (sport === Sports.AmericanFootball) {
    return {
      image: `/betting/banners/american-football_${random}.webp`,
      icon: '/betting/icons/top-rugby-union.svg',
      bg: '/betting/icons/rugby-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_american-football_'
    }
  } else if (sport === Sports.Baseball) {
    return {
      image: `/betting/banners/baseball_${random}.webp`,
      icon: '/betting/icons/top-baseball.svg',
      bg: '/betting/icons/baseball-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_baseball_'
    }
  } else if (sport === Sports.RugbyUnion) {
    return {
      image: `/betting/banners/rugby-union_${random}.webp`,
      icon: '/betting/icons/top-rugby-union.svg',
      bg: '/betting/icons/rugby-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_rugby_'
    }
  } else if (sport === Sports.RugbyLeague) {
    return {
      image: `/betting/banners/american-football_${random}.webp`,
      icon: '/betting/icons/top-rugby-union.svg',
      bg: '/betting/icons/rugby-icon.svg',
      styles: 'background-position: center;',
      stadion: 'stadion_rugby_'
    }
  } else {
    return {
      image: '',
      icon: ''
    }
  }
}

export const resolveIconLeague = (league) => {
  const countries = {
    france: '/betting/leagues/france.svg',
    england: '/betting/leagues/england.svg',
    spain: '/betting/leagues/spain.svg',
    poland: '/betting/leagues/world.svg',
    denmark: '/betting/leagues/world.svg',
    germany: '/betting/leagues/germany.svg',
    netherlands: '/betting/leagues/netherlands.svg',
    belgium: '/betting/leagues/world.svg',
    portugal: '/betting/leagues/portugal.svg',
    scotland: '/betting/leagues/world.svg',
    greece: '/betting/leagues/world.svg',
    australia: '/betting/leagues/world.svg',
    japan: '/betting/leagues/world.svg',
    'international-tournaments': '/betting/leagues/world.svg',
    argentina: '/betting/leagues/world.svg',
    italy: '/betting/leagues/italy.svg'
  }

  return countries[league.toLowerCase()] || '/betting/leagues/world.svg'
}

export const fixBigNumbers = (amount, token) => {
  if (token.toLocaleLowerCase() === chainsData[0].priceCalculation.usdt?.toLocaleLowerCase()) {
    return amount.toFixed(2)
  }
  return `${amount}`.split('.')[1] ? amount.toFixed(`${amount}`.split('.')[1].length) : amount
}

export const sportToMarketMap = {
  [Sports.Cricket]: SportMarkets.MatchWinner,
  [Sports.Basketball]: SportMarkets.MatchWinner,
  [Sports.Tennis]: SportMarkets.MatchWinner,
  [Sports.Baseball]: SportMarkets.MatchWinner,
  [Sports.MMA]: SportMarkets.FightWinner,
  [Sports.Boxing]: SportMarkets.FightWinner,
  [Sports.RugbyUnion]: SportMarkets.PointsHandicap,
  [Sports.RugbyLeague]: SportMarkets.MatchWinner,
  [ESports.CS2]: SportMarkets.MatchWinner,
  [ESports.Dota]: SportMarkets.MatchWinner,
  [ESports.LOL]: SportMarkets.MatchWinner
}

export const decToFrac = dec =>
  [...Array(1000).keys()].flatMap(
    i => [...Array(1000).keys()].map(
      j => [
        i + 1, j + 1, (i + 1) / (j + 1),
        Math.abs(((i + 1) / (j + 1)) - (dec - 1))
      ]
    )
  ).sort((a, b) => a[3] - b[3])[0].slice(0, 2).join('/')

export const decToUs = dec =>
  dec - 1 > 1 ? `${`${((dec - 1) / 100)}`.split('.')[1]}`.split('0')[1] : `-${(100 / Math.abs(dec - 1)).toPrecision(3)}`
