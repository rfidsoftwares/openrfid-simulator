import path from 'path';

export default {
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', 'apps/e2e/**'],
    alias: {
      '@openrfid/core': path.resolve(__dirname, './packages/core/src/index.ts'),
      '@openrfid/epc': path.resolve(__dirname, './packages/epc/src/index.ts'),
      '@openrfid/gs1': path.resolve(__dirname, './packages/gs1/src/index.ts'),
      '@openrfid/utils': path.resolve(__dirname, './packages/utils/src/index.ts'),
      '@openrfid/tags': path.resolve(__dirname, './packages/tags/src/index.ts'),
      '@openrfid/readers': path.resolve(__dirname, './packages/readers/src/index.ts'),
      '@openrfid/simulator': path.resolve(__dirname, './packages/simulator/src/index.ts'),
      '@openrfid/plugin-api': path.resolve(__dirname, './packages/plugin-api/src/index.ts'),
      '@openrfid/rest': path.resolve(__dirname, './packages/rest/src/index.ts'),
      '@openrfid/websocket': path.resolve(__dirname, './packages/websocket/src/index.ts'),
      '@openrfid/mqtt': path.resolve(__dirname, './packages/mqtt/src/index.ts'),
      '@openrfid/ui': path.resolve(__dirname, './packages/ui/src/index.ts'),
    },
  },
};
