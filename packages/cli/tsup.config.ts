import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    '@openrfid/core',
    '@openrfid/readers',
    '@openrfid/simulator',
    '@openrfid/tags',
    '@openrfid/plugin-api',
    '@openrfid/rest',
    '@openrfid/websocket',
    '@openrfid/mqtt',
    '@openrfid/hopeland-discovery',
    'mqtt',
    'commander',
    'inquirer',
    'ora',
    'chalk',
    'cli-table3'
  ]
});
