import { test, expect, chromium } from '@playwright/test';

test.skip('search for consultation based on the lecturer name', async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('http://localhost:3000')
  // Test scenario 1
  await page.getByLabel('Username or email address').click()
  await page.getByLabel('Username or email address').fill('John@students.wits.ac.za')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('aa11BB@@')
  await page.getByRole('button', {name: 'Continue', exact: true}).click()
  await page.click('#teacherList');
  await page.selectOption('#teacherList', 'Michael Brown')

  // Check that the teacher is selected
  const selectedTeacher = await page.$eval('#teacherList', el => el.value)
  expect(selectedTeacher).toBe('Michael.Brown@wits.ac.za')

  // await page.click('#existingConsultations');
  // await page.selectOption('#existingConsultations', '2023-05-04')

  // // Check that the teacher is selected
  // const selectedConsultation = await page.$eval('#existingConsultations', el => el.value);
  // expect(selectedConsultation).toBe('2023-05-04');

  await page.click('#slotList')
  await page.selectOption('#slotList', '2023-05-25 at 15:00-16:00')

  // Check that the teacher is selected
  const selectedSlot = await page.$eval('#slotList', el => el.value)
  expect(selectedSlot).toBe('2023-05-25')
  // await page.getByLabel('Lecturer Name').click()
  // await page.getByLabel('Lecturer Name').fill('Smith')
  // await page.getByRole('button', {name: 'View Consultations', exact: true}).click()

  // await expect(page.getByText('Date: 2023-05-03')).toBeVisible()
  // await expect(page.getByText('Time: 11:00 - 12:00')).toBeVisible()
  // await expect(page.getByText('Status: approved')).toBeVisible()

  // // Test scenario 2
  // await page.getByRole('button', {name: 'Logout', exact: true}).click()
  // await page.getByLabel('Username or email address').click()
  // await page.getByLabel('Username or email address').fill('John@students.wits.ac.za')
  // await page.getByLabel('Password').click()
  // await page.getByLabel('Password').fill('aa11BB@@')
  // await page.getByRole('button', {name: 'Continue', exact: true}).click()
  // await page.getByLabel('Lecturer Name').click()
  // await page.getByLabel('Lecturer Name').fill('Rotenda')
  // await page.getByRole('button', {name: 'View Consultations', exact: true}).click()

  // await expect(page.getByText('No lecturer found with the specified name')).toBeVisible()
});

test('Prevent students from booking consultations with different lecturers simultaneously', async () => {
  test.slow(60000)
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('http://localhost:3000')

  // Test scenario 1
  await page.getByLabel('Username or email address').click()
  await page.getByLabel('Username or email address').fill('2305164@students.wits.ac.za')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('j5jf4ZTXE2eUx3-')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()

  await page.click('#teacherList')
  await page.selectOption('#teacherList', 'Test Case')

  // Check that the teacher is selected
  const selectedTeacher = await page.$eval('#teacherList', el => el.value)
  expect(selectedTeacher).toBe('Test.Case@wits.ac.za')

  await page.click('#slotList')
  await page.selectOption('#slotList', '2023-05-31 at 11:00-12:00')

  await page.click('#subperiodDropdown')
  // Select the desired option from the dropdown
  await page.selectOption('#subperiodDropdown', '11:00 - 11:15')

  await page.click('#bookButton')

  await page.waitForTimeout(15000)
  const message = await page.$eval('#messageContainer', el => el.textContent)

  // Expect the message to contain the expected text
  expect(message).toContain('Already has a consultation booked with Jane Smith on 2023-05-31 at 11:00 - 11:15')

  await page.close()
  await context.close()
  await browser.close()
});