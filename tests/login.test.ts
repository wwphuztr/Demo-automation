import test, { Page, chromium } from "@playwright/test";


// test.beforeAll(async ({}, testInfo) => {
    
// });
  
test("Login test demo", async ({page, context, browser}) => {

    await page.goto("https://beta.hideout.cyberplusplus.io/");
    await page.getByPlaceholder(' ').fill('wwtest@mailinator.com');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    const page2 = await context.newPage();
    await page2.bringToFront();
    await page2.goto("https://www.mailinator.com/v4/public/inboxes.jsp");
})

test("Navigate URL", async ({page, context, browser}) => {

    await page.goto("https://chatgpt.com/");
    await page.waitForLoadState('networkidle');
})

test("Navigate URL2", async ({page, context, browser}) => {

    await page.goto("https://ngrok.com/download");
    await page.waitForLoadState('networkidle');
})

// test.afterAll(async ({browser}, testInfo) => {
//     await browser.close();
// });