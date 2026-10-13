/* Lab prototypes: PREVIEW = true, nothing is saved. */
export const PREVIEW = true;
const CFG = { url: "https://wyqpxtfsgqfpnlufkvcg.supabase.co", key: "sb_publishable_4ZXzZizUU6g-vHd_vrpcwg_VLGoqjss", table: "vibes", col: "feeling" };
export const state = { p: 0, target: 0, sent: false };
const line = document.getElementById('line'), send = document.getElementById('send');
function upd() {
  state.target = Math.min(1, line.value.length / 160);
  send.disabled = line.value.trim().length < 3;
  line.style.height = 'auto'; line.style.height = line.scrollHeight + 'px';
}
line.addEventListener('input', upd); upd();
async function save(text) {
  if (PREVIEW) { await new Promise(r => setTimeout(r, 500)); return true; }
  const r = await fetch(CFG.url + '/rest/v1/' + CFG.table, { method: 'POST', headers: { apikey: CFG.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ [CFG.col]: text, consent: true }) });
  return r.ok;
}
send.addEventListener('click', async () => {
  const t = line.value.trim().slice(0, 160); if (t.length < 3) return;
  send.disabled = true;
  if (!(await save(t))) { send.disabled = false; return; }
  state.sent = true;
  const ui = document.querySelector('.ui'); ui.style.transition = 'opacity .8s'; ui.style.opacity = '0';
  setTimeout(() => { const a = document.getElementById('after'); a.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => a.classList.add('in'))); }, 2400);
});
/* calls fn(p, t) every frame with eased progress: 0 = nothing written, 1 = 160 characters, ~2 after sending */
export function run(fn) {
  let last = performance.now();
  (function f(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    state.p += ((state.sent ? 2.2 : state.target) - state.p) * Math.min(1, dt * (state.sent ? 1.1 : 2.4));
    fn(state.p, now / 1000); requestAnimationFrame(f);
  })(last);
}
