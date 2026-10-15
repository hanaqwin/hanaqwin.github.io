# The sketchbook

Pages drawn right on the site, at **https://hanaqwin.github.io/#/sketchbook**,
and pinned up for everyone. Each finished page ends up as a file in this folder.

Anyone can look, and anyone can doodle on their own device. Only a device
holding a **key** can pin a page up.

---

## Keys

Two GitHub keys, both made on the **hanaqwin** account: one for Miaw, one for
Hieu Quyen. Each of you pastes your own key into the sketchbook, and the key
decides the name on your pages. One each, so either can be cancelled without
touching the other.

The `sketch` label the pages arrive with makes itself the first time a key is
registered or a page is sent. Nothing to set up there.

### 1. Make the two keys

Sign in to GitHub **as hanaqwin** first. The links open GitHub's form already
filled in: name, owner `hanaqwin`, 365 days, and **Issues: Read and write**.
Change the expiry if you like; when it runs out, the site says the key stopped
working.

- [Miaw's key](https://github.com/settings/personal-access-tokens/new?name=sketchbook-miaw&description=Miaw%27s+key+for+the+sketchbook+on+hanaqwin.github.io&target_name=hanaqwin&expires_in=365&issues=write)
- [Hieu Quyen's key](https://github.com/settings/personal-access-tokens/new?name=sketchbook-hieu-quyen&description=Hieu+Quyen%27s+key+for+the+sketchbook+on+hanaqwin.github.io&target_name=hanaqwin&expires_in=365&issues=write)

**The one thing a link can't fill in:** under **Repository access**, choose
_Only select repositories_ → `hanaqwin/hanaqwin.github.io`. Then **Generate
token** and copy it. It starts with `github_pat_`, and GitHub only shows it
once.

(By hand instead: https://github.com/settings/personal-access-tokens/new →
resource owner `hanaqwin` → only `hanaqwin/hanaqwin.github.io` → Repository
permissions → Issues: Read and write. Nothing else; _Metadata: Read-only_ adds
itself.)

### 2. Register each key under its name

In the repo folder, from **PowerShell or Windows Terminal** (Git Bash's own
window can't hide what you type), run this once per key:

```
bun run add-key
```

It asks whose key it is (`Miaw`, then `Hieu Quyen` on the second run) and the
key, which is not shown on screen. It checks the key with GitHub, including
that it can post here, and saves nothing if anything is off.

Only the key's **SHA-256** goes into `src/sketchbook-keys.json`, next to the
name. A GitHub key is ~80 random characters, so the hash gives nothing away and
can't be used to post anything. That's what lets the file ship inside the
public site.

### 3. Commit and push `src/sketchbook-keys.json`

Once the site has deployed, open the sketchbook, tap **"have a key? unlock
drawing on this device"**, and paste your key. The site hashes it, finds your
name, checks the key with GitHub, and from then on that device draws as you.
A key that isn't registered is refused, even a working one.

The key stays in that browser only and is only ever sent to GitHub. **"Forget
the key"** at the bottom of the sketchbook removes it from the device.

**New key for someone?** Make it, run `bun run add-key` again with the same
name, commit and push. It replaces their old entry.

**Cancelling a key:** https://github.com/settings/personal-access-tokens → the
token → Delete. The device's next send fails with "that key doesn't work any
more". Remove its line from `src/sketchbook-keys.json` too.

### What a key can and can't do

It can only work with **issues** on this one repo. It cannot touch the site's
code, its workflows or any other repo.

But within issues it acts **as hanaqwin**. Whoever holds it could post a page,
or open and edit any issue. So keep keys to the two of you, and delete one the
moment a phone is lost.

Keys made on any other account are refused twice: the site checks the account
when the key is pasted, and the workflow only accepts issues opened by the
repo owner.

---

## What happens when a page is sent

1. The site opens an issue titled `🖍️ <name> — by <who>`, labelled `sketch`.
   The drawing is inside it as a `drawing` code block (deflated, base64).
   Nothing else in the issue matters.
2. [`sync-drawings.yml`](../../.github/workflows/sync-drawings.yml) checks the
   issue is the owner's, then
   [`sync-drawing.mjs`](../../.github/scripts/sync-drawing.mjs) unpacks the
   drawing, checks every value and rebuilds it from scratch. It commits
   `yyyy-mm-dd-<issue>.json` here and deploys.
3. It comments the link on the issue. About a minute later the page is on the
   site for everyone.

The device that sent it doesn't wait: the page shows in its sketchbook straight
away with a **drying…** tag, which goes once the deployed site has it.

An unfinished page is saved on the device after every stroke. Leaving, or the
phone locking, loses nothing: **keep drawing** picks it up.

## Taking one down

**Remove the `sketch` label** from its issue. Put the label back and it
returns, same date, same place.

The repo is public, so a page taken down is still in git history and in the
issue. Taking it off the site is not erasing it.

## The files

`yyyy-mm-dd-<issue>.json`: the date the issue was opened (Asia/Ho_Chi_Minh),
then the issue number. One stroke per line, so a diff reads stroke by stroke.

```jsonc
{
  "v": 1,
  "issue": 12,
  "date": "2026-10-15",
  "by": "Miaw",
  "caption": "a cake for you 🎂",
  "width": 800,          // the page is always 800 × 1000 units
  "height": 1000,
  "strokes": [
    // tool: pen | marker | eraser. size is in page units. points is a flat
    // [x, y, pressure 0–100, …]. pressure: true only for a real stylus.
    {"tool":"pen","color":"#5b4660","size":11,"pressure":false,"points":[120,90,50,124,96,50]}
  ]
}
```

The limits (strokes, points, caption length) live in
[`src/lib/drawingFormat.ts`](../lib/drawingFormat.ts) and are mirrored in
`sync-drawing.mjs`. Change both together.

## One thing to know about `hanaqwin.github.io`

The key is kept in the browser's storage for `hanaqwin.github.io`. On a
`<login>.github.io` site, that storage is shared by every GitHub Pages site on
the account (`hanaqwin.github.io/<any-repo>`). That's fine while this is the
only one. Before publishing another repo's Pages site under this account,
remember that its scripts could read the key.
