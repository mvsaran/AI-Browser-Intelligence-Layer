import { Page, Locator } from '@playwright/test';
import { AIService } from './AIService';
import { ContextExtractor } from '../browser/ContextExtractor';
import { ActionExecutor } from '../executor/ActionExecutor';
import { Logger } from '../utils/logger';

/**
 * AIAgent is the core class that coordinates AI-driven browser automation.
 * It uses natural language intents to determine and execute browser actions.
 */
export class AIAgent {
  private aiService: AIService;
  private lastIntent: string = 'None';

  /**
   * @param page The Playwright Page instance to automate
   */
  constructor(private page: Page) {
    this.aiService = new AIService();
  }

  /**
   * Executes a natural language intent by analyzing the page and using AI to find the best action.
   * @param intent The user's intent in plain English (e.g., "Click the login button")
   * @returns Promise<boolean> success status
   * @throws Error if token limit is exceeded
   */
  async execute(intent: string): Promise<boolean> {
    const startTime = Date.now();
    Logger.log(`[AIAgent] Processing Intent: "${intent}"`);
    this.lastIntent = intent;

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          Logger.log(`[AIAgent] Retry attempt ${attempt} for intent: "${intent}"`);
          await this.page.waitForTimeout(2000); // Wait for page stability
        }

        // 1. Capture Context from the current page
        const { pageContext, elements } = await ContextExtractor.extract(this.page);

        // 2. AI Reasoning to determine the next action
        const aiResponse = await this.aiService.determineAction(intent, pageContext, elements);

        // 4. Action Execution
        const success = await ActionExecutor.execute(this.page, aiResponse);

        if (success) {
          // 5. Latency Logging
          const duration = Date.now() - startTime;
          Logger.debug(`[LATENCY] execute("${intent}") took ${duration}ms`);
          return true;
        }

        const errorMsg = `[AIAgent] Failed to execute intent: "${intent}". AI reasoned: "${aiResponse.reasoning}"`;
        lastError = new Error(errorMsg);
        
        if (attempt < maxRetries) {
          Logger.debug(`[AIAgent] Action failed, but retrying... Reasoning: ${aiResponse.reasoning}`);
          continue;
        }
      } catch (error: any) {
        lastError = error;
        if (attempt < maxRetries) {
          Logger.debug(`[AIAgent] Exception caught, retrying... ${error.message}`);
          continue;
        }
      }
    }

    if (lastError) {
      Logger.error(lastError.message);
      throw lastError;
    }

    return false;
  }

  /**
   * Direct-locator escape hatch. Bypasses AI reasoning to interact directly with Playwright locators.
   * Use this ONLY for assertions, waiting for specific network states, or handling non-standard UI elements.
   * 
   * @example
   * await expect(agent.direct(page.locator('.success-msg'))).toBeVisible();
   * 
   * @param locator The Playwright Locator to interact with
   * @returns The same Locator instance
   */
  direct(locator: Locator): Locator {
    return locator;
  }



  /**
   * @returns The last intent processed by this agent
   */
  getLastIntent(): string {
    return this.lastIntent;
  }
}
