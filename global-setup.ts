import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
  dotenv.config();

  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'CRITICAL ERROR: OPENAI_API_KEY is missing from the environment. ' +
      'Please ensure it is set in your .env file before running tests.'
    );
  }

  console.log('Global Setup: OPENAI_API_KEY validated successfully.');
}

export default globalSetup;
