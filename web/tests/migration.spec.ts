import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';

test('an existing Hub worker retires without deleting unrelated cached data', async ({
  page,
}) => {
  const retirementWorker = await readFile(
    new URL('../public/sw.js', import.meta.url),
    'utf8',
  );
  let migrated = false;
  const server = createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.url === '/sw.js') {
      response.setHeader('Content-Type', 'application/javascript');
      response.end(
        migrated
          ? retirementWorker
          : `self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
             self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));`,
      );
    } else {
      response.setHeader('Content-Type', 'text/html');
      response.end('<!doctype html><title>Origin migration</title>');
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    await page.goto(origin);
    await page.evaluate(async () => {
      await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      for (const name of ['camiska-hub-static-v1', 'unrelated-cache']) {
        const cache = await caches.open(name);
        await cache.put('/example.txt', new Response('keep this content'));
      }
    });
    await expect
      .poll(() =>
        page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
      )
      .toBe(true);
    migrated = true;
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration!.update();
    });
    await expect
      .poll(() =>
        page.evaluate(
          async () => (await navigator.serviceWorker.getRegistrations()).length,
        ),
      )
      .toBe(0);
    expect(await page.evaluate(() => caches.keys())).toEqual([
      'unrelated-cache',
    ]);
    expect(
      await page.evaluate(async () =>
        (await caches.match('/example.txt'))?.text(),
      ),
    ).toBe('keep this content');
    await page.goto(origin);
    expect(
      await page.evaluate(() => navigator.serviceWorker.controller),
    ).toBeNull();
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
