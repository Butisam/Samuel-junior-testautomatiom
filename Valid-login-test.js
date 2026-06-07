const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

(async function validLoginTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navigate to login page
        await driver.get('https://the-internet.herokuapp.com/login');

        // Enter valid credentials
        await driver.findElement(By.id('username')).sendKeys('tomsmith');
        await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');

        // Click login button
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for success message to be visible
        let successMsg = await driver.wait(
            until.elementLocated(By.css('.flash.success')),
            5000
        );
        let msgText = await successMsg.getText();

        // Assert expected text
        if (msgText.includes('You logged into a secure area!')) {
            console.log('✓ SUCCESS: Valid login test passed');
        } else {
            console.log('✗ FAILURE: Unexpected success message');
        }

        // Capture screenshot
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('valid-login-success.png', screenshot, 'base64');
        console.log('✓ Screenshot saved: valid-login-success.png');

    } catch (err) {
        console.error('Test failed with error:', err);
    } finally {
        await driver.quit();
    }
})();
