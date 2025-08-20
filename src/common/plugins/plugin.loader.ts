import { NestApplication } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';

export async function loadPlugins(app: NestApplication): Promise<void> {
  const pluginsDir = path.join(process.cwd(), 'src', 'common', 'plugins');
  const files = fs.readdirSync(pluginsDir);
  for (const file of files) {
    if (file.endsWith('.plugin.ts') && file !== 'plugin.loader.ts') {
      const pluginPath = path.join(pluginsDir, file);
      const plugin = await import(pluginPath);
      if (typeof plugin.setup === 'function') {
        plugin.setup(app);
      }
    }
  }
}

