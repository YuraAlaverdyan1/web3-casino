require('dotenv').config()

const { E2E_API_URL } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.18',
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: E2E_API_URL
    },
    polygon: {
      url: 'https://cosmological-blue-ensemble.matic.quiknode.pro/3fdf12afec20dabfff3499d39302e8a648f60097/'
    }
  }
}
