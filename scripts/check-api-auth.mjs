#!/usr/bin/env node
// Proves every mutating API route refuses an unauthenticated request.
//
//   node scripts/check-api-auth.mjs [baseUrl]      (default http://localhost:3000)
//   npm run test:api-auth -- https://iris-scu-app.netlify.app
//
// Guarded routes (Clerk session required) must answer 401 (signed out) or
// 403 (demo mode: no Clerk keys, so the route refuses to act).
// Webhook routes authenticate by signature, so an unsigned POST must be
// refused with 400 (bad/missing signature) or 503 (not configured).
// Any 2xx or 3xx is a failure: the route acted, or redirected as if it had.
// Bead es-hk5, 2026-10-21.

const base = (process.argv[2] || process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const cases = [
  { path: "/api/courses", body: { title: "auth-check probe" }, allow: [401, 403] },
  { path: "/api/courses/00000000-0000-0000-0000-000000000000/publish", allow: [401, 403] },
  { path: "/api/courses/demo/publish", allow: [401, 403] },
  { path: "/api/checkout", form: { tier: "practitioner", interval: "month" }, allow: [401, 403] },
  { path: "/api/portal", allow: [401, 403] },
  { path: "/api/webhooks/clerk", body: {}, allow: [400, 503] },
  { path: "/api/webhooks/stripe", body: {}, allow: [400, 503] },
];

let failed = 0;
for (const c of cases) {
  const init = { method: "POST", redirect: "manual", headers: {} };
  if (c.form) {
    init.body = new URLSearchParams(c.form);
  } else if (c.body) {
    init.headers["content-type"] = "application/json";
    init.body = JSON.stringify(c.body);
  }
  let status, text;
  try {
    const res = await fetch(base + c.path, init);
    status = res.status;
    text = (await res.text()).slice(0, 120).replace(/\s+/g, " ");
  } catch (err) {
    status = "ERR";
    text = String(err);
  }
  const ok = c.allow.includes(status);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  POST ${c.path} -> ${status} (want ${c.allow.join("/")})  ${text}`);
}

console.log(
  failed
    ? `\n${failed} route(s) did not refuse an unauthenticated POST`
    : `\nall ${cases.length} mutating routes refuse unauthenticated POSTs`
);
process.exit(failed ? 1 : 0);
