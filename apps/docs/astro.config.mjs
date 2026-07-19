import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'OpenRFID Docs',
      logo: {
        src: './src/assets/logo.png',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/rfidsoftwares/openrfid-simulator' }
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/intro/' },
            { label: 'Quickstart Guide', link: '/quickstart/' },
          ],
        },
        {
          label: 'Usage Guides',
          items: [
            { label: 'Desktop App Guide', link: '/desktop-guide/' },
            { label: 'Web Console Guide', link: '/web-guide/' },
            { label: 'CLI Reference', link: '/cli-reference/' },
          ],
        },
        {
          label: 'API & Integration',
          items: [
            { label: 'Hopeland TCP/UDP Protocol', link: '/hopeland-protocol/' },
            { label: 'REST API Reference', link: '/rest-api/' },
            { label: 'WebSocket Events', link: '/websocket/' },
          ],
        },
      ],
    }),
  ],
});
