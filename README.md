## SkillMonitorHQ – Real-time Shop-Floor Skill & Safety Tracking

> A web dashboard that helps teachers monitor student competency, machine utilisation, and safety-test compliance – all in real time.

---

## Overview

- **Purpose** – Provide educators, mentors, and administrators with a single place to:

  - manage students and machines,
  - enforce safety policies,
  - track usage statistics, and
  - gather feedback after every session.
- **Audience** – Makerspaces, high-school & college workshops, fabrication labs, or any environment where multiple learners share dangerous equipment.
- **Problem Solved** – Replaces paper logbooks and scattered spreadsheets with an automated system that:

  - authorises or denies access based on safety tests,
  - records session duration & apprentice/mentor pairings,
  - visualises lifetime experience per student & per machine, and
  - prompts users for star-rating feedback before they walk away.

---

## Features

* 🔑 **Role-based access** – Student, Apprentice, Teacher, Admin.
* **🤖 General & machine-specific safety tests** – Multiple-choice quizzes gate access until passed.
* 🕓 **Session timer** – Automatic stopwatch starts/stops to compute exact time on tool.
* ⭐ **Star rating & feedback** – Students rate their experience; averages are displayed live.
* 📊 **Real-time dashboards** – Totals for duration, session count, and ratings per user/machine.
* 🤝 **Apprentice mentoring** – Apprentices require approval from a mentor before activating machinery.
* 🧩 **Dynamic avatars** – Cloudinary-hosted profile pictures with overlay indicating skill level.
* 🔐 **NextAuth authentication** – Sign-in with unique student IDs; JWT tokens track roles & expiry.
* 🛠️ **Admin CRUD panels** – Create/update machines and students, attach learners to equipment, etc.
* 📱 **Responsive UI** – Tailwind CSS + custom fonts for kiosk-friendly full-screen displays.

*Unique points*: Real-time enforcement of safety status at the machine itself and per-session rating capture.

---

## Tech Stack

| Layer     | Technology                                                                       |
| --------- | -------------------------------------------------------------------------------- |
| Front-end | Next.js (Pages Router) · React · TypeScript · Tailwind CSS                    |
| State     | React Context API                                                                |
| Auth      | NextAuth.js (Credentials provider)                                               |
| Back-end  | Next.js API routes                                                               |
| ORM / DB  | Prisma · PostgreSQL                                                             |
| Media     | Cloudinary (avatars)                                                             |
| Tooling   | **bun** (package manager & runner) · Prisma Migrate · ESLint · Prettier |

Architecture highlights:

- Clean separation between UI (`/src/pages`, `/src/components`) and API (`/src/pages/api`).
- Relational data model (see `prisma/schema.prisma`) embodies users ⇄ machines with session history & M-N join table.
- Serverless style – API routes are stateless functions suitable for Vercel or other FaaS hosts.

---

## How It Works (High-level flow)

1. **Machine kiosk boots** → Teacher sets a `machineUUID` in localStorage via the admin panel.
2. **Student arrives** → Enters Student ID → NextAuth validates credentials.
3. **Access check** (`/api/machine/checkAccess`) decides:
   - authorised mentor? → immediate access;
   - apprentice? → wait for mentor;
   - test not passed? → redirect to quiz.
4. **Session start** → Stopwatch component posts `/api/session/start` and context toggles `runningSession`.
5. **During use** → UI shows cumulative stats; mentors can add apprentices in real time.
6. **Session end** → User clicks end, `/api/session/stop` finalises duration, then `/api/machine/updateRating` displays star-rating modal.
7. **Admin / Teacher dashboards** aggregate data for reporting and management.

---

## Setup & Installation

### Prerequisites

- **bun** ≥ 1.0 (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL 12+
- Cloudinary account (optional but recommended)

### Environment variables (`.env.local`)

```
DATABASE_URL="postgresql://user:pass@localhost:5432/smhq"
DIRECT_URL="postgresql://user:pass@localhost:5432/smhq"
NEXTAUTH_SECRET="super-secret-string"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="xxxx"
CLOUDINARY_API_KEY="yyyy"
CLOUDINARY_API_SECRET="zzzz"
```

### Install & Run

```bash
# 1. Clone
git clone https://github.com/FoothillEng/SkillMonitorHQ && cd SkillMonitorHQ

# 2. Install deps
bun install

# 3. Generate Prisma client & run migrations
bunx prisma migrate deploy  # use `reset` during local dev

# 4. Start dev server
bun run dev   # http://localhost:3000
```

## Usage Examples

- **Add a new machine** (API):

```bash
curl -X POST http://localhost:3000/api/admin/machine/create \
  -H 'Content-Type: application/json' \
  -d '{"name":"Laser Cutter"}'
```

- **Start a session** (from client):

```ts
await fetch('/api/session/start', {
  method: 'POST',
  body: JSON.stringify({ userMachineId })
});
```

- **Typical dev commands**

```bash
bun run lint      # ESLint
bun run format    # Prettier
bunx prisma studio   # visual DB explorer
```

## Project Structure

```
SkillMonitorHQ/
├─ prisma/            # schema & migrations
├─ public/            # static assets (logo, favicon)
├─ src/
│  ├─ components/     # Reusable React UI pieces
│  ├─ lib/            # Context providers, Prisma client
│  ├─ pages/
│  │  ├─ api/         # Serverless API routes (auth, session, machine...)
│  │  └─ *            # Next.js pages (admin, teacher, student views)
│  └─ styles/         # Tailwind globals
├─ next.config.js
├─ tailwind.config.js
└─ bun.lockb          # deterministic bun lockfile
```

Main entry point is `src/pages/_app.tsx`; API entry point is any file in `src/pages/api/`.

---

## Challenges & Learnings

- **Real-time auth refresh** – Syncing localStorage machine context with JWT expiry required custom `AuthContext` logic.
- **Complex relational model** – Designing a flexible M-N relationship between machines & test questions while keeping migrations readable taught me advanced Prisma features.
- **Kiosk UX** – Large-font, touch-friendly components demanded attention to responsive Tailwind utilities.
- **bun adoption** – Migrating from npm to bun shaved cold-start times but surfaced some ecosystem edge cases.

---

## Future Improvements

- 🔔 **Push notifications** - Apprentices request mentor approval.
- 📈 **Usage charts** - Hourly and daily utilisation trends.
- 📄 **CSV export** - Sessions available for offline analytics.
- 🔑 **RFID sign-in** - One-tap sign-in (in the works with the school).
- 🧪 **E2E tests** - Automated test suite with Playwright.

---

## Credits & Inspiration

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [bun](https://bun.sh/) – lightning-fast JS runtime & package manager
- [Cloudinary](https://cloudinary.com/) – effortless image transforms

> Built as a capstone project with ❤️, caffeine, and a drive to make shop-floors safer and learning smarter.
