import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import React from 'react';
import { renderToString } from 'react-dom/server';

const vite = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
const escapeAttribute = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
try {
  const { App, getPageMeta } = await vite.ssrLoadModule('/src/App.jsx');
  const { pageRoutes } = await vite.ssrLoadModule('/src/content/site.js');
  const shell = await readFile('dist/client/index.html', 'utf8');
  for (const route of pageRoutes) {
    const markup = renderToString(React.createElement(App, { path: route }));
    const meta = getPageMeta(route);
    const html = shell
      .replace('<div id="root"></div>', `<div id="root" data-page="${route}">${markup}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(meta.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttribute(meta.description)}" />`);
    if (!html.includes('data-page=')) throw new Error('Prerender placeholder not found');
    const destination = path.join('dist/client', route, 'index.html');
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
    console.log(`HTML ready: ${route}`);
  }
} finally { await vite.close(); }
