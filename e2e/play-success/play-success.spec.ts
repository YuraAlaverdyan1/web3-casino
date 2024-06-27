import { BrowserContext, expect, test as baseTest } from '@playwright/test'
import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright'
const ethers = require('ethers')

require('dotenv').config()

const { E2E_API_URL } = process.env

const fixedPrivateKey = '0x48edafbadec2570cbbca75069f5f299945a9e176dab3479986fac6a446e01ce2';

const fixedWallet = new ethers.Wallet(fixedPrivateKey);

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

    await wallet.importPK(fixedWallet.privateKey)

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
    // console.log(msg);
  });
  await page.route('*/**/subgraphs', async route => {
    const json = { data: {} };
    await route.fulfill({ json });
  });
  await page.goto(`/casino`)
})

test('should could play coinflip', async ({ wallet, page }) => {
  await page.click('#connect-button')
  await page.locator('wui-flex wui-list-wallet[name=MetaMask]').click()

  console.log('1))))))')

  await wallet.approve()

  console.log('1.100))))))')
  await page.waitForTimeout(500);

  console.log('1.1))))))')
  await wallet.sign()

  console.log('1.2))))))')

  await page.waitForTimeout(3000);


  const connectStatus = await page.locator(`wui-account-button[address="${fixedWallet.address}"]`)

  console.log('3))))))')

  expect(connectStatus).toBeTruthy()

  const wrongMessage = await page.locator(`wui-text[color="error-100"]`)

  await expect(wrongMessage).toHaveCount(0)

  console.log('4))))))')

  await page.locator('*[e2e-id="/games/coinflip"]').click()

  
  console.log('5))))))')

  const locatorInputBet = page.locator('*[e2e-id="bet-input"]')

  await locatorInputBet.fill('1')

  await page.waitForTimeout(500);

  await page.locator('*[e2e-id=cta-play]').click()


  await wallet.confirmTransaction()

  //await new Promise(() => {})

  await page.waitForTimeout(120000);


  const resultText = await page.locator('*[e2e-id="play-results"]')
  console.log('resultText', resultText)

  await expect(resultText).toContainText('Roll 1/1')
})
