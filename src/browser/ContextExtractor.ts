import { Page } from 'playwright';
import { ElementContext } from '../ai/AIService';
import { Logger } from '../utils/logger';

export class ContextExtractor {
  static async extract(page: Page) {
    Logger.log('Extracting page context...');

    const pageContext = {
      url: page.url(),
      title: await page.title(),
    };

    // Extract interactive elements using Playwright's locator system and evaluate
    const elements = await page.evaluate(() => {
      const interactiveSelectors = 'button, a, input, [role="button"], [role="link"], [role="textbox"], [role="searchbox"], [data-test], [data-testid]';
      const items = Array.from(document.querySelectorAll(interactiveSelectors));

      return items.map((el) => {
        const htmlEl = el as HTMLElement;
        const inputEl = el as HTMLInputElement;

        // For inputs like submit/button, the 'value' is the displayed text
        const value = inputEl.value || '';
        const text = (el.textContent || '').trim().substring(0, 50);
        const id = el.id || undefined;
        const name = inputEl.name || undefined;
        const dataTest = el.getAttribute('data-test') || el.getAttribute('data-testid') || undefined;
        const className = el.className || undefined;
        const title = el.getAttribute('title') || undefined;

        return {
          role: el.tagName.toLowerCase() === 'input' ? inputEl.type : el.tagName.toLowerCase(),
          text: text || (el.tagName.toLowerCase() === 'input' ? value : ''),
          id,
          name,
          dataTest,
          className,
          title,
          placeholder: inputEl.placeholder || undefined,
          ariaLabel: el.getAttribute('aria-label') || undefined,
          isVisible: htmlEl.offsetWidth > 0 && htmlEl.offsetHeight > 0,
        };
      }).filter(item => item.isVisible && (item.text || item.ariaLabel || item.placeholder || item.name || item.id || item.dataTest || item.title));
    });

    Logger.log(`Found ${elements.length} interactive elements.`);
    return { pageContext, elements: elements as ElementContext[] };
  }
}
