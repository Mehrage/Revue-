# Revue

AI-powered pull request reviewer. Connect your GitHub repositories and get instant, automated code reviews powered by Claude.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Auth** — Auth.js v5 with GitHub OAuth
- **Database** — PostgreSQL via Supabase
- **ORM** — Prisma 7
- **AI** — Anthropic Claude (`claude-opus-4-6`)
- **GitHub API** — Octokit
- **Styling** — Tailwind CSS v4

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/habisahmad/revue.git
cd revue
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_supabase_postgresql_connection_string

AUTH_SECRET=your_auth_secret
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret

ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. Set up the database

```bash
npx prisma migrate dev
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set **Homepage URL** to `http://localhost:3000`
4. Set **Callback URL** to `http://localhost:3000/api/auth/callback/github`
5. Copy the Client ID and Client Secret into your `.env`

## Contributors

- [@habisahmad](https://github.com/habisahmad)
