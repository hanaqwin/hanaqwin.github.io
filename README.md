# 🎂 Kejutan Ulang Tahun

Website statis ucapan ulang tahun yang lucu & interaktif. Suasana mulai gelap dengan
sebatang lilin dan saklar lampu — klik saklarnya, lalu semuanya meledak jadi pesta:
confetti, balon, kue, maskot, musik, dan kartu ucapan yang bisa dibuka.

Dibuat dengan **React 19 + Vite + TypeScript**, semua ilustrasi inline SVG, di-host gratis di **GitHub Pages**.

## ✨ Alurnya
1. Buka website → suasana gelap, ada lilin 🕯️ + saklar lampu di tengah.
2. Klik saklarnya → lampu menyala, confetti meledak, musik main, foto muncul.
3. Klik amplop 💌 → kartu ucapan terbuka.
4. (Bonus) Klik kuenya untuk meniup lilin 🎂.

## 🛠️ Cara Customize (cukup 1 file)
Semua yang bisa diubah ada di **`src/config.ts`**:

| Field | Isi |
| --- | --- |
| `recipientName` | Nama orang yang berulang tahun |
| `greeting` | Isi kartu ucapan (boleh beberapa baris) |
| `senderName` | Namamu — tampil sebagai tanda tangan kartu |
| `photoUrl` | Nama file foto (taruh di `public/`). Kosong = pakai placeholder lucu |
| `musicUrl` | Nama file lagu (taruh di `public/`) |
| `showBalloons` / `showCake` / `showMascot` / `enableSfx` | Nyalakan / matikan elemen ekstra |

### 🎵 Backsound (lagu)
Taruh file mp3-mu di folder `public/` dengan nama **`birthday-song.mp3`**
(atau ganti nilai `musicUrl`). Kalau filenya belum ada, website tetap jalan —
musiknya saja yang dilewati. Efek suara klik/pop dibuat dari kode, jadi tanpa file tambahan.

### 📸 Foto
Taruh foto di folder `public/` (mis. `public/photo.jpg`), lalu set
`photoUrl: "photo.jpg"` di `src/config.ts`.

## 💻 Jalankan di lokal
```bash
bun install
bun run dev
```
Lalu buka URL yang muncul (mis. http://localhost:5173).

> Pakai npm? Tinggal ganti `bun` → `npm` (`npm install`, `npm run dev`).

## 🚀 Deploy ke GitHub Pages
Workflow otomatis sudah disiapkan di `.github/workflows/deploy.yml`.
1. Push project ini ke GitHub (branch `main`).
2. Di repo: **Settings → Pages → Source: GitHub Actions**.
3. Tiap push ke `main` akan otomatis build & deploy.
4. Website live di `https://<username>.github.io/<nama-repo>/`.

Build memakai `base: './'` (path relatif), jadi jalan di sub-path GitHub Pages mana pun tanpa setting tambahan.
