import test, { Page, chromium, expect } from "@playwright/test";
import { log } from "console";

function generateUniqueNumber(): string {
    const now = new Date();
    return now.getFullYear().toString() +
           (now.getMonth() + 1).toString().padStart(2, '0') +
           now.getDate().toString().padStart(2, '0') +
           now.getHours().toString().padStart(2, '0') +
           now.getMinutes().toString().padStart(2, '0') +
           now.getSeconds().toString().padStart(2, '0') +
           now.getMilliseconds().toString().padStart(3, '0');
}

test.beforeAll(async ({}, testInfo) => {
});
  
test("Login test demo", async ({page, context, isMobile}) => {
    const mailPlatform = "@maildrop.cc";
    const desktop_email = "wdtest" + generateUniqueNumber();
    const mobile_email = "wmtest4" + generateUniqueNumber();
    await page.goto("https://beta.cyberplusplus.io/khoa-top-site");
    
    if(isMobile) {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mobile_email + mailPlatform);
    }
    else {
        await page.locator("//input[@id='email']").fill(desktop_email + mailPlatform);
    }

    await page.locator("//button[text()='Sign In']").click();
    await page.waitForLoadState('networkidle');

    const page2 = await context.newPage();
    await page2.bringToFront();
    
    let otp;
    let otpLocator = page2.frameLocator("//iframe[@class='w-full overflow-scroll']").locator("//*[text()='10 minutes']/following::*[1]");
    if(isMobile) {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + mobile_email);
            await page2.locator("(//*[contains(text(), 'Cyber')])[1]").click();
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [5000]});
    }
    else {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + desktop_email);
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [5000]});
    }

    await page.bringToFront();
    await page.locator("//input[@id='otp']").fill(otp);
    await page.locator("//button[text()='Verify']").click();

    if (isMobile) {
        await expect(page.locator("//*[name()='svg' and contains(@class, 'icon-tabler-bell')]")).toBeVisible();
    }
    else {
        await expect(page.locator("//*[text()='OPEN TASK(s)']")).toHaveText('OPEN TASK(s)');
    }
})