# Revue

AI-powered pull request reviewer. Connect your GitHub repositories and get instant, automated code reviews powered by Claude.
(took me so long)

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Auth** — Auth.js v5 with GitHub OAuth
- **Database** — PostgreSQL via Supabase
- **ORM** — Prisma 7
- **AI** — Anthropic Claude (`claude-opus-4-6`) / open AI, Google Gen AI, IBM watson
- **GitHub API** — Octokit
- **Styling** — Tailwind CSS v4

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Mehrage/Revue
cd Revue
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root (see below for how to get `DATABASE_URL` from Supabase).

```env
DATABASE_URL=your_supabase_postgresql_connection_string

AUTH_SECRET=your_auth_secret
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret

ANTHROPIC_API_KEY=your_anthropic_api_key
```

#### Connect to Supabase

1. **Create a project** — Go to [supabase.com](https://supabase.com) → Sign in → **New project**. Pick org, name, database password, and region.

2. **Get the connection string** — In the dashboard: **Project Settings** (gear) → **Database** → under **Connection string** choose **URI**.
   - Use the **Session mode** (Supavisor) string that uses **port 5432**. It looks like:
   - `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your database password (the one you set when creating the project).

3. **Put it in `.env`** — Set `DATABASE_URL` to that full URI (in quotes if it contains special characters).

4. **Run migrations** — From the project root:
   ```bash
   npx prisma migrate dev
   ```
   This creates the tables (User, Account, Session, Review, etc.) in your Supabase database.

For production or serverless, you can use **Transaction mode** (port 6543) and add `?pgbouncer=true` to the URL; for local dev and migrations, Session mode (5432) is enough.

### 4. Generate Prisma(s)

```bash
npx prisma generate
```

### 5. Set up the database

```bash
npx prisma migrate dev
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:####](http://localhost:####).

## GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set **Homepage URL** to `http://localhost:####`
4. Set **Callback URL** to `http://localhost:####/api/auth/callback/github`
5. Copy the Client ID and Client Secret into your `.env`


