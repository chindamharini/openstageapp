# OpenStage

A free platform for independent artists to upload and share music directly —
no label, no gatekeeper. Listeners browse, search, play, like, and build
playlists. Built with React + Vite on the frontend and Supabase (Postgres +
Auth + file storage) as the backend.

Rename it whenever you like — "OpenStage" is just a placeholder.

---

## What's actually built vs. what's next

**Built:** artist sign-up, track upload (audio + optional cover art),
browsing/search, streaming playback with a persistent player bar, likes,
follows, playlists.

**Not built yet, worth knowing about:**
- No payments/monetization (you said free to start — smart, don't build this
  until you have real users)
- No recommendation algorithm — it's chronological browse + search for now
- No mobile app yet — this phase is the web app; wrapping it for
  Android/iOS comes after it's working and deployed (see Phase 5 below)
- No content moderation tools — worth adding before opening this to strangers
  publicly, since anyone could upload anything

---

## Phase 1 — Create your Supabase project (this is your backend)

1. Go to [supabase.com](https://supabase.com), sign up free, click **New project**
2. Once it's created, go to **SQL Editor** → **New query**
3. Open `supabase/schema.sql` from this project, paste its entire contents in, click **Run**.
   This creates all your database tables and locks them down with proper
   security rules (so, e.g., no one but you can edit your own profile).
4. Go to **Storage** in the left sidebar → **New bucket** → create one named
   exactly `tracks`, toggle it **Public**, create it. Repeat for a second
   bucket named exactly `covers`, also **Public**.
5. Go to **Settings → API**. You'll need two values from this page in a
   moment: **Project URL** and the **anon public** key.

---

## Phase 2 — Connect the app to your Supabase project

In this project folder:

```bash
cp .env.example .env
```

Open `.env` and paste in your Project URL and anon key from Phase 1, step 5.

---

## Phase 3 — Run it locally

```bash
npm install
npm run dev
```

Open the local URL it prints (usually `http://localhost:5173`). Sign up as
an artist, upload a track, and you should be able to play it right away.

---

## Phase 4 — Push to GitHub & deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit: OpenStage"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/openstage.git
git push -u origin main
```

Then on [vercel.com](https://vercel.com): **Add New → Project**, pick this
repo, and **before deploying**, add your two `.env` values under
**Environment Variables** (same names: `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`) — Vercel won't have your local `.env` file
automatically. Then deploy.

---

## Phase 5 — Wrap it as a mobile app

Once it's working and deployed, the same Capacitor approach from your studio
project applies here:

```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init "OpenStage" "com.yourname.openstage" --web-dir=dist
npm run build
npx cap add android
npx cap sync
npx cap open android
```

That opens Android Studio, where you can run it on an emulator/device and
later build a signed release for the Play Store. iOS follows the same
pattern with `@capacitor/ios` and requires a Mac + Xcode (see the Play
Store / App Store notes from your earlier project — the $25 / $99 developer
account requirements apply the same way here).

**One extra thing specific to a music app:** audio playback and background
play behave differently on mobile than in a browser. Capacitor apps run in a
WebView, so basic playback works, but things like lock-screen controls or
playing while the app is backgrounded need a plugin
(`@capacitor-community/media` or similar) — worth tackling once the core
app is solid, not on day one.

---

## If you already ran the schema before this update

The upload form now requires artists to confirm they own the rights to what
they're uploading before it's accepted. If you set up your Supabase project
before this change, run this once in the SQL Editor to add the new columns:

```sql
alter table tracks add column if not exists rights_confirmed boolean not null default false;
alter table tracks add column if not exists rights_confirmed_at timestamptz;
```

If you're setting up Supabase for the first time, ignore this — it's already
in `supabase/schema.sql`.

---

## Before you open this to the public

A few things worth doing before real strangers can upload music to a live
site, since right now there's no moderation:

- **A takedown/report path** — at minimum, an email address in your terms
  where people can report content (copyright, abuse, etc.)
- **Storage limits per artist** — right now uploads are unlimited; free
  Supabase storage has a real cap, and one generous user could fill it
- **Terms of service / upload agreement** — artists should confirm they own
  the rights to what they're uploading. I can draft this with you when
  you're closer to launch.

None of this blocks you from building and testing right now — just flagging
it so it's not a surprise later.
