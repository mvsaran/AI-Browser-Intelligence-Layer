import { test, expect } from '../fixtures/agent.fixture';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * E2E Checkout Test
 * 
 * This test uses the Page Object Model (POM) pattern enhanced with AI.
 * It reads like a manual test case and contains zero hardcoded selectors
 * for actions, using natural language intents instead.
 * 
 * Direct Playwright locators are used only for assertions via the agent.direct() hatch.
 */
test.describe('E2E Checkout Flow with AI Intelligence', () => {
  
  test('should complete a successful purchase from login to finish', async ({ page, agent }) => {
    // Initialize Page Objects with the AI Agent
    const loginPage = new LoginPage(agent);
    const productPage = new ProductPage(agent);
    const cartPage = new CartPage(agent);
    const checkoutPage = new CheckoutPage(agent);

    // 1. Login to the application
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify successful login using the direct locator escape hatch
    await expect(agent.direct(page.locator('.title'))).toHaveText('Products');

    // 2. Add a specific product to the cart
    await productPage.addProductToCart('Sauce Labs Backpack');
    
    // 3. Navigate to the shopping cart and start checkout
    await productPage.goToCart();
    await cartPage.checkout();

    // 4. Provide shipping information
    await checkoutPage.fillInformation('John', 'Doe', '12345');

    // 5. Review and finalize the purchase
    await checkoutPage.finish();

    // 6. Assert that the order was completed successfully
    const completeHeader = agent.direct(page.locator('.complete-header'));
    await expect(completeHeader).toBeVisible();
    await expect(completeHeader).toHaveText('Thank you for your order!');
  });

  test('should allow removing an item from the cart before checkout', async ({ page, agent }) => {
    const loginPage = new LoginPage(agent);
    const productPage = new ProductPage(agent);
    const cartPage = new CartPage(agent);

    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');

    await productPage.addProductToCart('Sauce Labs Bike Light');
    await productPage.goToCart();

    // Verify item is in cart
    await expect(agent.direct(page.locator('.inventory_item_name'))).toHaveText('Sauce Labs Bike Light');

    // Remove item
    await cartPage.removeProduct('Sauce Labs Bike Light');

    // Verify cart is empty
    await expect(agent.direct(page.locator('.inventory_item_name'))).not.toBeVisible();
  });
});
