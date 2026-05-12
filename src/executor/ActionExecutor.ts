import { Page } from 'playwright';
import { AIActionResponse } from '../ai/AIService';
import { Logger } from '../utils/logger';

export class ActionExecutor {
  static async execute(page: Page, aiResponse: AIActionResponse) {
    const { action, targetText, value, confidence } = aiResponse;

    if (confidence < 50) {
      Logger.log(`Low confidence (${confidence}%). Skipping action: ${action} on "${targetText}"`);
      return false;
    }

    Logger.log(`Executing action: ${action} on "${targetText}" with confidence ${confidence}%`);

    try {
      switch (action) {
        case 'click':
          await this.clickElement(page, targetText!);
          break;
        case 'fill':
          await this.fillElement(page, targetText!, value!);
          break;
        case 'press':
          await page.keyboard.press(value || 'Enter');
          break;
        case 'navigate':
          await page.goto(value!);
          break;
        default:
          Logger.log('No valid action determined.');
          return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Execution failed for ${action} on "${targetText}"`, error);
      return false;
    }
  }

  private static async clickElement(page: Page, text: string) {
    const isSlug = /^[a-z0-9-_]+$/.test(text);
    
    const strategies = [
      { name: 'Data-Test', fn: () => page.locator(`[data-test="${text}"], [data-testid="${text}"]`).first().click({ timeout: 3000 }) },
      { name: 'ID', fn: () => page.locator(`#${text.replace(/^#/, '')}`).click({ timeout: 3000 }) },
      { name: 'Role & Name', fn: () => page.getByRole('button', { name: text, exact: false }).first().click({ timeout: 3000 }) },
      { name: 'Text', fn: () => page.getByText(text, { exact: false }).first().click({ timeout: 3000 }) },
      { name: 'Label', fn: () => page.getByLabel(text, { exact: false }).first().click({ timeout: 3000 }) },
      { name: 'Name Attribute', fn: () => page.locator(`[name="${text}"]`).click({ timeout: 3000 }) },
      { name: 'Class', fn: () => page.locator(`.${text.replace(/^\./, '')}`).first().click({ timeout: 3000 }) },
      { name: 'CSS Selector', fn: () => page.locator(text.startsWith('.') || text.startsWith('#') || text.startsWith('[') ? text : `text="${text}"`).first().click({ timeout: 3000 }) }
    ];

    // If it's not a slug, prioritize Text and Role over ID/Data-Test
    if (!isSlug) {
      const dataTestIdx = strategies.findIndex(s => s.name === 'Data-Test');
      const idIdx = strategies.findIndex(s => s.name === 'ID');
      const [dataTest] = strategies.splice(dataTestIdx, 1);
      const [id] = strategies.splice(idIdx - 1, 1); // Adjust index after splice
      strategies.push(dataTest, id);
    }

    for (const strategy of strategies) {
      try {
        Logger.debug(`Trying strategy: ${strategy.name} for "${text}"`);
        await strategy.fn();
        Logger.debug(`Strategy ${strategy.name} succeeded.`);
        return;
      } catch (e: any) {
        if (e.message?.includes('Target page, context or browser has been closed')) {
          throw e; // Fatal error, don't keep trying
        }
        // Continue to next strategy
      }
    }

    throw new Error(`Could not click element with identifier: "${text}" after trying ${strategies.length} strategies.`);
  }

  private static async fillElement(page: Page, label: string, value: string) {
    const isSlug = /^[a-z0-9-_]+$/.test(label);

    const strategies = [
      { name: 'Data-Test', fn: () => page.locator(`[data-test="${label}"], [data-testid="${label}"]`).first().fill(value, { timeout: 3000 }) },
      { name: 'ID', fn: () => page.locator(`#${label.replace(/^#/, '')}`).fill(value, { timeout: 3000 }) },
      { name: 'Placeholder', fn: () => page.getByPlaceholder(label, { exact: false }).fill(value, { timeout: 3000 }) },
      { name: 'Label', fn: () => page.getByLabel(label, { exact: false }).fill(value, { timeout: 3000 }) },
      { name: 'Role & Name', fn: () => page.getByRole('textbox', { name: label, exact: false }).fill(value, { timeout: 3000 }) },
      { name: 'Name Attribute', fn: () => page.locator(`[name="${label}"]`).fill(value, { timeout: 3000 }) },
      { name: 'Near Text', fn: () => page.locator(`input:near(:text("${label}"))`).first().fill(value, { timeout: 3000 }) },
      { name: 'Class', fn: () => page.locator(`.${label.replace(/^\./, '')}`).first().fill(value, { timeout: 3000 }) },
      { name: 'CSS Selector', fn: () => page.locator(label.startsWith('.') || label.startsWith('#') || label.startsWith('[') ? label : `text="${label}"`).first().fill(value, { timeout: 3000 }) }
    ];

    // If it's not a slug, prioritize Placeholder and Label over ID/Data-Test
    if (!isSlug) {
      const dataTestIdx = strategies.findIndex(s => s.name === 'Data-Test');
      const idIdx = strategies.findIndex(s => s.name === 'ID');
      const [dataTest] = strategies.splice(dataTestIdx, 1);
      const [id] = strategies.splice(idIdx - 1, 1);
      strategies.push(dataTest, id);
    }

    for (const strategy of strategies) {
      try {
        Logger.debug(`Trying strategy: ${strategy.name} for "${label}"`);
        await strategy.fn();
        Logger.debug(`Strategy ${strategy.name} succeeded.`);
        return;
      } catch (e: any) {
        if (e.message?.includes('Target page, context or browser has been closed')) {
          throw e; // Fatal error, don't keep trying
        }
        // Continue to next strategy
      }
    }

    throw new Error(`Could not find input for "${label}" after trying ${strategies.length} strategies.`);
  }
}
