const { Builder, By, until } = require('selenium-webdriver');

(async function invalidLoginTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://the-internet.herokuapp.com/login');

        // Enter invalid credentials
        await driver.findElement(By.id('username')).sendKeys('invalidUser');
        await driver.findElement(By.id('password')).sendKeys('wrongPass');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for error message
        let errorMsg = await driver.wait(
            until.elementLocated(By.css('.flash.error')),
            5000
        );
        let errorText = await errorMsg.getText();

        // Assert expected error text
        if (errorText.includes('Your username is invalid!')) {
            console.log('✓ SUCCESS: Invalid login test passed');
        } else {
            console.log('✗ FAILURE: Expected error not shown');
        }

    } catch (err) {
        console.error('Test failed with error:', err);
    } finally {
        await driver.quit();
    }
})();
