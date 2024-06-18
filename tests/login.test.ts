import test, { Page, chromium, expect } from "@playwright/test";
import { log } from "console";
import exp from "constants";

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

let url = "https://beta.cyberplusplus.io/khoa-top-site";
const mailPlatform = "@maildrop.cc";
   
test("Verify user can log in via OTP", async ({page, context, isMobile}) => {
    const desktop_email = "wdtest" + generateUniqueNumber();
    const mobile_email = "wmtest4" + generateUniqueNumber();
    await page.goto(url);
    
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
    await page2.waitForTimeout(2000);

    let otp;
    let otpLocator = page2.frameLocator("//iframe[@class='w-full overflow-scroll']").locator("//*[text()='10 minutes']/following::*[1]");
    
    
    if(isMobile) {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + mobile_email);
            let email_title = page2.locator("(//*[contains(text(), 'Cyber')])[1]");
            await expect(email_title, "The email title is not visible").toBeVisible();
            await email_title.click();
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }
    else {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + desktop_email);
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }

    await page.bringToFront();
    await page.locator("//input[@id='otp']").fill(otp);
    await page.locator("//button[text()='Verify']").click();

    if (isMobile) {
        await expect(page.locator("//*[name()='svg' and contains(@class, 'icon-tabler-bell')]"), "The icon table bell is not visible => User can not navigate to HomePage").toBeVisible();
    }
    else {
        await expect(page.locator("//*[text()='OPEN TASK(s)']"), "The 'Open task' text is not visible, so the user can not navigate to HomePage").toHaveText('OPEN TASK(s)');
    }
})

test("Verify user cannot log in via OTP if not having permission", async ({page, context, isMobile}) => {
    const no_permission_mail= "wphu@maildrop.cc";
    await page.goto(url);
    if(isMobile) {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(no_permission_mail);
    }
    else {
        await page.locator("//input[@id='email']").fill(no_permission_mail);
    }

    await page.locator("//button[text()='Sign In']").click();

    await expect(page.locator("//*[text()='Access denied. You are not allowed to log in.']"), "The error message is not visible").toBeVisible();
})

test.only("Verify user cannot log in via OTP if input wrong OTP", async ({page, context, isMobile}) => {
    const email = "wrongOTP" + generateUniqueNumber() + mailPlatform;
    await page.goto(url);
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        expect(dialog.message(), "The error message 'Invalid OTP' is not correct").toBe("Invalid OTP")
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Accept all cookies' }).click();
    await page.locator("//input[@id='email']").fill(email);
    await page.locator("//button[text()='Sign In']").click();
    await page.waitForLoadState('networkidle');

    const wrongOTP = "12345";
    await page.locator("//input[@id='otp']").fill(wrongOTP);
    await page.locator("//button[text()='Verify']").click();

    if (isMobile) {
        await expect(page.locator("//*[name()='svg' and contains(@class, 'icon-tabler-bell')]"), "User still can navigate to HomePage").not.toBeVisible();
    }
    else {
        await expect(page.locator("//*[text()='OPEN TASK(s)']"), "User still can navigate to HomePage").not.toBeVisible();
    }
})

test("Verify display of Homepage site (Using element comparision)", async ({page, context, isMobile}) => {
    await page.goto(url);
    const user = "wmtest4202406161555432";
    const mail = user + mailPlatform;

    if(isMobile) {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mail);
    }
    else {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mail);
    }
    await page.locator("//button[text()='Sign In']").click();
    await page.waitForLoadState('networkidle');

    const page2 = await context.newPage();
    await page2.bringToFront();
    await page2.waitForTimeout(2000);

    let otp;
    let otpLocator = page2.frameLocator("//iframe[@class='w-full overflow-scroll']").locator("//*[text()='10 minutes']/following::*[1]");

    if(isMobile) {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + user);
            let email_title = page2.locator("(//*[contains(text(), 'Cyber')])[1]");
            await expect(email_title, "The email title is not visible").toBeVisible();
            await email_title.click();
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }
    else {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + user);
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }

    await page2.locator("//*[text()='Delete']").click();
    await page2.locator("//*[text()='Yes, Delete']").click();

    await page.bringToFront();
    await page.locator("//input[@id='otp']").fill(otp);
    await page.locator("//button[text()='Verify']").click();

    // Verify components of HomePage
    // Verify the Hamburger button at the right top by attribute 'd' of svg
    await expect(page.locator("//*[(name()='path' and @d='M3.75 12H20.25')]/ancestor::*[name()='svg']"), "The hamburger button is not visible or has been changed something").toBeVisible();
    await expect(page.locator("//*[(name()='path' and @d='M3.75 6H20.25')]/ancestor::*[name()='svg']"), "The hamburger button is not visible or has been changed something").toBeVisible();
    await expect(page.locator("//*[(name()='path' and @d='M3.75 18H20.25')]/ancestor::*[name()='svg']"), "The hamburger button is not visible or has been changed something").toBeVisible();

    if(!isMobile) {
        //====================== Verify Left Menu ======================//
        // Vitals
        await expect(page.locator("//*[text()='Vitals']"), "The 'Vitals' text is not visible").toBeVisible();
        // Open Tasks
        await expect(page.locator("//*[text()='OPEN TASK(s)']"), "The 'OPEN TASK(s)' text is not visible").toBeVisible();
        // Alliance
        await expect(page.locator("//*[contains(text(), 'Alliance')]"), "The 'Alliance' text is not visible").toBeVisible();
        // Refer a friend (Not available)
    }

    //====================== Main Content ======================//
    // Announcements
    await expect(page.locator("//div[@id='announcements']"), "The 'Announcements' section is not visible").toBeVisible();
    // Videos
    await expect(page.locator("//div[@id='videos']"), "The 'Videos' section is not visible").toBeVisible();
    // Games
    await expect(page.locator("//div[@id='games']"), "The 'Games' section is not visible").toBeVisible();
    // Articles
    await expect(page.locator("//div[@id='articles']"), "The 'Articles' section is not visible").toBeVisible();
    // Infographics
    await expect(page.locator("//div[@id='infographics']"), "The 'Infographics' section is not visible").toBeVisible();
    // Web pages
    await expect(page.locator("//div[@id='webPages']"), "The 'Web pages' section is not visible").toBeVisible();
    // Training
    await expect(page.locator("//div[@id='training']"), "The 'Training' section is not visible").toBeVisible();

    // console.log(await page.locator("//footer").getAttribute("background-color"));
    // const test = await page.locator("//footer");
    // const color = await test.evaluate((e) => {
    //     return window.getComputedStyle(e).getPropertyValue("--mainSolidColorBackground")
    // })
    // console.log(color);
    
    // await expect(page.locator("(//footer)[1]")).toBeVisible();
    // await expect(page.locator("(//footer)[1]")).toHaveCSS(
    //     "--mainSolidColorBackground",
    //     "#c00n"
    // )
})

test("Verify display of Homepage site (Using image comparision)", async ({page, context, isMobile}) => {
    await page.goto(url);
    const user = "wmtest4024061615545432";
    const mail = user + mailPlatform;

    if(isMobile) {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mail);
    }
    else {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mail);
    }
    await page.locator("//button[text()='Sign In']").click();
    await page.waitForLoadState('networkidle');

    const page2 = await context.newPage();
    await page2.bringToFront();
    await page2.waitForTimeout(2000);

    let otp;
    let otpLocator = page2.frameLocator("//iframe[@class='w-full overflow-scroll']").locator("//*[text()='10 minutes']/following::*[1]");

    if(isMobile) {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + user);
            let email_title = page2.locator("(//*[contains(text(), 'Cyber')])[1]");
            await expect(email_title, "The email title is not visible").toBeVisible();
            await email_title.click();
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }
    else {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + user);
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }

    await page2.locator("//*[text()='Delete']").click();
    await page2.locator("//*[text()='Yes, Delete']").click();

    await page.bringToFront();
    await page.locator("//input[@id='otp']").fill(otp);
    await page.locator("//button[text()='Verify']").click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page2.waitForTimeout(15000);

    await expect(page.locator("//div[@id='training']"), "The 'Training' section is not visible").toBeVisible();
    // await expect(page).toHaveScreenshot("testing.png", {fullPage: true});
    // Verify components of HomePage
    // Verify the Hamburger button at the right top by attribute 'd' of svg
    await expect(page.locator("//*[(name()='path' and @d='M3.75 12H20.25')]/ancestor::*[name()='svg']")).toHaveScreenshot("hambuger.png");

    //====================== Verify Left Menu ======================///
    // Vitals
    // Open Tasks
    // Alliance
    // Refer a friend (Not available)
    if(!isMobile) {
        await expect(page.locator("(//*[.//img[contains(@src, 'robot')] and .//*[text()='Vitals']])[last()]")).toHaveScreenshot("leftMenu.png");
    }

    //====================== Main Content ======================//
    // Announcements
    await expect(page.locator("//div[@id='announcements']")).toHaveScreenshot("announcements.png");
    await page2.waitForTimeout(1000);

    // Videos
    await expect(page.locator("//div[@id='videos']")).toHaveScreenshot("videos.png");
    await page2.waitForTimeout(1000);

    // Games
    await expect(page.locator("//div[@id='games']")).toHaveScreenshot("games.png");
    await page2.waitForTimeout(1000);

    // Articles
    await expect(page.locator("//div[@id='articles']")).toHaveScreenshot("articles.png");
    await page2.waitForTimeout(1000);

    // Infographics
    await expect(page.locator("//div[@id='infographics']")).toHaveScreenshot("infographics.png");
    await page2.waitForTimeout(1000);

    // Web pages
    await expect(page.locator("//div[@id='webPages']")).toHaveScreenshot("webPages.png");
    await page2.waitForTimeout(1000);

    // Training
    await expect(page.locator("//div[@id='training']")).toHaveScreenshot("training.png");
    await page2.waitForTimeout(3000);


    // console.log(await page.locator("//footer").getAttribute("background-color"));
    // const test = await page.locator("//footer");
    // const color = await test.evaluate((e) => {
    //     return window.getComputedStyle(e).getPropertyValue("--mainSolidColorBackground")
    // })
    // console.log(color);
    
    // await expect(page.locator("(//footer)[1]")).toBeVisible();
    // await expect(page.locator("(//footer)[1]")).toHaveCSS(
    //     "--mainSolidColorBackground",
    //     "#c00n"
    // )
})

test("Get color css of header and footer", async ({page, context, isMobile}) => {
    await page.goto(url);
    const user = "wmtest42024061615545432";
    const mail = user + mailPlatform;

    if(isMobile) {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mail);
    }
    else {
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator("//input[@id='email']").fill(mail);
    }
    await page.locator("//button[text()='Sign In']").click();
    await page.waitForLoadState('networkidle');

    const page2 = await context.newPage();
    await page2.bringToFront();
    await page2.waitForTimeout(2000);

    let otp;
    let otpLocator = page2.frameLocator("//iframe[@class='w-full overflow-scroll']").locator("//*[text()='10 minutes']/following::*[1]");

    if(isMobile) {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + user);
            let email_title = page2.locator("(//*[contains(text(), 'Cyber')])[1]");
            await expect(email_title, "The email title is not visible").toBeVisible();
            await email_title.click();
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }
    else {
        await expect(async ()=> {
            await page2.goto("https://maildrop.cc/inbox/?mailbox=" + user);
            await expect(otpLocator).toBeVisible();
            otp = await otpLocator.textContent();
        }).toPass({intervals: [1000]});
    }

    await page2.locator("//*[text()='Delete']").click();
    await page2.locator("//*[text()='Yes, Delete']").click();

    await page.bringToFront();
    await page.locator("//input[@id='otp']").fill(otp);
    await page.locator("//button[text()='Verify']").click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Get back background color
    let header;
    // Header
    if(isMobile) {
        header = page.locator("(//*[.//*[text()='Cyberfit++'] and .//*[contains(@href, 'announcement')]])[last()]");
        const color = await header.evaluate((e) => {
            return window.getComputedStyle(e).getPropertyValue("--headerBackgroundMobile")
        })
        console.log("--headerBackgroundMobile: " + color);
    
        await expect(header).toHaveCSS(
            "--headerBackgroundMobile",
            "#2e6cff"
        )
    }
    else {
        header = page.locator("//*[text()='Cyber++' and @href]/..");
        const color = await header.evaluate((e) => {
            return window.getComputedStyle(e).getPropertyValue("--mainSolidColorBackground")
        })
        console.log("--mainSolidColorBackground: " + color);
    
        await expect(header).toHaveCSS(
            "--mainSolidColorBackground",
            "#c00"
        )
    }

    // Get full css
    const computedStyles = await header.evaluate((e) => {
        const computedStyle = window.getComputedStyle(e);
        const styleObject = {};
        for (let i = 0; i < computedStyle.length; i++) {
          const propertyName = computedStyle[i];
          styleObject[propertyName] = computedStyle.getPropertyValue(propertyName);
        }
        return styleObject;
      });
    console.log(computedStyles);
    expect(computedStyles['font-family']).toBe('"Open Sans", sans-serif'); 
})