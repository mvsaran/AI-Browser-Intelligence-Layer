import { test as base, expect } from '@playwright/test';
import { AIAgent } from '../src/ai/agent';
import { HealerAgent } from '../src/ai/HealerAgent';

// Define the fixture types
type AgentFixtures = {
  agent: AIAgent;
};

/**
 * Custom Playwright test fixture that injects an AIAgent instance.
 * All tests should import `test` and `expect` from this file.
 */
export const test = base.extend<AgentFixtures>({
  agent: async ({ page }, use, testInfo) => {
    // Instantiate AIAgent once per test using the injected page
    const agent = new AIAgent(page);
    
    // Provide the agent to the test
    await use(agent);

    // --- TEARDOWN / HEALING ---
    // If the test failed, trigger the HealerAgent to analyze what went wrong
    if (testInfo.status !== testInfo.expectedStatus) {
      const healer = new HealerAgent();
      await healer.analyzeFailure(
        page, 
        testInfo.title, 
        testInfo.error || 'Unknown Error', 
        agent.getLastIntent()
      );
    }
  },
});

export { expect };
