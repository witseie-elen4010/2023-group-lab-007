import { test, expect, chromium } from '@playwright/test';

test('Login to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByLabel('Username or email address').click()
    await page.getByLabel('Username or email address').fill('test123@wits.ac.za')
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill('Test1234*')
    await page.getByRole('button', { name: 'Continue', exact: true }).click()

    // Assert that the navigation was successful
    const url = page.url()
    const urlRegex = /^(http:\/\/localhost:3000|https:\/\/dev-o7mami5mk8tbhdy5\.us\.auth0\.com\/authorize\/resume\?state=.*)\/?$/;
    expect(url).toMatch(urlRegex)
    })

test('click on a consultation event and display details modal', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByLabel('Username or email address').click()
    await page.getByLabel('Username or email address').fill('test123@wits.ac.za')
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill('Test1234*')
    await page.getByRole('button', { name: 'Continue', exact: true }).click()

    // Wait for the `displayConsultations` function to be called
    await page.waitForFunction(() => typeof displayConsultations === 'function');

    // Get the first event element
    await page.getByText('9:45a test').click()

    // Check if the consultations input field is populated with the expected value
    const consultationsTextField = await page.$('#consultations')
    const expectedValue = "42:\ttest"
    const updatedValue = await consultationsTextField.inputValue()
    expect(updatedValue).toBe(expectedValue)
    
    // Get the first event element
    await page.getByText('9:45a test').click()

    // Check if the consultation details modal is visible
    await page.waitForSelector('#consultationDetailsModal')
    const modal = await page.$('#consultationDetailsModal')
    expect(modal).toBeTruthy()
  
    // Check if the modal contains the expected consultation details
    const modalTitle = await modal.$('.modal-title')
    expect(await modalTitle.innerText()).toContain('test')

    // Close the modal
    const closeButton = await modal.$('.btn-close')
    await closeButton.click();
    await modal.waitForElementState('hidden')

    // Check if the consultation details modal is closed
    expect(await modal.isVisible()).toBe(false)
})

test('cancel a consultation from the calendar', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByLabel('Username or email address').click()
    await page.getByLabel('Username or email address').fill('test123@wits.ac.za')
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill('Test1234*')
    await page.getByRole('button', { name: 'Continue', exact: true }).click()

    // Wait for the `displayConsultations` function to be called
    await page.waitForFunction(() => typeof displayConsultations === 'function');

    // Get the first event element
    await page.getByText('9:45a test').click()

    // Check if the consultations input field is populated with the expected value
    const consultationsTextField = await page.$('#consultations');
    const expectedValue = "42:\ttest";
    const updatedValue = await consultationsTextField.inputValue();
    expect(updatedValue).toBe(expectedValue);

    // Click on the "Cancel Consultation" button in the modal
    const cancelConsultationButton = await page.waitForSelector('#cancelConsultation');
    await cancelConsultationButton.click()

    // Confirm the cancellation in the alert dialog
    await page.evaluate(() => {
        window.confirm = () => true
    })

    // Check if the status is unappoved
    await page.getByText('9:45a test').click()
    await page.waitForSelector('#consultationDetailsModal')
    const modal = await page.$('#consultationDetailsModal')
    const modalBody = await modal.$('.modal-body')
    expect(await modalBody.innerText()).toContain('disapproved')
})