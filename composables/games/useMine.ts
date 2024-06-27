import { ref, computed } from 'vue'
import { Web3 } from 'web3'
import { createGlobalState, computedAsync } from '@vueuse/core'
import { useGameStatus } from '../useGameStatus'
import { useSound } from '../useSound'
import { PlayableGame } from '~/composables/useMiniGames'
import { resolveGame } from '~/utils/web3/resolveGame'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { useWeb3 } from '~/composables/useWeb3'
import mineAbi from '~/data/web3/abi/Mine.json'
import mineGql from '~/queries/mine.gql'

export enum MinesType {
  MINES = 'mines',
  GOLD = 'gold',
  STONES = 'stones',
  EMPTY = ''
}

export const useMine = createGlobalState(() => {
  const { account } = useWalletConnect()
  const mines = ref<{selected:boolean, type: MinesType}[]>(new Array(25).fill({ selected: false, type: MinesType.EMPTY }))
  const numMines = ref<number>(1)
  const activeStatus = ref<string>('')
  const contractAddress = computed(() => resolveGame('mine'))
  const { isDisabledSound } = useSound()
  const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com') // only for sepolia
  const tokensToClaim = ref()
  const getContract = ref()
  const finishGameFC = ref()
  const betValue = ref()
  const cashOut = ref(false)
  const lastWonSize = ref(0)
  const totalWinningsRef = ref<number[]>([])
  const gameScoreRef = ref(0)
  const lastResultsSize = ref<number[]>([])
  const playSound:HTMLAudioElement = new Audio('/sounds/mine/play.mp3')
  const winSound:HTMLAudioElement = new Audio('/sounds/mine/win.mp3')
  const loseSound:HTMLAudioElement = new Audio('/sounds/mine/lose.mp3')
  const bomb1Sound:HTMLAudioElement = new Audio('/sounds/mine/bomb1.mp3')
  const bomb2Sound:HTMLAudioElement = new Audio('/sounds/mine/bomb2.mp3')
  const goldSound:HTMLAudioElement = new Audio('/sounds/mine/gold.mp3')
  const diamondSound:HTMLAudioElement = new Audio('/sounds/mine/diamond.mp3')
  const {
    executeTransaction,
    toWei,
    allowance,
    MAX_APPROVE_VAL,
    approve,
    web3Contract
  } = useWeb3()
  const contract = computed(() => web3Contract(getAbi(), contractAddress.value))

  const multipler = computedAsync<number>(async () => {
    return Number(await contract.value.read.Mines_GetMultipliers([numMines.value, revealedCount.value])) / 10000
  }, 0, { lazy: true })

  const revealedCount = computed<number>(() => {
    return mines.value.reduce((acc, obj) => {
      return (obj.selected || obj.type) ? acc + 1 : acc
    }, 0)
  })

  const { gameStatus } = useGameStatus()

  const getAbi = () => {
    return mineAbi
  }

  const getGql = () => {
    return mineGql
  }

  const runMineGame = (props) => {
    if (!isDisabledSound.value) {
      playSound.play()
    }
    const { selectedToken, valueBet, getSmartcontractAddress, unclaimTokens, finishGame, isCashOut = false } = props
    tokensToClaim.value = unclaimTokens.value
    getContract.value = getSmartcontractAddress
    finishGameFC.value = finishGame
    cashOut.value = isCashOut
    betValue.value = valueBet.value
    if (!activeStatus.value) {
      activeStatus.value = 'start'
      openMines({
        token: selectedToken.value.token,
        wager: valueBet.value
      })
    } else if (
      (activeStatus.value === 'reveal')
    ) {
      reveal()
    }
  }

  const getTransactionData = async (txHash: `0x${string}`) => {
    const receipt = await web3.eth.getTransactionReceipt(txHash)

    if (receipt && receipt.logs) {
      const decodedLogs: any[] = []
      for (let i = 0; i < receipt.logs.length; i++) {
        const log: any = receipt.logs[i]
        const eventSignature = log.topics[0]

        const eventAbi = mineAbi.find(
          item => item.type === 'event' && web3.eth.abi.encodeEventSignature(item) === eventSignature
        )

        if (eventAbi) {
          const decodedLog: any = web3.eth.abi.decodeLog(eventAbi.inputs, log.data, log.topics.slice(1))
          decodedLogs.push(decodedLog)
        }
      }

      return decodedLogs
    }
  }
  const checkIsGameEnded = async (trx: `0x${string}`):Promise<void> => {
    const data = await getTransactionData(trx)
    const minesIndexes: number[] = data![0].minesTiles.map((mine, index) => mine ? index : undefined).filter(index => index !== undefined)
    mines.value = mines.value.map((mine, index) => {
      if (minesIndexes.includes(index)) {
        mine.type = MinesType.MINES
      } else if (mine.selected) {
        mine.type = Math.random() < 0.5 ? MinesType.GOLD : MinesType.STONES
      }
      mine.selected = false
      return mine
    })
    if (data![0].minesTiles.includes(true) || cashOut.value) {
      setBalance(!data![0].minesTiles.includes(true))
      setTimeout(() => {
        mines.value = new Array(25).fill({ value: MinesType.EMPTY, selected: false, type: MinesType.EMPTY })
        activeStatus.value = ''
      }, 2000)
    }
    if (!isDisabledSound.value) {
      const hasMinesTiles = data![0].minesTiles.includes(true)
      const playSound = (sound: HTMLAudioElement) => {
        setTimeout(() => {
          sound.play()
        }, 500)
      }

      if (hasMinesTiles) {
        playSound(loseSound)
        Math.round(Math.random()) ? bomb1Sound.play() : bomb2Sound.play()
      } else {
        playSound(winSound)
        const hasGoldMine = mines.value.some(mine => mine.type === MinesType.GOLD)
        hasGoldMine ? goldSound.play() : diamondSound.play()
      }
    }
  }

  const claim = async (reqId) => {
    try {
      const response = await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'claim',
        abi: mineAbi,
        params: [Number(reqId)]
      })
      if (response) {
        activeStatus.value = 'reveal'
        await checkIsGameEnded(response)
        gameStatus.value = {
          text: 'Blockchain confirmation successful',
          color: 'green'
        }
      }
    } catch (err) {
      setTimeout(async () => {
        await claim(reqId)
      }, 2000)
    }
  }

  const setBalance = (isWin: boolean) => {
    const balance = multipler.value * betValue.value * +isWin
    tokensToClaim.value = balance
    lastWonSize.value = balance
    lastResultsSize.value = [balance]
    gameScoreRef.value++
    if (totalWinningsRef.value.length < gameScoreRef.value) {
      totalWinningsRef.value = [...totalWinningsRef.value, balance]
    }
  }

  const endGame = async () => {
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }
    try {
      const trx = await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'Mines_End',
        abi: mineAbi,
        params: []
      })
      if (trx) {
        mines.value = new Array(25).fill({ value: MinesType.EMPTY, selected: false, type: MinesType.EMPTY })
        activeStatus.value = ''
        gameStatus.value = { text: 'Random Number Received', color: 'green' }
        setBalance(true)
      }
    } catch (error) {
      console.log(error, 'error end game')
    }
  }

  const getReqIdAndCallClaim = async () => {
    const reqId = await contract.value.read.currentReqIds([account.value.address])
    await claim(reqId)
  }

  const reveal = async () => {
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }

    let response
    try {
      response = await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'Mines_Reveal',
        abi: mineAbi,
        params: [mines.value.map(mine => mine.selected), cashOut.value]
      })
      if (response) {
        await getReqIdAndCallClaim()
        gameStatus.value = {
          text: 'Waiting for Random Number',
          color: 'yellow'
        }
      }
    } catch (error) {
      console.log(error, 'error reveal')
    }
    return response
  }

  const openMines = async (options: PlayableGame) => {
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }
    const { wager, token } = options
    let response
    try {
      const value = await allowance(token, contractAddress.value)

      if (value < +wager) {
        await approve(token, contractAddress.value, MAX_APPROVE_VAL)
      }

      response = await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'Mines_Start',
        abi: mineAbi,
        params: [toWei(wager), token, +numMines.value, mines.value.map(mine => mine.selected), cashOut.value]
      })

      if (response) {
        await getReqIdAndCallClaim()
        gameStatus.value = {
          text: 'Waiting for Random Number',
          color: 'yellow'
        }
      }
    } catch (error) {
      console.log(error)
    }
    return response
  }

  const play = async (options: PlayableGame) => {
    return await openMines(options)
  }

  return { getAbi, getGql, play, mines, numMines, multipler, revealedCount, runMineGame, reveal, activeStatus, endGame, tokensToClaim, lastWonSize, lastResultsSize, totalWinningsRef, gameScoreRef }
})
