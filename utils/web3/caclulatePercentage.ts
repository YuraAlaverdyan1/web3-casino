export const caclulatePercentage = ({ poolBlockchainUser, item }) => {
  let result = 0
  const { address } = item
  if (!poolBlockchainUser[address] || !item?.rewardRequired) {
    return 0
  }
  if (poolBlockchainUser[address].earned) {
    result =
      (poolBlockchainUser[address].earned %
        item.rewardRequired) /
      item.rewardRequired
  }
  result = result * 100
  return +result.toFixed(2).replace(/[.,]000$/, '')
}
