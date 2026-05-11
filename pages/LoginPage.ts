import { AIAgent } from '../src/ai/agent';

/**
 * Page Object for the Login Page.
 * Uses AI intents to interact with elements.
 */
export class LoginPage {
  constructor(private agent: AIAgent) {}

  /**
   * Performs login with provided credentials using natural language intents.
   */
  async login(username: string, password: string) {
    await this.agent.execute(`Type "${username}" into the username field`);
    await this.agent.execute(`Type "${password}" into the password field`);
    await this.agent.execute('Click the login button');
  }

  /**
   * Navigate to the login page (if needed, though baseURL is usually set)
   */
  async goto() {
    await this.agent.execute('Navigate to the login page');
  }
}
