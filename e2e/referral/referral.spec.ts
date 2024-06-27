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
  await page.goto(`/casino`)
})

test('should copy referral', async ({ wallet, page, context }) => {
  await context.grantPermissions(["clipboard-read"]);

  await page.click('#connect-button')
  await page.locator('wui-flex wui-list-wallet[name=MetaMask]').click()

  await wallet.approve()

  await page.locator('*[e2e-id=accept-check] input').check()

  await page.locator('*[e2e-id=accept-button]').click()

  await wallet.sign()
  console.log('1))) wallet' )

  await wallet.sign()

  console.log('2))) wallet' )


  await page.waitForTimeout(5000);

  console.log('3))) wallet' )

  await page.goto(`/profile`)


  await page.waitForTimeout(3000);


  await page.locator('*[e2e-id=referral-code-copy]').click()

  console.log('4))) wallet' )

  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const clipboardContent = await handle.jsonValue();
  
  // Check that the clipboard contains correct UUID
  const referralCode = await page.locator('*[e2e-id="referral-code"]')
  console.log('referral-code', referralCode)
  const text = await referralCode.textContent()
  await expect(`127.0.0.1:3000/casino?referral=${text}`).toBe(clipboardContent)

  //await new Promise(() => {})
})

