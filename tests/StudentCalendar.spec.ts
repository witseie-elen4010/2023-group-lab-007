import { test, expect } from '@playwright/test';

test.skip('test Organizer Consultation', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.getByLabel('Username or email address').click()
  await page.getByLabel('Username or email address').fill('John')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('aa11BB@@')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  //Check Basic Student Dashboard
  await expect(page.getByRole('heading', { name: 'Student dashboard' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'June 2023' })).toBeVisible()
  await expect(page.getByText('11aTesting')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Delete Consultation' })).toBeHidden()
  await page.getByText('11aTesting').click()
  await page.getByText('11aTesting').click()
  // Check if the consultation details modal is visible
  await page.waitForSelector('#consultationDetailsModal')
  const modal = await page.$('#consultationDetailsModal')
  expect(modal).toBeTruthy()
  // Check if the modal contains the expected consultation details
  const modalTitle = await modal.$('.modal-title')
  expect(await modalTitle.innerText()).toContain('Testing')
  expect(page.getByText('Lecturer: Test.Case@wits.ac.za Date: 2023-06-07 Start Time: 11:00 End Time: 11:1')).toBeVisible()
  // Close the modal
  const closeButton = await modal.$('.btn-close')
  await closeButton.click();
  //Epect Canclled Consultation Button
  await expect(page.getByRole('button', { name: 'Delete Consultation' })).toBeVisible()
})

test.skip('test hidden cancel button when not organizer', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByLabel('Username or email address').click();
  await page.getByLabel('Username or email address').fill('John');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('aa11BB@@');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByText('9aWeb Development Fundamentals').click();
  //As not organizer should be hidden
  await expect(page.getByRole('button', { name: 'Delete Consultation' })).toBeHidden()

})

test.skip('test hidding consultations on calendar', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByLabel('Username or email address').click();
  await page.getByLabel('Username or email address').fill('John');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('aa11BB@@');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('11aTesting')).toBeVisible()
  await page.getByRole('button', { name: 'Hide Consultations on Calendar' }).click();
  await expect(page.getByText('11aTesting')).toBeHidden()
})



