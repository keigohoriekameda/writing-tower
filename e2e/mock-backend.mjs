// Local stand-in for Supabase (Auth + PostgREST) and OpenAI, used ONLY by the
// e2e run. No real credentials, no network, no production data.
// Usage: node e2e/mock-backend.mjs  (listens on 127.0.0.1:54321)
import http from "node:http"

const PORT = Number(process.env.MOCK_PORT ?? 54321)
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url")

const USERS = {
  s001: { id: "00000000-0000-0000-0000-000000000001", password: "pw-s001", active: true, access: true },
  s002: { id: "00000000-0000-0000-0000-000000000002", password: "pw-s002", active: true, access: true },
  s003: { id: "00000000-0000-0000-0000-000000000003", password: "pw-s003", active: true, access: false }, // no product access
  s005: { id: "00000000-0000-0000-0000-000000000005", password: "pw-s005", active: true, access: true }, // one student per viewport so
  s006: { id: "00000000-0000-0000-0000-000000000006", password: "pw-s006", active: true, access: true }, // per-student rate limits don't mix
  s004: { id: "00000000-0000-0000-0000-000000000004", password: "pw-s004", active: false, access: true }, // inactive profile
}
const byId = (id) => Object.entries(USERS).find(([, u]) => u.id === id)

const freshProgress = () => ({
  [USERS.s001.id]: new Map([[1, "2026-01-01T00:00:00.000Z"]]),
  [USERS.s005.id]: new Map([[1, "2026-01-01T00:00:00.000Z"]]),
  [USERS.s006.id]: new Map([[1, "2026-01-01T00:00:00.000Z"]]),
  [USERS.s002.id]: new Map(),
})
const state = {
  progress: freshProgress(),
  openaiMode: "ok", // ok | error500 | badjson | slow | injected
  completeFails: false,
  quotaMode: "ok", // ok | limited
  counters: { openai: 0, completeDay: 0, quota: 0 },
  lastUserPrompt: "",
}

const jwtFor = (id) =>
  `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: id, role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.mocksig`
const userFromAuth = (req) => {
  const m = /^Bearer\s+\S+\.(\S+)\.\S+$/.exec(req.headers.authorization ?? "")
  if (!m) return null
  try {
    const sub = JSON.parse(Buffer.from(m[1], "base64url").toString()).sub
    return byId(sub) ?? null
  } catch {
    return null
  }
}
const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { "Content-Type": "application/json", ...headers })
  res.end(body === undefined ? "" : JSON.stringify(body))
}
const readBody = (req) =>
  new Promise((r) => {
    let d = ""
    req.on("data", (c) => (d += c))
    req.on("end", () => r(d ? JSON.parse(d) : {}))
  })

function single(req, res, row) {
  const wantObject = /vnd\.pgrst\.object/.test(req.headers.accept ?? "")
  if (wantObject) {
    return row
      ? send(res, 200, row)
      : send(res, 406, { code: "PGRST116", message: "no rows", details: "0 rows", hint: null })
  }
  return send(res, 200, row ? [row] : [])
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x")
  const p = url.pathname
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  if (req.method === "OPTIONS") return send(res, 204)

  // ---- test control -------------------------------------------------
  if (p === "/__control") {
    Object.assign(state, await readBody(req))
    return send(res, 200, { ok: true })
  }
  if (p === "/__state") {
    return send(res, 200, {
      ...state,
      progress: Object.fromEntries(Object.entries(state.progress).map(([k, v]) => [k, [...v.keys()]])),
    })
  }
  if (p === "/__reset") {
    state.openaiMode = "ok"; state.completeFails = false; state.quotaMode = "ok"
    state.counters = { openai: 0, completeDay: 0, quota: 0 }
    state.progress = freshProgress()
    return send(res, 200, { ok: true })
  }

  // ---- Supabase Auth ------------------------------------------------
  if (p === "/auth/v1/token") {
    const { email, password } = await readBody(req)
    const loginId = String(email).split("@")[0]
    const u = USERS[loginId]
    if (!u || u.password !== password) {
      return send(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials", code: "invalid_credentials" })
    }
    return send(res, 200, {
      access_token: jwtFor(u.id), token_type: "bearer", expires_in: 3600, refresh_token: "r-" + u.id,
      user: { id: u.id, aud: "authenticated", role: "authenticated", email, app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" },
    })
  }
  if (p === "/auth/v1/user") {
    const found = userFromAuth(req)
    if (!found) return send(res, 401, { code: 401, error_code: "bad_jwt", msg: "invalid JWT" })
    return send(res, 200, { id: found[1].id, aud: "authenticated", role: "authenticated", email: `${found[0]}@skyline.test`, app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" })
  }
  if (p === "/auth/v1/logout") return send(res, 204)

  // ---- PostgREST ----------------------------------------------------
  if (p.startsWith("/rest/v1/")) {
    const found = userFromAuth(req)
    const table = p.slice("/rest/v1/".length)
    if (!found) return send(res, 401, { code: "PGRST301", message: "JWT invalid" })
    const [, u] = found
    if (table === "profiles") return single(req, res, u.active ? { login_id: found[0], is_active: true } : { login_id: found[0], is_active: false })
    if (table === "products") return single(req, res, { product_code: "writing-tower", is_active: true })
    if (table === "user_product_access") return single(req, res, u.access ? { is_active: true, expires_at: null } : null)
    if (table === "wt_day_progress") {
      const rows = [...(state.progress[u.id] ?? new Map()).entries()].map(([d, at]) => ({ day_number: d, completed_at: at }))
      return send(res, 200, rows)
    }
    if (table === "rpc/wt_complete_day") {
      const { p_day_number } = await readBody(req)
      state.counters.completeDay++
      if (state.completeFails) return send(res, 500, { code: "XX000", message: "simulated failure" })
      const m = (state.progress[u.id] ??= new Map())
      if (!m.has(p_day_number)) m.set(p_day_number, new Date().toISOString())
      return send(res, 200, [{ day_number: p_day_number, completed_at: m.get(p_day_number) }])
    }
    if (table === "rpc/wt_consume_feedback_quota") {
      state.counters.quota++
      if (state.quotaMode === "limited") return send(res, 200, [{ allowed: false, reason: "hourly", retry_after_seconds: 90 }])
      return send(res, 200, [{ allowed: true, reason: null, retry_after_seconds: 0 }])
    }
    return send(res, 404, { message: "unknown table " + table })
  }

  // ---- OpenAI -------------------------------------------------------
  if (p === "/openai/v1/chat/completions") {
    const body = await readBody(req)
    state.counters.openai++
    const user = body.messages.find((m) => m.role === "user")?.content ?? ""
    state.lastUserPrompt = user
    if (state.openaiMode === "error500") return send(res, 500, { error: { message: "simulated upstream failure" } })
    if (state.openaiMode === "slow") await new Promise((r) => setTimeout(r, 1500))
    const essay = /<student_text>\n([\s\S]*?)\n<\/student_text>/.exec(user)?.[1] ?? ""
    const quote = essay.split(/\s+/).slice(0, 6).join(" ")
    const content =
      state.openaiMode === "badjson"
        ? "Sure! Great essay."
        : state.openaiMode === "hallucinated"
          ? JSON.stringify({ evidence: "totally unrelated words here", praise: "よく書けています。", goodPoints: ["良い点1です。", "良い点2です。"], oneImprovement: "改善点です。", example: "This is an example sentence." })
          : JSON.stringify({
              evidence: quote,
              praise: `「${quote}」から始める書き出しがはっきりしていて良いですね。`,
              goodPoints: ["意見が最初に書けています。", "理由が整理されています。"],
              oneImprovement: "理由に具体例を足してみましょう。",
              example: "For example, students can look up new words in class.",
            })
    return send(res, 200, { id: "x", object: "chat.completion", created: 0, model: body.model, choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } })
  }

  send(res, 404, { message: "not found " + p })
})
server.listen(PORT, "127.0.0.1", () => console.log("mock backend on", PORT))
