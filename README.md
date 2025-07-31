# TemplateGuards
Template Guard for transition of PACS systems which may not allow templates.
# 🧠 TemplateGuard

A productivity tool to help radiologists retain their personal template style while transitioning from PowerScribe360 to MosaicOS. Features include:

- 🌐 Web uploader with specialty + protocol metadata
- 📦 Cloud storage (Supabase)
- 🧠 AI priming phrase generator
- 📊 Analytics dashboard (usage, time saved, top tags)
- 💖 Phrase favorites, history, search, tag filters
- 🧩 Chrome extension with floating UI overlay

---

## 📁 Project Structure
```
.
├── components/                # React UI components
│   ├── TemplateGuardUploader.tsx
│   ├── TemplatePhraseConverter.tsx
│   └── DashboardPreview.tsx
├── public/                   # Chrome Extension files
│   ├── content.js
│   ├── index.html
│   ├── manifest.json
│   └── icon.png
├── pages/                    # Next.js Pages (if using Next.js)
├── supabase/                 # SQL schema setup
│   └── schema.sql
├── .env.local                # Supabase credentials
└── README.md
```

---

## 🚀 Deployment Instructions

### 1. 🌐 Web App (Vercel or Netlify)
- Push to GitHub
- Go to [vercel.com](https://vercel.com)
- Connect repo, add env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy

### 2. 🧩 Chrome Extension (Manual Load)
- Go to `chrome://extensions`
- Enable Developer Mode
- Click **Load unpacked** → Select `/public/` folder

---

## 🛠️ Supabase Setup (Schema)
Run the following in Supabase SQL editor:

```sql
-- templates uploaded
create table template_metadata (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  filename text,
  specialty text,
  modality text,
  region text,
  protocol text,
  keywords text,
  tags text[],
  priming_phrase text,
  is_favorite boolean default false,
  inserted_at timestamp default now()
);

-- preferences
create table profiles (
  id uuid primary key references auth.users(id),
  show_history boolean default true,
  show_favorites boolean default true
);

-- usage logs
create table usage_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  template_id uuid,
  action text, -- 'copy', 'favorite', 'delete', 'insert'
  timestamp timestamp default now()
);
```

Also enable:
- Storage bucket: `templates`
- Auth: Email (or Google)

---

## 📱 Mobile Friendly
Site supports mobile browsing & phrase access with responsive layout.

---

## 📊 Analytics Dashboard
- Tracks tool usage over time
- Shows performance: time saved, usage trends
- Manual report export by shift/week/month

---

## 🔐 Auth
- Supabase Auth: email login
- User ID used to isolate phrases, analytics, preferences

---

## 🙌 Contributors
Built with ❤️ for radiologists by TemplateGuard.

---

## License
MIT
