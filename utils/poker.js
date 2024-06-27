const getCardIndex = (card) => {
  if (+card[0]) {
    return +card.split('-')[0]
  }
  switch (card[0]) {
    case 'J':
      return 11
    case 'Q':
      return 12
    case 'K':
      return 13
    case 'A':
      return 14
  }
}

const checkEquality = (cards) => {
  return cards[0][0] === cards[1][0]
}

const checkFullHouse = (kindCard, cards) => {
  const lastCards = cards.filter(el => el[0] !== kindCard)
  const isFullHouse = checkEquality(lastCards)
  return isFullHouse ? 'FULL HOUSE' : '3 OF A KIND'
}

const getKindCards = (kindCards, cards) => {
  switch (kindCards.length) {
    case 1:
      return !+kindCards[0][0] ? 'JACKS OR BETTER' : false
    case 2:
      return kindCards[0][0] === kindCards[1][0] ? checkFullHouse(kindCards[0][0], cards) : '2 PAIR'
    case 3:
      return '4 OF A KIND'
    default:
      return false
  }
}

const findPairs = (cards, pairCards = []) => {
  for (let i = 0; i < cards.length; i++) {
    for (let j = 1; j < cards.length; j++) {
      if (cards[i][0] === cards[j][0] && i !== j) {
        pairCards.push(cards[i])
        cards.splice(i, 1)
        findPairs(cards, pairCards)
      }
    }
  }
  return pairCards
}

const flush = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    if (cards[0].at(-1) !== cards[i].at(-1)) {
      return false
    }
  }
  return true
}

const setCards = (cards) => {
  return cards.map((el) => {
    return { card: el, index: getCardIndex(el) }
  }).sort((a, b) => a.index - b.index)
}

const street = (cards) => {
  const newCards = setCards(cards)
  for (let i = 0; i < newCards.length - 1; i++) {
    if (newCards[i].index !== newCards[i + 1].index - 1) {
      return false
    }
  }
  return true
}

export const play = (cards) => {
  const kindCards = getKindCards(findPairs(cards), cards)
  if (!kindCards) {
    const isStreet = street(cards)
    const isFlush = flush(cards)
    if (isStreet && isFlush) {
      return setCards(cards)[0].index === 10 ? 'ROYAL FLUSH' : 'STREET FLUSH'
    } else if (isStreet) {
      return 'STREET'
    } else if (isFlush) {
      return 'FLUSH'
    }
    return false
  }
  return kindCards
}
