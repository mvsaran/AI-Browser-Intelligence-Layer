import fs from 'fs';
import path from 'path';

export class Logger {
  private static logFile = path.join(process.cwd(), 'execution.log');

  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    console.log(`\x1b[32m${logMessage}\x1b[0m`);
    fs.appendFileSync(this.logFile, logMessage);
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message} ${error ? error.stack || JSON.stringify(error, null, 2) : ''}\n`;
    console.error(`\x1b[31m${logMessage}\x1b[0m`);
    fs.appendFileSync(this.logFile, logMessage);
  }

  static ai(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] AI_REASONING: ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    console.log(`\x1b[36m${logMessage}\x1b[0m`);
    fs.appendFileSync(this.logFile, logMessage);
  }
  static debug(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] DEBUG: ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    console.log(`\x1b[33m${logMessage}\x1b[0m`); // Yellow for debug
    fs.appendFileSync(this.logFile, logMessage);
  }
}
