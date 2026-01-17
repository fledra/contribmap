import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import yaml from 'yaml';

const CONFIG_NAMES = [
  '.contribmaprc',
  'contribmap.config.json',
  'contribmap.config.yaml',
  'contribmap.config.yml',
];

export default function loadConfigFromFile() {
  const rootPath = process.cwd();

  for (const fileName of CONFIG_NAMES) {
    const filePath = path.resolve(rootPath, fileName);

    if (!fs.existsSync(filePath)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      let parsed;

      if (fileName.endsWith('json')) {
        parsed = JSON.parse(content);
      } else if (fileName.endsWith('yaml') || fileName.endsWith('yml')) {
        parsed = yaml.parse(content, { logLevel: 'silent' });
      } else {
        try {
          parsed = JSON.parse(content);
        } catch {
          parsed = yaml.parse(content);
        }
      }

      return validateConfig(parsed);
    } catch (error) {
      (error as Error).cause = fileName;
      throw error;
    }
  }
}
