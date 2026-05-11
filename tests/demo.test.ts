import { AIBrowserIntelligence } from '../src/index';
import { Logger } from '../src/utils/logger';

async function runDemo() {
  const aiBrowser = new AIBrowserIntelligence();

  try {
    Logger.log('Starting AI Browser Intelligence Demo...');
    
    // 1. Open the site
    await aiBrowser.init('https://www.saucedemo.com/');

    // 2. Login
    await aiBrowser.executeIntent('Type "standard_user" into the username field');
    await aiBrowser.executeIntent('Type "secret_sauce" into the password field');
    await aiBrowser.executeIntent('Click the login button');

    // 3. Add to cart
    await aiBrowser.executeIntent('Add the backpack to the cart');
    
    // 4. Go to cart
    await aiBrowser.executeIntent('Click on the shopping cart icon');

    // 5. Checkout
    await aiBrowser.executeIntent('Click the checkout button');
    
    // 6. Fill info
    await aiBrowser.executeIntent('Enter "John" as first name');
    await aiBrowser.executeIntent('Enter "Doe" as last name');
    await aiBrowser.executeIntent('Enter "12345" as postal code');
    await aiBrowser.executeIntent('Click continue');

    // 7. Finish
    await aiBrowser.executeIntent('Click finish');

    Logger.log('Demo completed successfully!');
  } catch (error) {
    Logger.error('Demo failed:', error);
  } finally {
    // Wait a bit to see the result
    await new Promise(resolve => setTimeout(resolve, 5000));
    await aiBrowser.close();
  }
}

runDemo();
