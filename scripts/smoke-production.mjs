import tours from '../src/data/tours.json' with { type: 'json' };
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

// Use a separate ephemeral local server; leave the user's preview untouched.
const probe = createServer();
probe.listen(0, '127.0.0.1');
await once(probe, 'listening');
const port = probe.address().port;
await new Promise((resolve, reject) =>
  probe.close((error) => (error ? reject(error) : resolve())),
);
const next = fileURLToPath(
  new URL('../node_modules/next/dist/bin/next', import.meta.url),
);
const server = spawn(
  process.execPath,
  [next, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
  {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      TRAVEL_DEMO_MODE: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
let output = '';
const exited = once(server, 'exit');
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Production server startup timed out.')),
      45000,
    );
    const finish = (error) => {
      clearTimeout(timeout);
      error ? reject(error) : resolve();
    };
    server.on('error', finish);
    server.once('exit', (code) =>
      finish(
        new Error(
          `Production server exited during startup (${code}). ${output}`,
        ),
      ),
    );
    server.stdout.on('data', (chunk) => {
      output += chunk;
      if (output.includes('Ready in')) finish();
    });
    server.stderr.on('data', (chunk) => {
      output += chunk;
    });
  });
  async function read(path, status = 200) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      signal: AbortSignal.timeout(10000),
      redirect: 'manual',
    });
    assert.equal(response.status, status, `${path} should return ${status}`);
    return response.text();
  }
  const publicRoutes = [
    '/',
    '/tours',
    '/tours/saved',
    '/tours/compare',
    ...tours.map((t) => `/tours/${t.slug}`),
    '/about',
    '/services',
    '/gallery',
    '/contact',
    '/faq',
    '/destinations',
    '/destinations/nepal',
    '/destinations/kerala',
    '/destinations/kashmir',
    '/destinations/sikkim-darjeeling',
    '/destinations/dubai',
  ];
  const enquiry = await fetch(
    `http://127.0.0.1:${port}/enquire?destination=Dubai`,
    { redirect: 'manual' },
  );
  assert.equal(enquiry.status, 307);
  const whatsapp = new URL(enquiry.headers.get('location'));
  assert.equal(whatsapp.origin, 'https://wa.me');
  assert.equal(whatsapp.pathname, '/919665238966');
  assert.match(whatsapp.searchParams.get('text'), /Dubai/);
  console.log('PASS direct WhatsApp redirect');
  const descriptions = new Set();
  for (const path of publicRoutes) {
    const html = await read(path);
    assert.match(html, /<h1[\s>]/, `${path} needs a visible heading`);
    assert.match(
      html,
      /<link rel="canonical" href="https?:\/\//,
      `${path} needs an absolute canonical`,
    );
    const description = html.match(
      /<meta name="description" content="([^"]+)"/,
    );
    assert.ok(description?.[1], `${path} needs a description`);
    assert.ok(
      !descriptions.has(description[1]),
      `${path} must not inherit another page description`,
    );
    descriptions.add(description[1]);
    if (path !== '/')
      assert.match(
        html,
        /"@type":"BreadcrumbList"/,
        `${path} needs breadcrumb structured data`,
      );
    console.log(`PASS ${path}`);
  }
  for (const path of ['/packages', '/packages/saved', '/packages/compare']) {
    const html = await read(path);
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(
      html,
      /39,900|69,900|Dubai, beyond the skyline|Venice, at your own pace|Kyoto, a quieter discovery/,
    );
    console.log(`PASS demo off ${path}`);
  }
  for (const slug of [
    'dubai-city-and-desert',
    'venice-at-your-pace',
    'kyoto-culture-and-gardens',
  ]) {
    await read(`/packages/${slug}`, 404);
    await read(`/packages/${slug}/plan`, 404);
  }
  await read('/destinations/not-a-destination', 404);
  await read('/tours/not-a-tour', 404);
  const tourSearch = await read('/tours?q=Bhutan&region=International');
  assert.match(tourSearch, /Royal Bhutan/);
  assert.match(tourSearch, /noindex, follow/);
  const combined = await read('/tours?q=Pokhara&region=International&country=Nepal&style=coast&duration=8');
  assert.match(combined.replaceAll('<!-- -->', ''), /1 journey/);
  assert.doesNotMatch(combined, /Explore Dubai &amp; Abu Dhabi/);
  const comparison = await read('/tours/compare?tour=nepal&tour=dubai-abu-dhabi');
  assert.match(comparison, /Personalised on enquiry/);
  assert.match(comparison, /noindex, follow/);
  assert.doesNotMatch(comparison, /Sample adult cost|39,900|69,900/);
  const oversized = await read('/tours/compare?tour=nepal&tour=dubai-abu-dhabi&tour=royal-bhutan&tour=sri-lanka');
  assert.match(oversized, /Choose at most three tours/);
  for (const tour of tours) {
    const html = await read(`/tours/${tour.slug}`);
    assert.match(html, /wa.me\/919665238966/);
    assert.doesNotMatch(html, /39,900|69,900|Preview planner|Book now/);
  }
  const filtered = await read('/destinations?q=Nepal');
  assert.match(filtered, /<meta name="robots" content="noindex, follow"/);
  const sitemap = await read('/sitemap.xml');
  assert.doesNotMatch(sitemap, /\/(packages|enquire)/);
  await read('/robots.txt');
  console.log(
    'PASS production smoke: public metadata, 404s, filtered indexing and demo isolation.',
  );
} finally {
  if (server.exitCode === null && server.signalCode === null) server.kill();
  await exited;
}
