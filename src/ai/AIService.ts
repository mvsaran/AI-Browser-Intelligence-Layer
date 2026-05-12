import OpenAI from 'openai';
import dotenv from 'dotenv';
import { Logger } from '../utils/logger';

dotenv.config();

export interface ElementContext {
  role: string;
  text: string;
  id?: string;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  dataTest?: string;
  className?: string;
  title?: string;
}

export interface AIActionResponse {
  action: 'click' | 'fill' | 'press' | 'navigate' | 'none';
  targetText?: string;
  value?: string;
  confidence: number;
  reasoning: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in .env file');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async determineAction(userIntent: string, pageContext: any, elements: ElementContext[]): Promise<AIActionResponse> {
    Logger.ai('Determining action for intent:', userIntent);

    const systemPrompt = `
      You are an AI Browser Intelligence Layer. Your goal is to map a USER INTENT to a specific browser action on a web page.
      
      Available Actions:
      - click: Interact with buttons, links, or clickable elements.
      - fill: Type text into input fields.
      - press: Keyboard actions (e.g., 'Enter').
      - navigate: Go to a specific URL.
      - none: No action clear or possible.

      Target Selection Priority for "targetText":
      1. Unique Identifiers: The literal VALUE of data-test, data-testid, or ID (e.g., "login-button" NOT "id='login-button'").
      2. Visible Text: The exact text seen on the element (only if unique).
      3. Label/Placeholder: Accessible labels or input placeholders.
      4. If visible text is common across many elements (like "Add to cart"), you MUST use the VALUE of a more specific identifier like data-test or ID to avoid ambiguity.

      Output Format (JSON only):
      {
        "action": "click" | "fill" | "press" | "navigate" | "none",
        "targetText": "The best identifier from the list above",
        "value": "The value to fill (if applicable)",
        "confidence": 0-100,
        "reasoning": "Brief explanation of why this element was chosen"
      }
    `;

    const userPrompt = `
      User Intent: "${userIntent}"
      Current Page: ${pageContext.title} (${pageContext.url})
      
      Extracted Interactive Elements:
      ${JSON.stringify(elements, null, 2)}
      
      Return the best matching action.
    `;

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}') as AIActionResponse;
        const usage = response.usage;
        
        Logger.ai('AI Result:', { ...result, usage });
        
        return { 
          ...result, 
          usage: {
            prompt_tokens: usage?.prompt_tokens || 0,
            completion_tokens: usage?.completion_tokens || 0,
            total_tokens: usage?.total_tokens || 0
          }
        };
      } catch (error: any) {
        attempt++;
        const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('Rate limit');
        
        Logger.error(`AI Service Error (Attempt ${attempt}/${maxRetries}):`, error.message || error);
        
        if (attempt >= maxRetries) {
          return { 
            action: 'none', 
            confidence: 0, 
            reasoning: `Failed after ${maxRetries} attempts. ${isRateLimit ? 'OpenAI Rate limit reached.' : ''} Last error: ${error.message || 'Unknown error'}`,
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
          };
        }
        
        // Wait before retrying (exponential backoff)
        // If it's a rate limit, wait longer
        const baseDelay = isRateLimit ? 5000 : 1000;
        const delay = Math.pow(2, attempt - 1) * baseDelay;
        Logger.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return { 
      action: 'none', 
      confidence: 0, 
      reasoning: 'Unexpected end of determineAction',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    };
  }

  async analyze(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an AI Test Healer. Your goal is to analyze test failures and provide actionable diagnosis and fixes.' },
          { role: 'user', content: prompt }
        ],
      });

      return response.choices[0].message.content || 'No analysis provided.';
    } catch (error: any) {
      Logger.error('AI Analysis Error:', error.message || error);
      return `Failed to analyze failure: ${error.message || 'Unknown error'}`;
    }
  }
}
