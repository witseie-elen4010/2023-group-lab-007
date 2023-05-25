import { test, expect, chromium } from '@playwright/test';

test('search for consultation based on the lecturer name', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000');
  // Test scenario 1
  await page.getByLabel('Username or email address').click();
  await page.getByLabel('Username or email address').fill('John@students.wits.ac.za')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('aa11BB@@');
  await page.getByRole('button', {name: 'Continue', exact: true}).click()
  await page.getByLabel('Lecturer Name').click();
  await page.getByLabel('Lecturer Name').fill('Smith')
  await page.getByRole('button', {name: 'View Consultations', exact: true}).click()

  await expect(page.getByText('Date: 2023-05-03')).toBeVisible()
  await expect(page.getByText('Time: 11:00 - 12:00')).toBeVisible()
  await expect(page.getByText('Status: approved')).toBeVisible()

  // Test scenario 2
  await page.getByRole('button', {name: 'Logout', exact: true}).click()
  await page.getByLabel('Username or email address').click();
  await page.getByLabel('Username or email address').fill('John@students.wits.ac.za')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('aa11BB@@');
  await page.getByRole('button', {name: 'Continue', exact: true}).click()
  await page.getByLabel('Lecturer Name').click();
  await page.getByLabel('Lecturer Name').fill('Rotenda')
  await page.getByRole('button', {name: 'View Consultations', exact: true}).click()

  await expect(page.getByText('No lecturer found with the specified name')).toBeVisible()
});
