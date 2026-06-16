// Title-screen probe (no start click): reads the skyline img src + screenshots the title.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const URL = process.argv[2], OUT = process.argv[3], PORT = 9333;
const chrome = spawn('google-chrome', ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-sandbox',
  '--use-gl=angle', '--use-angle=swiftshader', '--window-size=1280,720', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let _id = 0;
function rpc(ws, p, m, params = {}) { const id = ++_id; ws.send(JSON.stringify({ id, method: m, params }));
  return new Promise((res, rej) => { p.set(id, { res, rej }); setTimeout(() => { if (p.has(id)) { p.delete(id); rej(new Error('t/o ' + m)); } }, 15000); }); }
try {
  await sleep(1200);
  let t; for (let i = 0; i < 20; i++) { try { t = await (await fetch(`http://localhost:${PORT}/json`)).json(); break; } catch { await sleep(300); } }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); const p = new Map();
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => { const o = JSON.parse(m.data); if (o.id && p.has(o.id)) { const x = p.get(o.id); p.delete(o.id); o.error ? x.rej(new Error(o.error.message)) : x.res(o.result); } };
  await rpc(ws, p, 'Page.enable'); await rpc(ws, p, 'Runtime.enable');
  await rpc(ws, p, 'Page.navigate', { url: URL });
  await sleep(3500); // title screen, NO start click
  const probe = await rpc(ws, p, 'Runtime.evaluate', { returnByValue: true, expression:
    `(()=>{const s=document.querySelector('#title-overlay .ny-skyline-img');const ov=document.querySelector('#title-overlay');return JSON.stringify({skylineSrc:s?s.getAttribute('src'):null,resolved:s?s.src:null,titleOverlayShown:ov?getComputedStyle(ov).display!=='none'&&!ov.classList.contains('hidden'):null,title:document.title});})()` });
  const shot = await rpc(ws, p, 'Page.captureScreenshot', { format: 'png' });
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  console.log('probe:', probe.result.value); console.log('screenshot:', OUT);
  ws.close();
} catch (e) { console.error('FAILED:', e.message); } finally { chrome.kill('SIGKILL'); }
