import { test, expect, chromium } from '@playwright/test'
test.skip('Prevent students from booking consultations with different lecturers simultaneously', async () => {
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
  })
  
  test.skip('Prevent students from Joining consultations with different lecturers simultaneously', async () => {
    test.slow(40000)
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
    await page.selectOption('#teacherList', 'Jane Smith')
  
    // Check that the teacher is selected
    const selectedTeacher = await page.$eval('#teacherList', el => el.value)
    expect(selectedTeacher).toBe('Jane.Smith@wits.ac.za')
  
    await page.click('#existingConsultations')
    await page.selectOption('#existingConsultations', '2023-05-31')
  
    await page.click('#bookButton')
  
    await page.waitForTimeout(25000)
    const message = await page.$eval('#messageContainer', el => el.textContent)
  
    // Expect the message to contain the expected text
    expect(message).toContain('Already has a consultation booked with Jane Smith on 2023-05-31 at 11:30 - 12:00')
  
    await page.close()
    await context.close()
    await browser.close()
  })