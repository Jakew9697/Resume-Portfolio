// Native Chrome touch input against the browser already opened by agent-browser.
// BROWSER_CDP_URL comes from `agent-browser --session <name> get cdp-url`.
import { writeFile } from "node:fs/promises";
const browser = new URL(process.env.BROWSER_CDP_URL);
const targets = await fetch(`http://${browser.host}/json/list`).then((r) =>
  r.json(),
);
const target = targets.find(
  (item) => item.type === "page" && /(#work)$/.test(item.url),
);
if (!target) throw new Error("Open the Work carousel in the QA browser first");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});
let id = 0;
const pending = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  pending.get(message.id)?.(message);
};
const command = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const request = ++id;
    const timeout = setTimeout(() => {
      pending.delete(request);
      reject(new Error(`${method} timed out`));
    }, 10000);
    pending.set(request, (message) => {
      clearTimeout(timeout);
      pending.delete(request);
      message.error
        ? reject(new Error(message.error.message))
        : resolve(message.result);
    });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
const evaluate = async (expression) =>
  (await command("Runtime.evaluate", { expression, returnByValue: true }))
    .result.value;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  const width = await evaluate("innerWidth");
  const before = await evaluate(
    'Number(document.querySelector("#work .folio-slide-count").textContent.split("/")[0])',
  );
  if (before !== 1) throw new Error("Start on the first Work slide");
  await command("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 1,
  });
  const point = (x) => [{ x, y: 300, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
  await command("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: point(width * 0.85),
  });
  for (let step = 1; step <= 10; step++) {
    await command("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: point(width * (0.85 - (0.7 * step) / 10)),
    });
    await delay(30);
  }
  await command("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await delay(800);
  const after = await evaluate(
    'Number(document.querySelector("#work .folio-slide-count").textContent.split("/")[0])',
  );
  const result = {
    passed: before === 1 && after === 2,
    input: "Chrome native touchStart/touchMove/touchEnd",
    before,
    after,
    width,
    url: target.url,
    checkedAt: new Date().toISOString(),
  };
  await writeFile(
    process.argv[2] || "evidence/carousel-touch.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
  if (!result.passed) process.exitCode = 1;
} finally {
  await command("Emulation.setTouchEmulationEnabled", { enabled: false });
  socket.close();
}
