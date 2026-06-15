// Headless CDP boot+play check. Captures console/page errors, clicks start,
// screenshots the in-game world. Usage: node scripts/headless-check.mjs <url> <out.png>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const URL = process.argv[2] || 'http://localhost:4173/';
const OUT = process.argv[3] || '/tmp/rf-ingame.png';
const PORT = 9222;

const chrome = spawn('google-chrome', [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-sandbox',
  '--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl',
  '--window-size=1280,800', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function rpc(ws, pending, method, params = {}) {
  const id = rpc._id = (rpc._id || 0) + 1;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error('timeout ' + method)); } }, 15000);
  });
}

try {
  await sleep(1200);
  let targets;
  for (let i = 0; i < 20; i++) {
    try { targets = await (await fetch(`http://localhost:${PORT}/json`)).json(); break; }
    catch { await sleep(300); }
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  const pending = new Map();
  const errors = [];
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push('EXC: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push('CONSOLE.error: ' + msg.params.args.map((a) => a.value || a.description || '').join(' '));
    }
  };
  await rpc(ws, pending, 'Runtime.enable');
  await rpc(ws, pending, 'Page.enable');
  await rpc(ws, pending, 'Page.navigate', { url: URL });
  await sleep(3500); // boot + asset load
  // Click the start button if present.
  const clicked = await rpc(ws, pending, 'Runtime.evaluate', {
    expression: `(()=>{const b=document.querySelector('#start-button');if(b){b.click();return 'clicked';}return 'no-start-button';})()`,
    returnByValue: true,
  });
  await sleep(3000); // let the game spawn + render frames
  // Probe game state from the canvas + any HUD.
  const probe = await rpc(ws, pending, 'Runtime.evaluate', {
    expression: `(()=>{const c=document.querySelector('canvas');const hud=document.querySelector('#tier-label')?.textContent;return JSON.stringify({hasCanvas:!!c,w:c?.width,h:c?.height,tierLabel:hud||null,title:document.title});})()`,
    returnByValue: true,
  });
  const shot = await rpc(ws, pending, 'Page.captureScreenshot', { format: 'png' });
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  console.log('start click:', clicked.result.value);
  console.log('probe:', probe.result.value);
  console.log('console/page errors:', errors.length);
  errors.slice(0, 12).forEach((e) => console.log('  ', e.slice(0, 200)));
  console.log('screenshot:', OUT);
  ws.close();
} catch (e) {
  console.error('CHECK FAILED:', e.message);
} finally {
  chrome.kill('SIGKILL');
}
