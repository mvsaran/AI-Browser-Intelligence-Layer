import { AIAgent } from '../src/ai/agent';

/**
 * Page Object for the Checkout flow.
 * Uses AI intents to interact with elements.
 */
export class CheckoutPage {
  constructor(private agent: AIAgent) {}

  /**
   * Fills in shipping/billing information.
   */
  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.agent.execute(`Enter "${firstName}" as first name`);
    await this.agent.execute(`Enter "${lastName}" as last name`);
    await this.agent.execute(`Enter "${postalCode}" as postal code`);
    await this.agent.execute('Click continue');
  }

  /**
   * Completes the checkout process.
   */
  async finish() {
    await this.agent.execute('Click finish');
  }

  /**
   * Cancels the checkout process.
   */
  async cancel() {
    await this.agent.execute('Click the cancel button');
  }
}
