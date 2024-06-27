import { BrowserContext, expect, test as baseTest } from '@playwright/test'
import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright'
const ethers = require('ethers')

require('dotenv').config()

const { E2E_API_URL } = process.env

const testPK = ethers.Wallet.createRandom()

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
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
      networkName: 'sepolia',
      rpc: E2E_API_URL!,
      chainId: 11155111,
      symbol: 'SepoliaETH'
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

  await wallet.approve()

  await page.locator('*[e2e-id=accept-check] input').check()

  await page.locator('*[e2e-id=accept-button]').click()

  await wallet.sign()

  const connectStatus = await page.locator(`wui-account-button[address="${testPK.address}"]`)
  // await new Promise(() => {})

  expect(connectStatus).toBeTruthy()

  const wrongMessage = await page.locator(`wui-text[color="error-100"]`)

  await expect(wrongMessage).toHaveCount(0)
})
