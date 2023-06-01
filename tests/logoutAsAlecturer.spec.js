import { test, expect, chromium } from '@playwright/test'

test.skip('Logout as a lecturer', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()

  await page.goto('https://consultation-scheduler.azurewebsites.net/')
  await page.getByLabel('Username or email address').click()
  await page.getByLabel('Username or email address').fill('test2@wits.ac.za')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('Testing1!')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Logout' }).click()
})