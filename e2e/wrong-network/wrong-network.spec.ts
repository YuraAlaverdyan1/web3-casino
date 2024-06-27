import { BrowserContext, expect, test as baseTest } from '@playwright/test'
import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright'
const ethers = require('ethers')

require('dotenv').config()

const testPK = ethers.Wallet.createRandom()

export const test = baseTest.extend<{
  context: BrowserContext
  wallet: Dappwright
}>({
  context: async ({}, use) => {
    const [wallet, _, context] = await dappwright.bootstrap('', {
      wallet: 'metamask',
      version: MetaMaskWallet.recommendedVersion,
      seed: 'test test test test test test test test test test test junk',
      headless: false 
    })

    await wallet.importPK(testPK.privateKey)

    await wallet.addNetwork({
      networkName: 'Aurora',
      rpc: 'https://aurora.drpc.org/',
      chainId: 1313161554,
      symbol: 'ETH'
    })

    await use(context)
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet('metamask', context)
    await use(metamask)
  }
})

test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => {
    console.log(msg);
  });
  await page.route('*/**/subgraphs', async route => {
    const json = { data: {} };
    await route.fulfill({ json });
  });
  await page.goto(`/casino`)
})

test('should be able to connect', async ({ wallet, page }) => {
  await page.click('#connect-button')
  await page.locator('wui-flex wui-list-wallet[name=MetaMask]').click()
  console.log('waiting for approve')

  await wallet.approve()

  console.log('waiting 1')

  await page.locator('*[e2e-id=accept-check] input').check()
  console.log('waiting 2')

  await page.locator('*[e2e-id=accept-button]').click()

  console.log('waiting 3')

  await wallet.sign()

  console.log('waiting for connect status')
  const connectStatus = await page.locator(
    `wui-account-button[address="${testPK.address}"]`
  )
  expect(connectStatus).toBeTruthy()
  // await new Promise(() => {})

  console.log('waiting for wrong network')
  const wrongMessage = await page.locator(`wui-text[color="error-100"]`)
  console.log('wrongMessage', wrongMessage)

  await expect(wrongMessage).toContainText('Wrong Network')
})
