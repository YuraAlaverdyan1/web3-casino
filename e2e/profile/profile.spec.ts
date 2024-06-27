import { BrowserContext, expect, test as baseTest } from '@playwright/test'
import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright'
const ethers = require('ethers')

require('dotenv').config()

const { E2E_API_URL } = process.env

const testPK = ethers.Wallet.createRandom()

function makeid(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

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

test('should have changed username', async ({ wallet, page }) => {
  await page.click('#connect-button')
  await page.locator('wui-flex wui-list-wallet[name=MetaMask]').click()

  await wallet.approve()

  await page.locator('*[e2e-id=accept-check] input').check()

  await page.locator('*[e2e-id=accept-button]').click()

  await wallet.sign()

  await wallet.sign()


  await page.waitForTimeout(5000);

  await page.goto(`/profile`)

  await page.waitForTimeout(3000);

  await page.locator('*[e2e-id=edit]').click()

  const locatorInputBet = page.locator('*[e2e-id="user-name-input"]')

  const profileText = `profile-name-${makeid(15)}`

  await locatorInputBet.fill(profileText)
  
  await page.locator('*[e2e-id=confirm]').click()

  await page.waitForTimeout(3000);

  // await new Promise(() => {})

  const usernameText = await page.locator('*[e2e-id="username"]')
  console.log('usernameText', usernameText)

  await expect(usernameText).toContainText(profileText)
})
