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
  private totalTokens: number = 0;
  private maxTokens: number;

  /**
   * @param page The Playwright Page instance to automate
   */
  constructor(private page: Page) {
    this.aiService = new AIService();
    this.maxTokens = parseInt(process.env.MAX_TOKENS_PER_TEST || '20000', 10);
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

    // 1. Capture Context from the current page
    const { pageContext, elements } = await ContextExtractor.extract(this.page);

    // 2. AI Reasoning to determine the next action
    const aiResponse = await this.aiService.determineAction(intent, pageContext, elements);
    
    // 3. Token Tracking & Guardrails
    if (aiResponse.usage) {
      const { prompt_tokens, completion_tokens, total_tokens } = aiResponse.usage;
      this.totalTokens += total_tokens;
      
      Logger.log(`[COST] Tokens: ${prompt_tokens} (input) | ${completion_tokens} (output)`);
      Logger.log(`[COST] Cumulative Tokens: ${this.totalTokens} / ${this.maxTokens}`);

      if (this.totalTokens > this.maxTokens) {
        const errorMsg = `[GUARD] MAX_TOKENS_PER_TEST exceeded: ${this.totalTokens} > ${this.maxTokens}`;
        Logger.error(errorMsg);
        throw new Error(errorMsg);
      }
    }

    // 4. Action Execution
    const success = await ActionExecutor.execute(this.page, aiResponse);
    
    // 5. Latency Logging
    const duration = Date.now() - startTime;
    Logger.debug(`[LATENCY] execute("${intent}") took ${duration}ms`);

    return success;
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
   * @returns The total tokens consumed by this agent instance
   */
  getTotalTokensUsed(): number {
    return this.totalTokens;
  }
}
