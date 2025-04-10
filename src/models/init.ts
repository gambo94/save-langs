import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';

config();

// Correct the path resolution
const modelFileList: string[] = fs.readdirSync(path.join(__dirname))
  .filter((fn: string) => fn.endsWith('.model.ts'));

export function initModels(): void {
  for (const model of modelFileList) {
    if (process.env.NODE_ENV === 'development') {
      console.info('Initializing:', model);
    }

    require(path.join(__dirname, model));
  }
}
