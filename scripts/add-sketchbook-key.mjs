// Register a GitHub key with the sketchbook, under the name its pages are
// signed with.
//
//   bun run add-key        (or: node scripts/add-sketchbook-key.mjs)
//
// Asks whose key it is ("Miaw", "Hieu Quyen") and the key itself, which is never
// shown on screen. Saves the key's SHA-256 — never the key — and the name into
// src/sketchbook-keys.json, replacing any earlier key under the same name.
// Commit and push that file; once the site has deployed, pasting the key in the
// sketchbook unlocks drawing, signed with that name.
//
// What you type stays on this computer. The one exception is the key itself,
// shown to GitHub to check it works, is on the right account and can post to
// the repo — which also makes the sketchbook's label if it isn't there yet.

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'

const FILE = new URL('../src/sketchbook-keys.json', import.meta.url)
const CONFIG = new URL('../src/config.ts', import.meta.url)

/** Must match SKETCH_LABEL in src/lib/github.ts and the label sync-drawings.yml waits for. */
const LABEL = 'sketch'
/** Mirrors LIMITS.by in src/lib/drawingFormat.ts. */
const MAX_NAME = 40

const { stdin, stdout } = process

const isGithubKey = (token) => /^(github_pat_|ghp_)[A-Za-z0-9_]{16,251}$/.test(token)
const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex')

// ── asking ───────────────────────────────────────────────────────────────────

// A real terminal can hide what is typed; a pipe can't. Git Bash's own window
// (mintty) counts as a pipe, so it gets a warning instead.
const lines = stdin.isTTY ? null : createInterface({ input: stdin })[Symbol.asyncIterator]()

function ask(question, { hidden = false } = {}) {
  if (lines) {
    stdout.write(question)
    return lines.next().then(({ value }) => value ?? '')
  }

  return new Promise((resolve) => {
    stdout.write(question)
    let value = ''
    const onData = (chunk) => {
      // Arrow keys and the like arrive as escape sequences; none of them belong
      // in a name or a key.
      if (chunk.startsWith('\u001b')) return
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.off('data', onData)
          stdin.setRawMode(false)
          stdin.pause()
          stdout.write(hidden ? `  (${Array.from(value).length} characters)\n` : '\n')
          return resolve(value)
        }
        if (ch === '\u0003') {
          stdin.setRawMode(false)
          stdout.write('\n')
          process.exit(130)
        }
        if (ch === '\u007f' || ch === '\b') {
          if (!value) continue
          value = Array.from(value).slice(0, -1).join('')
          if (!hidden) stdout.write('\b \b')
          continue
        }
        if (ch < ' ') continue
        value += ch
        if (!hidden) stdout.write(ch)
      }
    }
    stdin.setRawMode(true)
    stdin.setEncoding('utf8')
    stdin.resume()
    stdin.on('data', onData)
  })
}

function fail(message) {
  console.error(`\n✗ ${message}`)
  process.exit(1)
}

// ── the run ──────────────────────────────────────────────────────────────────

const repo = /sketchbookRepo:\s*["']([^"']+)["']/.exec(readFileSync(CONFIG, 'utf8'))?.[1]
const owner = repo?.split('/')[0]
if (!owner) fail('No sketchbookRepo in src/config.ts.')

const saved = JSON.parse(readFileSync(FILE, 'utf8'))
const keys = Array.isArray(saved.keys) ? saved.keys : []

console.log('Register a GitHub key with the sketchbook.')
if (lines) {
  console.log('\n! This terminal will SHOW what you type. To keep the key hidden, run')
  console.log('  this from PowerShell or Windows Terminal instead.')
}
if (keys.length > 0) console.log(`\nRegistered now: ${keys.map((entry) => entry.name).join(', ')}`)
console.log('')

const name = Array.from((await ask('Whose key is it? (the name their pages are signed with): ')).trim())
  .slice(0, MAX_NAME)
  .join('')
if (!name) fail('A name is needed — it is how their pages are signed.')

const token = (await ask('GitHub key (hidden): ', { hidden: true })).trim()
if (!isGithubKey(token)) fail('That isn’t a GitHub key. It should start with github_pat_.')

const hash = sha256(token)
const clash = keys.find(
  (entry) => entry.sha256 === hash && entry.name.toLowerCase() !== name.toLowerCase(),
)
if (clash) fail(`That key is already registered to ${clash.name}. Each person needs their own key.`)

// ── checking the key against the real thing ──────────────────────────────────

const api = (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

stdout.write('\nChecking the key with GitHub… ')
let user
try {
  user = await api('/user')
} catch (error) {
  fail(`Couldn’t reach GitHub (${error.message}). Nothing was saved — try again online.`)
}
if (user.status === 401) fail('GitHub doesn’t accept this key — expired, or copied wrong?')
if (!user.ok) fail(`GitHub answered ${user.status}. Nothing was saved.`)
const { login } = await user.json()
if (String(login).toLowerCase() !== owner.toLowerCase()) {
  fail(`This key belongs to @${login}. Sketchbook keys must be made on @${owner}.`)
}

// The one thing a key-creation link can't pre-fill is which repo the key
// reaches — so prove it can write issues there, now rather than on the first
// drawing. Making sure the sketchbook's label exists takes exactly that
// permission, and the label is needed anyway (same one ensureLabel in
// src/lib/github.ts makes).
const labels = `/repos/${repo}/labels`
const label = { name: LABEL, color: 'ff8fab', description: 'a page from the sketchbook' }
const found = await api(`${labels}/${LABEL}`)
const proof =
  found.status === 404
    ? await api(labels, { method: 'POST', body: JSON.stringify(label) })
    : await api(`${labels}/${LABEL}`, { method: 'PATCH', body: JSON.stringify(label) })
if (proof.status === 403 || proof.status === 404) {
  fail(
    `This key can’t post to ${repo}. On GitHub, edit the key: Repository access → ` +
      `Only select repositories → ${repo}, and Permissions → Issues → Read and write.`,
  )
}
if (!proof.ok) fail(`GitHub answered ${proof.status} while checking the key. Nothing was saved.`)
console.log(`ok — @${login}, and it can post to ${repo}.`)

const kept = keys.filter((entry) => entry.name.toLowerCase() !== name.toLowerCase())
const replaced = kept.length !== keys.length
kept.push({ name, sha256: hash })
writeFileSync(FILE, `${JSON.stringify({ v: 1, keys: kept }, null, 2)}\n`)

console.log(`\n✓ ${replaced ? 'Replaced' : 'Registered'} ${name}’s key in src/sketchbook-keys.json.`)
console.log('  Commit and push that file; the key unlocks drawing once the site has deployed.')
