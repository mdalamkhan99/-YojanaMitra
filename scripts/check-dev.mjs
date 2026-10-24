const checks = [
  ['client', 'http://localhost:5173/'],
  ['Vite API proxy', 'http://localhost:5173/api/health'],
  ['backend API', 'http://localhost:4000/api/health'],
];
let failed = false;
for (const [label, url] of checks) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const body = await response.text();
    const ok = response.ok && (label === 'client' ? /<html/i.test(body) : body.includes('"ok":true'));
    console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: HTTP ${response.status}${ok ? '' : `; unexpected response ${body.slice(0, 120)}`}`);
    failed ||= !ok;
  } catch (error) {
    console.log(`FAIL ${label}: ${error instanceof Error ? error.message : 'request failed'}`);
    failed = true;
  }
}
try {
  const response = await fetch('http://localhost:5173/api/ai/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: 'smoke test', language: 'en' }), signal: AbortSignal.timeout(4000) });
  const body = await response.text();
  const ok = response.status === 401 && !body.includes('API route not found');
  console.log(`${ok ? 'PASS' : 'FAIL'} client-path POST /api/ai/chat signed-out check: HTTP ${response.status}`);
  failed ||= !ok;
} catch (error) {
  console.log(`FAIL client-path POST /api/ai/chat signed-out check: ${error instanceof Error ? error.message : 'request failed'}`);
  failed = true;
}
process.exitCode = failed ? 1 : 0;
