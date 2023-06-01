import { test, expect, chromium } from '@playwright/test'

test.skip('login as not a lecturer or student', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()

  await page.goto('https://consultation-scheduler.azurewebsites.net/')
  await page.getByLabel('Username or email address').click()
  await page.getByLabel('Username or email address').fill('test3@gmail.com')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('Testing1!')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.locator('#loginAlert div').filter({ hasText: 'Error' }).click()
  await page.getByText('Invalid Credentials').click()
  await page.getByText('To logout then login please click here!').click()
  await page.getByRole('link', { name: 'click here!' }).click()
})