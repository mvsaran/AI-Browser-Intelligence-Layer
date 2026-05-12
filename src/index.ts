import { chromium, Page, Browser } from 'playwright';
import { AIService } from './ai/AIService';
import { ContextExtractor } from './browser/ContextExtractor';
import { ActionExecutor } from './executor/ActionExecutor';
import { Logger } from './utils/logger';

export class AIBrowserIntelligence {
  private aiService: AIService;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {
    this.aiService = new AIService();
  }

  async init(url?: string) {
    this.browser = await chromium.launch({ headless: true });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    if (url) {
      await this.page.goto(url);
    }
  }

  async executeIntent(intent: string) {
    if (!this.page) throw new Error('Browser not initialized. Call init() first.');

    Logger.log(`Processing Intent: "${intent}"`);

    // 1. Capture Context
    const { pageContext, elements } = await ContextExtractor.extract(this.page);

    // 2. AI Reasoning
    const aiResponse = await this.aiService.determineAction(intent, pageContext, elements);

    // 3. Dynamic Execution
    const screenshotPath = `screenshots/${Date.now()}_before.png`;
    await this.page.screenshot({ path: screenshotPath });
    Logger.log(`Screenshot saved: ${screenshotPath}`);

    const success = await ActionExecutor.execute(this.page, aiResponse);


    if (success) {
      Logger.log(`Successfully executed intent: "${intent}"`);
    } else {
      Logger.error(`Failed to execute intent: "${intent}"`);
    }

    return success;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  getPage() {
    return this.page;
  }
}
