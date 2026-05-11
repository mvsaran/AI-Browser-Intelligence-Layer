import { AIAgent } from '../src/ai/agent';

/**
 * Page Object for the Product Listing/Details Page.
 * Uses AI intents to interact with elements.
 */
export class ProductPage {
  constructor(private agent: AIAgent) {}

  /**
   * Adds a specific product to the cart by its name.
   */
  async addProductToCart(productName: string) {
    await this.agent.execute(`Add the "${productName}" to the cart`);
  }

  /**
   * Navigates to the shopping cart.
   */
  async goToCart() {
    await this.agent.execute('Click on the shopping cart icon');
  }
}
