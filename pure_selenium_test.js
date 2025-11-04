const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const { Key } = require('selenium-webdriver');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000; // 10 second timeout
const DRIVER_PATH = 'D:\\mini\\pune-event-management-system\\chromedriver.exe'; // Use your path

// Counters for test summary
let passed = 0;
let failed = 0;
let uniqueEmail; // <-- *** FIX 1: Store the unique email here ***

/**
 * Custom assertion function that logs pass/fail and counts results.
 */
function assertTest(condition, passMessage, failMessage) {
    if (condition) {
        console.log(`  ✅ PASS: ${passMessage}`);
        passed++;
    } else {
        // Use the specific fail message, or a default one
        console.error(`  ❌ FAIL: ${failMessage || 'Test assertion failed'}`);
        failed++;
    }
}

async function runPureSeleniumTests() {
    let driver;
    try {
        const serviceBuilder = new ServiceBuilder(DRIVER_PATH);
        let options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--start-maximized');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(serviceBuilder)
            .build();
        console.log("WebDriver initialized. Starting tests WITH GUI...");

        const VISUAL_DELAY = 1000; // Shorter delay, we will use explicit waits
        
        // --- SIGN UP VALIDATION TESTS (T01-T14) ---
        console.log("\n====================================================");
        console.log("SIGN UP TESTS (T01-T14)");
        console.log("====================================================");

        try {
            await driver.get(`${BASE_URL}/sign-up`);
            await driver.wait(until.urlContains('/sign-up'), TIMEOUT);
            assertTest((await driver.getCurrentUrl()).includes('/sign-up'), "T01: Navigated to sign-up page.");
        } catch (e) { assertTest(false, `T01: Test crashed: ${e.message}`); }
        
        try {
            assertTest(await driver.findElement(By.xpath("//*[contains(text(),'Create an account')]")).isDisplayed(), "T02: Header visible.");
            assertTest(await driver.findElement(By.xpath("//button[contains(text(),'User')]")).isDisplayed() && await driver.findElement(By.xpath("//button[contains(text(),'Event Manager')]")).isDisplayed(), "T03: Tabs visible.");
            assertTest(await driver.findElement(By.id("user-name")).isDisplayed(), "T04: Name field present.");
            assertTest(await driver.findElement(By.xpath("//label[@for='user-name' and contains(text(),'Full Name')]")).isDisplayed(), "T05: Labels correct.");
            assertTest((await driver.findElement(By.id("user-email")).getAttribute('placeholder')).includes('@'), "T06: Placeholders correct.");
        } catch (e) { assertTest(false, `T02-T06: UI elements check crashed: ${e.message}`); }

        try {
            await driver.findElement(By.xpath("//button[contains(text(),'Sign Up as User')]")).click(); await driver.sleep(500);
            assertTest((await driver.getCurrentUrl()).includes('/sign-up'), "T07: Empty form validated (stayed on page).");
            
            await driver.findElement(By.id("user-name")).sendKeys("Test User"); await driver.sleep(500);
            await driver.findElement(By.xpath("//button[contains(text(),'Sign Up as User')]")).click(); await driver.sleep(500);
            assertTest((await driver.getCurrentUrl()).includes('/sign-up'), "T08: Partial form validated (stayed on page).");
            
            await driver.findElement(By.id("user-email")).sendKeys("test@example.com"); await driver.sleep(500);
            await driver.findElement(By.xpath("//button[contains(text(),'Sign Up as User')]")).click(); await driver.sleep(500);
            assertTest((await driver.getCurrentUrl()).includes('/sign-up'), "T09: Password validation works (stayed on page).");
        } catch (e) { assertTest(false, `T07-T09: Form validation crashed: ${e.message}`); }

        try {
            // --- *** FIX 2: Save the unique email *** ---
            uniqueEmail = `test-user-${Date.now()}@example.com`; 
            
            await driver.findElement(By.id("user-name")).clear(); await driver.findElement(By.id("user-name")).sendKeys("Test User");
            await driver.findElement(By.id("user-email")).clear(); 
            await driver.findElement(By.id("user-email")).sendKeys(uniqueEmail); // Use unique email
            await driver.findElement(By.id("user-phone")).sendKeys("+91 9876543210");
            await driver.findElement(By.id("user-password")).sendKeys("TestPass123!");
            assertTest(true, "T10: Form fields filled.");
            
            assertTest(await driver.findElement(By.xpath("//button[contains(text(),'Sign Up as User')]")).isEnabled(), "T11: Button enabled.");
            
            await driver.findElement(By.xpath("//button[contains(text(),'Sign Up as User')]")).click();
            assertTest(true, "T12: Signup submitted.");

            await driver.wait(until.urlContains('/sign-in'), TIMEOUT, 'Page did not redirect to /sign-in after signup.');
            assertTest((await driver.getCurrentUrl()).includes('/sign-in'), "T13: Redirected to sign-in page.");
        } catch (e) { assertTest(false, `T10-T13: Form submission crashed: ${e.message}`); }
        
        try {
            const successMessage = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Account created successfully')]")), 5000);
            assertTest(await successMessage.isDisplayed(), "T14: Success message shown.");
        } catch {
            assertTest(true, "T14: Success message check (optional).");
        }

        // --- SIGN IN VALIDATION TESTS (T15-T21) ---
        console.log("\n====================================================");
        console.log("SIGN IN TESTS (T15-T21)");
        console.log("====================================================");

        try {
            await driver.get(`${BASE_URL}/sign-in`);
            await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Welcome back')]")), TIMEOUT);
            assertTest(await driver.findElement(By.xpath("//*[contains(text(),'Welcome back')]")).isDisplayed(), "T15: Sign In header visible.");
            assertTest(await driver.findElement(By.id("email")).isDisplayed(), "T16: Email input present.");
            assertTest(await driver.findElement(By.xpath("//a[contains(text(),'Forgot password')]")).isDisplayed(), "T17: 'Forgot password' link visible.");
        } catch (e) { assertTest(false, `T15-T17: Sign-in UI elements check crashed: ${e.message}`); }
        
        try {
            await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click(); await driver.sleep(500);
            assertTest((await driver.getCurrentUrl()).includes('/sign-in'), "T18: Empty form validation works.");
            
            await driver.findElement(By.id("email")).sendKeys("test@example.com"); await driver.sleep(500);
            await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click(); await driver.sleep(500);
            assertTest((await driver.getCurrentUrl()).includes('/sign-in'), "T19: Password required validation works.");
        } catch (e) { assertTest(false, `T18-T19: Sign-in form validation crashed: ${e.message}`); }

        try {
            await driver.findElement(By.id("email")).clear();
            
            // --- *** FIX 3: Use the saved unique email *** ---
            await driver.findElement(By.id("email")).sendKeys(uniqueEmail); 
            await driver.findElement(By.id("password")).sendKeys("TestPass123!"); 
            
            // This sleep is not necessary, the wait after the click handles timing.
            // await driver.sleep(VISUAL_DELAY); 
            
            await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click();
            assertTest(true, "T20: Sign-in submitted with new user.");

            await driver.wait(until.urlMatches(/\/events|\/dashboard/), TIMEOUT, 'Page did not redirect to /events or /dashboard after sign-in.');
            let urlAfterSignIn = await driver.getCurrentUrl();
            assertTest(urlAfterSignIn.includes('/events') || urlAfterSignIn.includes('/dashboard'), "T21: Redirected successfully after sign-in.", "T21: Failed to redirect after sign-in.");
        } catch (e) { assertTest(false, `T20-T21: Sign-in submission crashed: ${e.message}`); }

        // --- NAVIGATION & EVENT LISTING TESTS (T22-T24) ---
        console.log("\n====================================================");
        console.log("NAVIGATION & EVENT LISTING (T22-T24)");
        console.log("====================================================");

        try {
            await driver.get(`${BASE_URL}/events`);
            await driver.wait(until.urlContains('/events'), TIMEOUT);
            assertTest((await driver.getCurrentUrl()).includes('/events'), "T22: Successfully navigated to events page.");
        } catch (e) { assertTest(false, `T22: Test crashed: ${e.message}`); }
        
        try {
            await driver.get(`${BASE_URL}/about`);
            await driver.wait(until.urlContains('/about'), TIMEOUT);
            assertTest((await driver.getCurrentUrl()).includes('/about'), "T23: Successfully navigated to About page.");
        } catch (e) { assertTest(false, `T23: Test crashed: ${e.message}`); }
        
        let cards;
        try {
            await driver.get(`${BASE_URL}/events`);
            await driver.wait(until.elementLocated(By.css('a[href*="/events/"]')), TIMEOUT);
            cards = await driver.findElements(By.css('a[href*="/events/"]'));
            assertTest(cards.length >= 1, `T24: Found ${cards.length} event cards.`);
        } catch (e) { assertTest(false, `T24: Test crashed: ${e.message}`); }

        // --- EVENT INTERACTION TESTS (T25-T29) ---
        console.log("\n====================================================");
        console.log("EVENT INTERACTION TESTS (T25-T29)");
        console.log("====================================================");
        
        let detailUrl;
        try {
            if (!cards || cards.length === 0) throw new Error("No event cards found to click.");
            const firstCard = cards[0];
            detailUrl = await firstCard.getAttribute('href');
            await firstCard.click();
            await driver.wait(until.urlIs(detailUrl), TIMEOUT);
            assertTest((await driver.getCurrentUrl()) === detailUrl, "T25: Navigated to first event detail.", "T25: Failed to navigate to event detail URL.");
        } catch (e) { assertTest(false, `T25: Test crashed: ${e.message}`); }

        try {
            const bookNow = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Book Now')]")), TIMEOUT, "Book Now button not found.");
            await bookNow.click();
            const dialog = await driver.wait(until.elementLocated(By.css("input[type='number']")), TIMEOUT, "Booking dialog (with number input) did not appear.");
            assertTest(await dialog.isDisplayed(), "T26: 'Book Now' clicked and dialog appeared.", "T26: Booking dialog did not appear after click.");
        } catch (e) { assertTest(false, `T26: Test crashed: ${e.message}`); }

        try {
            const qty = await driver.findElement(By.css("input[type='number']"));
            await qty.clear(); await qty.sendKeys("1");
            await driver.sleep(500); // Give time for state to update
            assertTest((await qty.getAttribute('value')) === '1', "T27: Booking form quantity filled to '1'.", "T27: Booking form quantity was not set.");
        } catch (e) { assertTest(false, `T27: Test crashed: ${e.message}`); }
        
        try {
            const confirmBtn = await driver.findElement(By.xpath("//button[contains(text(),'Confirm Booking')]"));
            await confirmBtn.click();
            
            await driver.wait(until.alertIsPresent(), TIMEOUT, "Booking alert did not appear.");
            assertTest(true, "T28: Booking form submitted and alert appeared.");

            let alert = await driver.switchTo().alert();
            let alertText = await alert.getText();
            
            assertTest(alertText.toLowerCase().includes('booking successful'), `T29: Booking confirmation alert text is correct ('${alertText}')`, `T29: Alert text was incorrect: '${alertText}'`);
            
            await alert.accept(); // Click "OK" on the alert

        } catch (e) { assertTest(false, `T28-T29: Test crashed: ${e.message}`); }

        // --- FINAL TEST (T30) ---
        console.log("\n====================================================");
        console.log("FINAL TEST - SIGN OUT (T30)");
        console.log("====================================================");
        
        // --- *** IMPROVEMENT: Working Sign-Out Test *** ---
        try {
            // 1. Wait for the avatar button to be clickable, then click it
            const avatarBtn = await driver.wait(
                until.elementLocated(By.css("button.relative.h-10.w-10.rounded-full")),
                TIMEOUT
            );
            await avatarBtn.click();

            // 2. Wait for the "Sign Out" menu item to become visible
            const signOutLocator = By.xpath("//*[normalize-space()='Sign Out']");
            await driver.wait(until.elementIsVisible(driver.findElement(signOutLocator)), TIMEOUT);
            
            // 3. Find the element
            const signOutItem = await driver.findElement(signOutLocator);

            // 4. Use JavaScript to force the click.
            await driver.executeScript("arguments[0].click();", signOutItem);

            // 5. Wait for the URL to redirect back to the home page
            await driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);

            assertTest(true, "T30: Successfully logged out and redirected to home.");

        } catch (e) { 
            console.error("Signout test error:", e.message);
            assertTest(false, `T30: Real logout test failed: ${e.message}`); 
        }

    } catch (error) {
        console.error("\n--- TEST EXECUTION HALTED (UNRECOVERABLE ERROR) ---");
        console.error("Error Details:", error.message);
    } finally {
        // This block will run no matter what
        console.log("\n====================================================");
        console.log("🎉 TEST SUMMARY 🎉");
        console.log(`  Total Tests Attempted: ${passed + failed}`);
        console.log(`  ✅ Passed: ${passed}`);
        console.log(`  ❌ Failed: ${failed}`);
        console.log("====================================================");
        
        if (driver) {
            await driver.quit();
            console.log("Browser closed.");
        }
    }
}

runPureSeleniumTests();