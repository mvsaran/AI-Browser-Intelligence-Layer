import { test as base, expect } from '@playwright/test';
import { AIAgent } from '../src/ai/agent';

// Define the fixture types
type AgentFixtures = {
  agent: AIAgent;
};

/**
 * Custom Playwright test fixture that injects an AIAgent instance.
 * All tests should import `test` and `expect` from this file.
 */
export const test = base.extend<AgentFixtures>({
  agent: async ({ page }, use) => {
    // Instantiate AIAgent once per test using the injected page
    const agent = new AIAgent(page);
    
    // Provide the agent to the test
    await use(agent);
  },
});

export { expect };
