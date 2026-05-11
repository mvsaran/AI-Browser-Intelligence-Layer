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
      1. Visible Text: The exact text seen on the element.
      2. Label/Placeholder: Accessible labels or input placeholders.
      3. Data-Test: The value of data-test or data-testid attributes.
      4. ID/Name: The technical id or name attribute (only if no better option exists).

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

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Using a fast and capable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}') as AIActionResponse;
      
      // Extract usage info
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
    } catch (error) {
      Logger.error('AI Service Error:', error);
      return { 
        action: 'none', 
        confidence: 0, 
        reasoning: 'Error communicating with AI',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }
  }
}
