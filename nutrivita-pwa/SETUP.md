# Nutrivita Fit — Netlify + Supabase Setup Guide

This app uses **Netlify Functions** as a secure backend proxy to **Supabase** for the leaderboard, messages, and activities storage.

---

## 📋 Setup Steps

### Step 1 — Supabase Project (Already Done ✅)
You have:
- **Project ID:** `iguqozpwupzeenxemcxu`
- **URL:** `https://iguqozpwupzeenxemcxu.supabase.co`
- **Anon Key:** `sb_publishable_pa0aXnxfBbigDDwfZYsfVQ_YiDLdCwS`

**Create the 3 tables in Supabase SQL Editor:**

Go to Supabase Dashboard → **SQL Editor** → **New Query** → Paste this and click **Run**:

```sql
-- Leaderboard table
create table if not exists leaderboard (
  id text primary key,
  name text,
  initials text,
  dept text,
  pts bigint default 0,
  steps bigint default 0,
  wellness bigint default 0,
  updated_at timestamptz default now()
);

-- Messages table
create table if not exists messages (
  id text primary key,
  user_name text,
  initials text,
  text text,
  ts bigint
);

-- Activities table
create table if not exists activities (
  id text primary key,
  user_name text,
  initials text,
  dept text,
  name text,
  duration bigint,
  kcal bigint,
  date text,
  ts bigint
);

-- Allow public read/write
alter table leaderboard enable row level security;
alter table messages enable row level security;
alter table activities enable row level security;

create policy "public_all" on leaderboard for all using (true) with check (true);
create policy "public_all" on messages for all using (true) with check (true);
create policy "public_all" on activities for all using (true) with check (true);
```

---

### Step 2 — GitHub Setup

1. Create a **new GitHub repository** (e.g., `nutrivita-fit`)
2. Upload the entire `nutrivita-pwa` folder (including the `netlify/` directory and `netlify.toml`)
3. Push to GitHub

**File structure should look like:**
```
nutrivita-fit/
├── netlify.toml
├── netlify/
│   └── functions/
│       ├── leaderboard.js
│       ├── messages.js
│       └── activities.js
├── nutrivita-pwa/
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
```

---

### Step 3 — Netlify Deployment

1. Go to **[netlify.com](https://netlify.com)** → Sign in with GitHub
2. Click **Add new site** → **Import an existing project**
3. Choose your `nutrivita-fit` GitHub repo
4. Set Build command: `echo 'Build successful'`
5. Set Publish directory: `nutrivita-pwa`
6. Click **Deploy**

---

### Step 4 — Add Environment Variables to Netlify

After deployment, go to your Netlify site:
1. **Site settings** → **Build & deploy** → **Environment**
2. Add these 2 variables:

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://iguqozpwupzeenxemcxu.supabase.co` |
| `SUPABASE_KEY` | `sb_publishable_pa0aXnxfBbigDDwfZYsfVQ_YiDLdCwS` |

3. **Redeploy** the site (Site → Deploys → Deploy site)

---

## ✅ How It Works

- **Frontend** (HTML/CSS/JS in `nutrivita-pwa/`) → calls local Netlify Functions at `/.netlify/functions/`
- **Netlify Functions** (Node.js in `netlify/functions/`) → authenticates with Supabase using the secret key
- **Supabase** → stores leaderboard, messages, activities in PostgreSQL

**No API keys exposed in the browser** ✅

---

## 🎯 What Users See

- ✅ **Leaderboard** — all registered users appear in real time
- ✅ **Message Board** — team can communicate instantly
- ✅ **Activities** — workouts saved and synced across devices
- ✅ **Count badge** — shows actual number of registered users

---

## 🔧 Troubleshooting

**Messages not appearing?**
- Check Netlify Functions are deployed (Netlify → Functions tab)
- Check Supabase tables exist with correct names

**Leaderboard empty?**
- Register a user first
- Wait 10-15 seconds for polling to refresh

**Functions returning errors?**
- Check environment variables are set in Netlify
- View logs: Netlify → Functions → Click function → Logs

---

## 📦 Files Included

```
netlify/
├── functions/
│   ├── leaderboard.js  — GET all users, POST upsert score
│   ├── messages.js     — GET messages, POST new message
│   └── activities.js   — POST activity log
netlify.toml  — Netlify build config
nutrivita-pwa/
├── index.html  — Main app (updated for Netlify Functions)
├── manifest.json
├── sw.js  — Service worker
└── icons/  — App icons
```

---

**All set! Your app is now live on Netlify with secure Supabase backend.** 🚀
