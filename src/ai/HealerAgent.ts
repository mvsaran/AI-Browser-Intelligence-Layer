import { Page } from '@playwright/test';
import { AIService } from './AIService';
import { Logger } from '../utils/logger';
import { ContextExtractor } from '../browser/ContextExtractor';
import path from 'path';

/**
 * HealerAgent is responsible for analyzing test failures and providing diagnosis.
 * It is triggered automatically when a test fails.
 */
export class HealerAgent {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Analyzes a test failure by capturing context and using AI to diagnose the cause.
   */
  async analyzeFailure(page: Page, testTitle: string, error: any, lastIntent: string) {
    Logger.log(`[HealerAgent] 🚨 Test Failed: "${testTitle}"`);
    const errorMsg = error.message || error.toString();
    Logger.log(`[HealerAgent] Error Message: ${errorMsg}`);

    try {
      // 1. Capture Page Context at failure
      const { pageContext, elements } = await ContextExtractor.extract(page);
      
      // 2. Capture Screenshot
      const screenshotPath = path.join(process.cwd(), 'screenshots', `failure_${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      Logger.log(`[HealerAgent] Failure screenshot saved to: ${screenshotPath}`);

      // 3. Request AI Analysis
      Logger.log('[HealerAgent] Requesting AI healing analysis...');
      
      const prompt = `
        Test Failure Analysis Request:
        
        Test Title: "${testTitle}"
        Last Intent Attempted: "${lastIntent}"
        Error Message: "${errorMsg}"
        
        Current Page State:
        URL: ${pageContext.url}
        Title: ${pageContext.title}
        
        Interactive Elements on Page:
        ${JSON.stringify(elements, null, 2)}
        
        Please analyze why the test failed. Was it a timeout? Is the element missing? 
        Are we on the wrong page? Provide a clear diagnosis and suggest a fix.
      `;

      const analysis = await this.aiService.analyze(prompt);
      
      Logger.log('\n--- AI FAILURE ANALYSIS ---\n');
      Logger.log(analysis);
      Logger.log('\n---------------------------\n');

      return analysis;
    } catch (err) {
      Logger.error('[HealerAgent] Failed to analyze failure', err);
      return 'HealerAgent failed to provide analysis.';
    }
  }
}
