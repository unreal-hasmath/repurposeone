# RepurposeOne - Setup & Run Guide

Follow these quick steps to get the project running on a new laptop.

---

### Step 1: Requirements Check
Make sure the new laptop has:
- **Node.js**: v18 or later ([nodejs.org](https://nodejs.org/))
- **Python**: 3.10+ ([python.org](https://python.org/)) - *Make sure "Add Python to PATH" is checked during install.*

---

### Step 2: Install Node Dependencies
Open terminal / command prompt inside the project folder:
```bash
npm install
```

---

### Step 3: Install Python Dependencies & Scraper Libraries
Install the scraping libraries (`twikit`, `instaloader`, `youtube-transcript-api`):
```bash
pip install -r requirements.txt
```

---

### Step 4: Environment Variables (`.env.local`)
Create or edit `.env.local` in the project root:
```env
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY_HERE
OPENROUTER_MODEL=nvidia/nemotron-3.5-embed-1b:free

# Supabase Credentials (Optional for cloud sync, localStorage fallback is automatic)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

### Step 5: Start the Application

**Development Mode (Live Reload):**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Mode:**
```bash
npm run build
npm run start
```
