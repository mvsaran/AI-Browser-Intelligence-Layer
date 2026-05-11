import { AIAgent } from '../src/ai/agent';

/**
 * Page Object for the Shopping Cart Page.
 * Uses AI intents to interact with elements.
 */
export class CartPage {
  constructor(private agent: AIAgent) {}

  /**
   * Proceeds from the cart to the checkout information page.
   */
  async checkout() {
    await this.agent.execute('Click the checkout button');
  }

  /**
   * Removes a product from the cart.
   */
  async removeProduct(productName: string) {
    await this.agent.execute(`Remove "${productName}" from the cart`);
  }
}
