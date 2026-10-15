// Whose key is whose.
//
// Every sketchbook key is made on the repo owner's account (the workflow only
// accepts issues opened by the owner), so to GitHub they are all the same
// person. src/sketchbook-keys.json pairs each key's SHA-256 with the name its
// pages are signed with instead; scripts/add-sketchbook-key.mjs writes it.
//
// Only the hash ships with the site. A GitHub key is ~80 random characters, so
// its hash gives nothing away — and a hash can't be used to post anything.

import raw from "../sketchbook-keys.json";
import { cleanText, LIMITS } from "./drawingFormat";
import { isTokenShaped } from "./sketchStore";

interface Entry {
  name: string;
  sha256: string;
}

const SHA256 = /^[0-9a-f]{64}$/;

function readEntries(): Entry[] {
  const list = (raw as { keys?: unknown }).keys;
  if (!Array.isArray(list)) return [];
  return list.flatMap((item): Entry[] => {
    const { name, sha256 } = (item ?? {}) as Record<string, unknown>;
    const clean = cleanText(name, LIMITS.by);
    if (!clean || typeof sha256 !== "string" || !SHA256.test(sha256)) return [];
    return [{ name: clean, sha256 }];
  });
}

const ENTRIES = readEntries();

/** A GitHub key, by its shape: fine-grained (github_pat_) or classic (ghp_). */
export function looksLikeGithubKey(input: string): boolean {
  return /^(github_pat_|ghp_)/.test(input) && isTokenShaped(input);
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** The name a key is registered under, or null when it isn't one of ours. */
export async function nameForKey(token: string): Promise<string | null> {
  if (ENTRIES.length === 0 || typeof crypto === "undefined" || !crypto.subtle) return null;
  const hash = await sha256Hex(token);
  return ENTRIES.find((entry) => entry.sha256 === hash)?.name ?? null;
}
