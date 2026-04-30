# HireX — Project Context & Handoff Document
Last Updated: 2026-05-01

---

## ✅ What Has Been Completed

### Phase 1: Database Architecture (Supabase) — DONE
- **Project URL:** `https://iuzysbqdqdmkyebgmdno.supabase.co`
- **4 Tables Created:** `portals`, `jobs`, `applications`, `messages`
- **RLS (Row Level Security):** Enabled on all tables
- **Schema file:** `supabase/migrations/20260430000000_phase1_initial_schema.sql`
- **TypeScript types:** `types/database.ts`

### Phase 2: AI Core Engine (NVIDIA NIM) — DONE
- **Model:** `abacusai/dracarys-llama-3.1-70b-instruct`
- **Base URL:** `https://integrate.api.nvidia.com/v1`
- **Config file:** `lib/ai-config.ts`
- **API Routes:**
  - `app/api/ats-parser/route.ts` — Parses resumes vs job descriptions, returns match score
  - `app/api/smart-reply/route.ts` — Generates 3 professional reply drafts (Professional, Enthusiastic, Strategic)

### Phase 3: Frontend Data Wiring — DONE
- `app/(dashboard)/dashboard/jobs/page.tsx` — Fetches real jobs from Supabase, Auto-Queue inserts into `applications` table
- `app/(dashboard)/dashboard/applications/page.tsx` — Fetches user's application history with joined job data
- `app/(dashboard)/dashboard/inbox/page.tsx` — Fetches messages, AI Draft Picker UI with 3 tone cards + "Use this reply" button

---

## 🔑 Environment Variables

### Local (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://iuzysbqdqdmkyebgmdno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key already set>
NVIDIA_API_KEY=<nvapi key already set>
```

### Vercel Production
All 3 variables above are already configured in Vercel dashboard.

---

## 🐛 Bugs Fixed During Session
1. **Double-tag syntax errors** (`<<divdiv`, `<<hh1`) in `inbox/page.tsx` and `applications/page.tsx` — caused by the other AI agent. Both files were completely rewritten.
2. **`useState` double generic** (`<<MessageMessageRecord`) in `inbox/page.tsx` — fixed.
3. **Smart Reply API crash** — `response_format: json_object` not supported by dracarys model. Removed it and added robust JSON extraction with regex + normalization.
4. **Profile page crash** for new users — changed `.single()` to `.maybeSingle()`.

---

## 🚧 Next Feature: Portal Connection (Phase 4)

### What the User Wants
User wants the "Connection Matrix" portal page to actually work — currently it shows LinkedIn, Indeed, Naukri, Glassdoor as fake connected portals. 

User's idea: Enter login credentials → HireX logs in automatically → scrapes jobs + auto-applies.

### Recommended Approach: Chrome Extension
This is the safest and most legal approach (same as Simplify Jobs):
- User installs a Chrome Extension
- Extension runs IN the user's browser (no password storage on server)
- Extension detects job pages (LinkedIn, Naukri, etc.) and injects an "Apply with HireX" button
- Extension communicates with HireX backend via API

### Alternative Approach: Server-side Playwright
- Store credentials encrypted in Supabase `portals` table (already has `api_key`, `access_token`, `refresh_token` columns)
- Run Playwright on a dedicated server (NOT Vercel — needs long-running process)
- Playwright logs into portals, scrapes jobs, inserts into `jobs` table
- Risk: Bot detection, ToS violation, account bans

### Portals Table Schema (Already exists in DB)
```sql
portals (
  id, user_id, portal_name, api_key, 
  access_token, refresh_token, status, 
  created_at, updated_at
)
```

---

## 📁 Important Files
```
hirex app/
├── app/
│   ├── api/
│   │   ├── ats-parser/route.ts       ← AI resume parser
│   │   └── smart-reply/route.ts      ← AI email reply generator
│   └── (dashboard)/dashboard/
│       ├── jobs/page.tsx             ← Live jobs feed + auto-queue
│       ├── applications/page.tsx     ← Application history tracker
│       ├── inbox/page.tsx            ← AI-powered communication hub
│       ├── portals/page.tsx          ← Connection Matrix (currently MOCK)
│       └── profile/page.tsx          ← User profile (uses maybeSingle)
├── lib/
│   ├── ai-config.ts                  ← NVIDIA NIM config
│   └── supabase/
│       ├── client.ts                 ← Browser Supabase client
│       └── server.ts                 ← Server-side Supabase client
├── types/
│   └── database.ts                   ← TypeScript types for all DB tables
├── supabase/
│   └── migrations/
│       └── 20260430000000_phase1_initial_schema.sql
└── HIREX_CONTEXT.md                  ← THIS FILE
```

---

## ⚠️ Important Rules for AI Agent
1. **NEVER use `&&` in PowerShell** — use `;` to chain commands instead
2. **Always check for double-tag JSX errors** before pushing — the previous agent had a bug where it doubled tags like `<<divdiv`
3. **`portals/page.tsx` is still MOCK** — do not assume it's functional
4. **Vercel deployment** — just `git push` and Vercel auto-deploys from `main` branch
5. **Do NOT run `npm run build` locally** unless specifically testing — use `npm run dev`

---

## 🎯 Session Goal for Next Time
Implement Phase 4: Portal Connection
- Make the "Connection Matrix" page actually functional
- Start with Chrome Extension OR server-side Playwright (discuss with user first)
- Suggested first step: Ask user which approach they prefer, then implement portal credential saving + status indicator
