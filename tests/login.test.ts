import test, { Page, chromium, expect } from "@playwright/test";
import { log } from "console";


test.beforeAll(async ({}, testInfo) => {
});
  
test("Login test demo", async ({page, context, browser, isMobile}) => {
    const desktop_email = "wwtest10@mailinator.com";
    const mobile_email = "wwtest11@mailinator.com";
    await page.goto("https://beta.cyberplusplus.io/khoa-top-site");
    
    if(isMobile) {
        await page.locator("//input[@id='email']").fill(mobile_email);
    }
    else {
        await page.locator("//input[@id='email']").fill(desktop_email);
    }

    await page.locator("//button[text()='Sign In']").click();
    await page.waitForLoadState('networkidle');

    const page2 = await context.newPage();
    await page2.bringToFront();
    await page2.goto("https://www.mailinator.com/v4/public/inboxes.jsp");
    
    if(isMobile) {
        await page2.getByLabel('inbox field').fill(mobile_email);
    }
    else {
        await page2.getByLabel('inbox field').fill(desktop_email);
    }

    await page2.getByRole('button', { name: 'GO' }).click();
    // await page2.locator("((//*[*[normalize-space()='Cyber++'] and *[normalize-space()='22 min'] ])[last()]//*[normalize-space()='Cyber++'])[1]").click();

    const element = page2.locator("((//*[*[normalize-space()='Cyber++'] and *[normalize-space()='just now'] ])[last()]//*[normalize-space()='Agilyte account security code'])[1]").click();

    if(isMobile) {
        const otp = await page2.frameLocator('iframe[name="html_msg_body"]').locator("//*[text()='10 minutes']/following::*[1]").textContent();
    }
    else {
        const otp = await page2.locator("//*[text()='10 minutes']/following::*[1]").textContent();
    }

    await page.bringToFront();
    await page.locator("//input[@id='otp']").fill(otp);
    await page.locator("//button[text()='Verify']").click();

    await expect(page.locator("//*[text()='OPEN TASK(s)']")).toHaveText('OPEN TASK(s)');
})

// test.afterAll(async ({browser}, testInfo) => {
//     await browser.close();
// });