# The People's Assembly — Product Requirements Document (Complete)

**Version:** 1.1 (Merged)
**Based on:** Game Design Document (GDD) Draft 6 · PRD v1.0 · PRD Draft (Stakeholder Review)
**Date:** June 2025
**Status:** Ready for Development

> **Confidential — Internal Use Only**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Problem Statement](#2-background--problem-statement)
3. [Product Overview](#3-product-overview)
4. [Goals, Non-Goals & Success Metrics](#4-goals-non-goals--success-metrics)
5. [Target Users](#5-target-users)
6. [Scope](#6-scope)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Technical Stack & Architecture](#8-technical-stack--architecture)
9. [Data Models](#9-data-models)
10. [Game State Machine](#10-game-state-machine)
11. [Real-Time Communication — Socket.io Events](#11-real-time-communication--socketio-events)
12. [REST API Endpoints](#12-rest-api-endpoints)
13. [Feature Requirements (Per Screen)](#13-feature-requirements-per-screen)
14. [Game Content Specification](#14-game-content-specification)
15. [Business Logic](#15-business-logic)
16. [Score Export Specification](#16-score-export-specification)
17. [Offline Mode Requirements](#17-offline-mode-requirements)
18. [Non-Functional Requirements](#18-non-functional-requirements)
19. [Acceptance Criteria (Definition of Done)](#19-acceptance-criteria-definition-of-done)
20. [Deliverables](#20-deliverables)
21. [Development Milestones](#21-development-milestones)
22. [Risks & Open Questions](#22-risks--open-questions)
23. [Development Gaps & Audit Notes (July 2026 Audit)](#23-development-gaps--audit-notes-july-2026-audit)
24. [Post-M2 Stakeholder Feedback (July 2026)](#24-post-m2-stakeholder-feedback-july-2026)
25. [Audit Kode — Temuan & Rencana Perbaikan](#25-audit-kode--temuan--rencana-perbaikan-per-item-feedback-24)

---

## 1. Executive Summary

**The People's Assembly** is a web-based governance simulation tool designed to facilitate face-to-face discussion in workshops, universities, youth leadership programs, and civic education settings — including ASEAN-context governance workshops. The product acts as a "digital moderator" (similar in spirit to social party games like _Mr. White_): it assigns secret roles, presents policy scenarios, times discussion, collects votes, and calculates outcomes, while the actual deliberation happens between players in the room.

This PRD translates the approved Game Design Document (GDD Draft 6) into product requirements for the engineering team, covering functional scope, technical architecture, data/export requirements, and acceptance criteria. Game content (scenarios, scoring formulas, role data) is included as **binding specification**, since these values directly determine system behavior.

---

## 2. Background & Problem Statement

Facilitators currently run governance and civic-education role-play sessions manually — using paper role cards, manual vote tallying, and manual scorekeeping. This approach is slow, error-prone, and hard to scale across multiple simultaneous groups or venues with unreliable internet.

The product needs to **digitize session orchestration** (roles, timers, voting, scoring, outcome reveal) while **preserving the in-person discussion experience**, and must work in venues without internet access.

---

## 3. Product Overview

**The People's Assembly** is a real-time, multiplayer web-based governance simulation game. One facilitator manages a session room; 8–12 players each assume a stakeholder role (Mayor, Journalist, etc.) and collectively make policy decisions across 3 scenarios. Decisions affect 6 city indicators. The session ends with a city archetype reveal and educational reflection.

The platform supports two parallel deployment modes:

- **Online Mode:** Cloud-hosted; players connect via the internet.
- **Offline Mode:** Locally hosted on the facilitator's machine; players connect via local WiFi/hotspot.

At session end, the facilitator exports group results to an Excel spreadsheet.

---

## 4. Goals, Non-Goals & Success Metrics

### 4.1 Goals

- Build a stable, real-time multiplayer game with < 300ms event latency under normal WiFi conditions.
- Support 8–12 concurrent players per room, with multiple rooms running simultaneously.
- Deliver identical feature parity between Online and Offline Mode.
- Produce a downloadable Excel export of session results at game end.
- Enable player reconnection mid-session using only Room Code + Full Name.
- Mobile-responsive UI that works on phones (players) and tablets/laptops (facilitator).

### 4.2 Non-Goals

- User accounts, login, or email verification.
- Chat or voice communication between players.
- Persistent player profiles or cross-session leaderboards.
- Automatic cloud sync of exported spreadsheets.
- Payment gateway or matchmaking.
- AI/bot players.
- Scenarios 4–10 (deferred post-launch).

### 4.3 Success Metrics

| Goal                                                 | Success Metric                                                                                      |
| :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| Replace manual facilitation with a digital moderator | Facilitator can run a full session (room creation → export) without paper materials                 |
| Support venues with and without internet             | Identical player/facilitator experience confirmed in both Online and Offline mode                   |
| Enable easy reporting after sessions                 | Facilitator can download a results spreadsheet within the same session, with zero manual data entry |
| Support concurrent multi-group use                   | Multiple rooms/instances run simultaneously with no data leakage between sessions                   |
| Ship on schedule                                     | First Draft by W4 June, Testing by W1 July, Launch by W3 July                                       |

---

## 5. Target Users

### 5.1 Facilitator (Session Host, Non-Player)

Runs one session at a time: creates the room, advances phases, manages timers, reveals outcomes, and exports results. Assumed non-technical for Offline Mode setup, so local deployment must require minimal steps.

### 5.2 Players

8–12 participants per session (8–10 recommended). Join with Room Code, Full Name, and Country only — no account, login, or email verification. Play one assigned role for the session duration (approximately 30–60 minutes total).

---

## 6. Scope

### 6.1 In Scope

- Room creation, joining, and role assignment
- Full gameplay loop: scenario presentation, timed discussion, private voting, Mayor decision (including tie-break and veto), outcome reveal, educational reflection, live dashboard
- Score/result calculation (PS, GQS, SS, FPS) and City Archetype determination
- Per-session, per-room spreadsheet export (.xlsx)
- Online (cloud) and Offline (local network) deployment, runnable in parallel
- Reconnection to an active session via Room Code + Full Name
- Shareable result card (PNG/URL)
- Mobile-responsive UI
- English language, with translation hooks for Bahasa Indonesia and/or Thai

### 6.2 Out of Scope (Not Required for Launch)

- User accounts, login, or email verification
- In-app chat or voice communication (discussion is face-to-face)
- Player profiles or leaderboards across sessions
- Payment gateway or matchmaking
- Automatic cloud sync of exported spreadsheets (e.g., auto-upload to Google Sheets) — manual download only
- Scenarios 4–10 (deferred post-launch)

---

## 7. User Roles & Permissions

| Role               | Auth Method                                                                             | Capabilities                                                                                                                                                           |
| :----------------- | :-------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Facilitator**    | Unique `facilitator_token` stored in session (localStorage), generated at room creation | Create room, start game, advance phases, set discussion timer, reveal outcomes, trigger next scenario, view all vote counts, end game, export results, restart session |
| **Player**         | Room Code + Full Name (re-join via same pair)                                           | Join room, view own role card, participate in discussion (face-to-face), cast vote, view outcomes                                                                      |
| **Mayor (Player)** | Same as Player, plus system-granted Mayor privileges                                    | View vote tally (anonymized), accept majority, choose on tie, invoke veto with justification                                                                           |

No server-side auth tokens for players — identity is verified by `(session_id, full_name)` pair uniqueness.

---

## 8. Technical Stack & Architecture

### 8.1 Recommended Stack

| Layer              | Technology                                           |
| :----------------- | :--------------------------------------------------- |
| Frontend           | React.js (Vite) + Tailwind CSS                       |
| Backend            | Node.js 20 LTS + Express.js                          |
| Real-time          | Socket.io v4                                         |
| Database (Online)  | PostgreSQL 15 (via Prisma ORM)                       |
| Database (Offline) | SQLite (via Prisma — same schema, different adapter) |
| Export             | `exceljs` (Node.js)                                  |
| Containerization   | Docker + Docker Compose (for Offline Mode packaging) |
| Hosting (Online)   | Any VPS / PaaS (Railway, Render, Fly.io)             |

> **Note:** Prisma allows switching between PostgreSQL (online) and SQLite (offline) by changing only the `DATABASE_URL` environment variable. Use a single codebase for both modes.

### 8.2 System Architecture

```
[Player Browser]  ──┐
[Player Browser]  ──┤   WebSocket (Socket.io)   ┌──────────────────────────────┐
[Player Browser]  ──┼──────────────────────────▶│   Node.js / Express Server   │
[Player Browser]  ──┤                            │   - Socket.io Hub             │
[Facilitator]     ──┘   REST (export/admin)      │   - Game Logic Engine         │
                   ────────────────────────────▶│   - REST API                  │
                                                 └──────────────┬───────────────┘
                                                                │
                                                   ┌───────────▼──────────────┐
                                                   │   Database               │
                                                   │   PostgreSQL (online)    │
                                                   │   SQLite     (offline)   │
                                                   └──────────────────────────┘
```

### 8.3 Environment Variables

```env
# Shared
NODE_ENV=production | development
PORT=3000
DATABASE_URL=postgresql://... | file:./dev.db
SESSION_SECRET=<random 32-char string>

# Online Mode only
CORS_ORIGIN=https://yourdomain.com

# Offline Mode
OFFLINE_MODE=true
```

---

## 9. Data Models

All models use UUID primary keys. Timestamps are UTC ISO 8601.

### 9.1 `sessions`

```sql
id              UUID         PRIMARY KEY DEFAULT gen_random_uuid()
room_code       VARCHAR(10)  UNIQUE NOT NULL  -- e.g. "GOV-4821"
status          ENUM('waiting', 'active', 'completed')  DEFAULT 'waiting'
phase           ENUM(see §10)  DEFAULT 'lobby'
scenario_index  INT          DEFAULT 0        -- 0, 1, 2
facilitator_token  VARCHAR(64)  NOT NULL      -- random token, stored in facilitator's localStorage
created_at      TIMESTAMPTZ  DEFAULT NOW()
started_at      TIMESTAMPTZ
ended_at        TIMESTAMPTZ
```

### 9.2 `players`

```sql
id              UUID         PRIMARY KEY DEFAULT gen_random_uuid()
session_id      UUID         REFERENCES sessions(id) ON DELETE CASCADE
full_name       VARCHAR(100) NOT NULL
display_name    VARCHAR(100) NOT NULL    -- same as full_name, alias for UI
country         VARCHAR(100) NOT NULL
role            ENUM('mayor','journalist','community_rep','business_rep',
                     'social_welfare','environmental','investor','youth_rep')
                             NULLABLE    -- assigned at game start
is_connected    BOOLEAN      DEFAULT true
joined_at       TIMESTAMPTZ  DEFAULT NOW()

UNIQUE(session_id, full_name)            -- prevents duplicate names per session
```

### 9.3 `votes`

```sql
id              UUID         PRIMARY KEY DEFAULT gen_random_uuid()
session_id      UUID         REFERENCES sessions(id) ON DELETE CASCADE
player_id       UUID         REFERENCES players(id) ON DELETE CASCADE
scenario_index  INT          NOT NULL   -- 0, 1, or 2
choice          CHAR(1)      NOT NULL   -- 'A', 'B', or 'C'
voted_at        TIMESTAMPTZ  DEFAULT NOW()

UNIQUE(session_id, player_id, scenario_index)  -- one vote per player per scenario
```

### 9.4 `game_states`

One row per session, created when game starts.

```sql
session_id              UUID  PRIMARY KEY REFERENCES sessions(id)

-- Indicators (all start at 50, clamped 0–100)
economic_growth         INT   DEFAULT 50
government_budget       INT   DEFAULT 50
people_welfare          INT   DEFAULT 50
public_trust            INT   DEFAULT 50
environmental_quality   INT   DEFAULT 50
transparency            INT   DEFAULT 50

-- Scenario decisions (set by Mayor after each scenario)
scenario_0_choice       CHAR(1)   -- 'A', 'B', or 'C'
scenario_1_choice       CHAR(1)
scenario_2_choice       CHAR(1)
scenario_0_veto         BOOLEAN   DEFAULT false
scenario_0_veto_reason  TEXT
scenario_1_veto         BOOLEAN   DEFAULT false
scenario_1_veto_reason  TEXT
scenario_2_veto         BOOLEAN   DEFAULT false
scenario_2_veto_reason  TEXT

-- Final scores (populated at game end)
ps                      NUMERIC(5,2)
gqs                     NUMERIC(5,2)
ss                      NUMERIC(5,2)
fps                     NUMERIC(5,2)
archetypes              TEXT[]             -- e.g. ['Balanced Prosperity City', 'Good Governance City']
beneficiaries           TEXT[]             -- role names that met threshold
```

### 9.5 Game Constants (Hardcoded — Not in DB)

> Full values specified in §14. The constants below show the structure; actual indicator deltas come from §14.5.

```javascript
// scenarios.js — imported by server
export const SCENARIOS = [
  {
    id: 1,
    title: "New Industrial Zone",
    description:
      "A consortium proposes a new industrial zone promising jobs, tax revenue, and investment...",
    stakeholder_positions: { mayor: "...", journalist: "..." /* see §14.1 */ },
    options: {
      A: {
        label: "Fast-Track Approval",
        description: "...",
        advantages: "...",
        risks: "...",
        indicators: {
          economic_growth: +20,
          government_budget: +15,
          people_welfare: +5,
          public_trust: -10,
          environmental_quality: -20,
          transparency: -15,
        },
      },
      B: {
        /* see §14.5 */
      },
      C: {
        /* see §14.5 */
      },
    },
    reflection:
      "Sustainable industrialization requires balancing immediate economic gains...",
  },
  // Scenario 2 — Universal Free Education (see §14.5)
  // Scenario 3 — Open Forest for Mining (see §14.5)
];

export const ROLES = [
  "mayor",
  "journalist",
  "community_rep",
  "business_rep",
  "social_welfare",
  "environmental",
  "investor",
  "youth_rep",
];

export const ROLE_DISTRIBUTION = {
  8: {
    mayor: 1,
    journalist: 1,
    community_rep: 1,
    business_rep: 1,
    social_welfare: 1,
    environmental: 1,
    investor: 1,
    youth_rep: 1,
  },
  9: {
    mayor: 1,
    journalist: 1,
    community_rep: 2,
    business_rep: 1,
    social_welfare: 1,
    environmental: 1,
    investor: 1,
    youth_rep: 1,
  },
  10: {
    mayor: 1,
    journalist: 1,
    community_rep: 2,
    business_rep: 2,
    social_welfare: 1,
    environmental: 1,
    investor: 1,
    youth_rep: 1,
  },
  11: {
    mayor: 1,
    journalist: 1,
    community_rep: 2,
    business_rep: 2,
    social_welfare: 1,
    environmental: 1,
    investor: 2,
    youth_rep: 1,
  },
  12: {
    mayor: 1,
    journalist: 1,
    community_rep: 2,
    business_rep: 2,
    social_welfare: 2,
    environmental: 2,
    investor: 1,
    youth_rep: 1,
  },
};

// Full SECRET_INFO text — see §14.3
export const SECRET_INFO = {
  mayor: "A close ally on the city council is privately pressuring you...",
  journalist:
    "A confidential source claims possible irregularities in project approvals...",
  community_rep:
    "A local community leader has privately promised political support...",
  business_rep:
    "Your company stands to profit significantly from one particular option...",
  social_welfare:
    "You've received a confidential report that a welfare program may have been misused...",
  environmental:
    "You possess unreleased data suggesting environmental impacts may be worse...",
  investor:
    "Investors are considering pulling out if major projects face delays...",
  youth_rep:
    "A media company has offered sponsorship and visibility in exchange for your support...",
};

export const BENEFIT_THRESHOLDS = {
  mayor: (s) => s.public_trust >= 70 && calcGQS(s) >= 60,
  journalist: (s) => s.transparency >= 70,
  community_rep: (s) => s.people_welfare >= 70,
  business_rep: (s) => s.economic_growth >= 70,
  social_welfare: (s) => s.people_welfare >= 80,
  environmental: (s) => s.environmental_quality >= 75,
  investor: (s) => s.economic_growth >= 75 && s.government_budget >= 65,
  youth_rep: (s) => (s.economic_growth + s.environmental_quality) / 2 >= 70,
};
```

---

## 10. Game State Machine

The `phase` column in `sessions` follows this linear flow. The facilitator triggers all transitions manually (except `timer_update`, which is automatic).

```
lobby
  └──[facilitator: start_game]──▶ role_reveal
       └──[facilitator: open_scenario]──▶ scenario_display
            └──[facilitator: start_discussion]──▶ discussion
                 └──[facilitator: end_discussion]──▶ voting
                      └──[all votes cast OR facilitator force-close]──▶ mayor_decision
                           └──[mayor submits decision]──▶ outcome_reveal
                                └──[facilitator: next_scenario OR end_game]
                                        │
                                        ├──[if scenario_index < 2]──▶ scenario_display  (loop)
                                        │
                                        └──[if scenario_index == 2]──▶ final_reflection
                                                  └──[facilitator: export]──▶ score_export
```

**Phase enum values:**
`lobby` | `role_reveal` | `scenario_display` | `discussion` | `voting` | `mayor_decision` | `outcome_reveal` | `final_reflection` | `score_export`

---

## 11. Real-Time Communication — Socket.io Events

All Socket.io events join the room identified by `room_code`. Every player and the facilitator join the Socket.io room named after the `room_code`.

### 11.1 Client → Server

#### Facilitator Events

| Event                            | Payload                                              | Description                                                |
| :------------------------------- | :--------------------------------------------------- | :--------------------------------------------------------- |
| `facilitator:create_room`        | `{ facilitator_token }`                              | Creates room, returns `room_code`                          |
| `facilitator:start_game`         | `{ room_code, facilitator_token }`                   | Assigns roles, transitions to `role_reveal`                |
| `facilitator:open_scenario`      | `{ room_code, facilitator_token }`                   | Pushes current scenario to all players                     |
| `facilitator:start_discussion`   | `{ room_code, facilitator_token, duration_seconds }` | Starts countdown timer                                     |
| `facilitator:end_discussion`     | `{ room_code, facilitator_token }`                   | Ends discussion early or on timer expiry; opens voting     |
| `facilitator:force_close_voting` | `{ room_code, facilitator_token }`                   | Closes voting even if not all players voted                |
| `facilitator:next_scenario`      | `{ room_code, facilitator_token }`                   | Increments `scenario_index`, goes to `scenario_display`    |
| `facilitator:end_game`           | `{ room_code, facilitator_token }`                   | Calculates final scores, transitions to `final_reflection` |

#### Player Events

| Event              | Payload                             | Description                              |
| :----------------- | :---------------------------------- | :--------------------------------------- |
| `player:join`      | `{ room_code, full_name, country }` | Joins lobby                              |
| `player:reconnect` | `{ room_code, full_name }`          | Rejoins active session, restores state   |
| `player:vote`      | `{ room_code, player_id, choice }`  | Submits vote (A/B/C) during voting phase |

#### Mayor Events (Player with role = mayor)

| Event          | Payload                                           | Description                                       |
| :------------- | :------------------------------------------------ | :------------------------------------------------ |
| `mayor:accept` | `{ room_code, player_id, choice }`                | Accepts a choice (majority or tie-break)          |
| `mayor:veto`   | `{ room_code, player_id, choice, justification }` | Overrides vote with justification (1–2 sentences) |

### 11.2 Server → Client

#### Broadcast to Room (`io.to(room_code).emit`)

| Event                      | Payload                                                       | Trigger                                    |
| :------------------------- | :------------------------------------------------------------ | :----------------------------------------- |
| `room:player_joined`       | `{ players: [{id, full_name, country, is_connected}] }`       | Any player joins                           |
| `room:player_disconnected` | `{ player_id, full_name }`                                    | Player socket disconnects                  |
| `room:player_reconnected`  | `{ player_id, full_name }`                                    | Player rejoins                             |
| `game:started`             | `{ phase: 'role_reveal' }`                                    | Facilitator starts game                    |
| `game:scenario_opened`     | `{ scenario_index, scenario: {...} }`                         | Facilitator opens scenario                 |
| `game:discussion_started`  | `{ duration_seconds }`                                        | Discussion phase begins                    |
| `game:timer_update`        | `{ seconds_remaining }`                                       | Every second during discussion             |
| `game:voting_opened`       | `{ scenario_index }`                                          | Voting phase begins                        |
| `game:vote_cast`           | `{ votes_cast: N, total_players: N }`                         | Any player votes (count only, no identity) |
| `game:voting_closed`       | `{}`                                                          | Mayor decision phase begins                |
| `game:mayor_decided`       | `{ choice, veto_used, justification? }`                       | Mayor submits decision                     |
| `game:outcome_revealed`    | `{ choice, indicator_changes, new_indicators }`               | Outcome phase                              |
| `game:final`               | `{ indicators, ps, gqs, ss, fps, archetypes, beneficiaries }` | Game ends                                  |
| `error`                    | `{ code, message }`                                           | Any server-side error                      |

#### Private to Facilitator (`io.to(facilitator_socket_id).emit`)

| Event                      | Payload                            | Trigger                          |
| :------------------------- | :--------------------------------- | :------------------------------- |
| `facilitator:room_created` | `{ room_code, facilitator_token }` | Room created                     |
| `facilitator:vote_summary` | `{ A: N, B: N, C: N, total: N }`   | All votes cast (or force-closed) |

#### Private to Player (`io.to(player_socket_id).emit`)

| Event                   | Payload                                            | Trigger                       |
| :---------------------- | :------------------------------------------------- | :---------------------------- |
| `player:role_assigned`  | `{ role, description, objective, secret_info }`    | Game started                  |
| `player:vote_confirmed` | `{ choice }`                                       | Server confirms vote received |
| `player:state_restored` | `{ phase, scenario_index, indicators, role, ... }` | Reconnection                  |

#### Private to Mayor

| Event                | Payload                                                          | Trigger       |
| :------------------- | :--------------------------------------------------------------- | :------------ |
| `mayor:vote_summary` | `{ A: N, B: N, C: N, total: N, is_tie: bool, tied_options: [] }` | Voting closed |

---

## 12. REST API Endpoints

Base path: `/api/v1`

| Method | Path                  | Auth                       | Description                                                           |
| :----- | :-------------------- | :------------------------- | :-------------------------------------------------------------------- | ------------ |
| `POST` | `/rooms`              | None                       | Create a new room. Returns `room_code` and `facilitator_token`.       |
| `GET`  | `/rooms/:code`        | None                       | Get room status and player count. Used on Join page to validate code. |
| `GET`  | `/rooms/:code/export` | `facilitator_token` header | Generate and download `.xlsx` export for a completed session.         |
| `GET`  | `/health`             | None                       | Server health check. Returns `{ status: 'ok', mode: 'online'          | 'offline' }` |

### Request / Response Schemas

**`POST /rooms`**

```json
// Request: (no body)
// Response 201:
{
  "room_code": "GOV-4821",
  "facilitator_token": "abc123xyz..."
}
```

**`GET /rooms/:code`**

```json
// Response 200:
{
  "room_code": "GOV-4821",
  "status": "waiting",
  "phase": "lobby",
  "player_count": 4,
  "max_players": 12
}
// Response 404: { "error": "Room not found" }
// Response 410: { "error": "Session already completed" }
```

**`GET /rooms/:code/export`**

- Header: `x-facilitator-token: <token>`
- Response: Binary `.xlsx` file download
- Content-Disposition: `attachment; filename="TPA_Results_GOV4821_2025-07-15.xlsx"`
- Response 403: `{ "error": "Unauthorized" }`
- Response 404: `{ "error": "Session not found or not completed" }`

---

## 13. Feature Requirements (Per Screen)

Each section uses this format:

- **FR-[N]** = Feature Requirement ID
- **AC** = Acceptance Criteria

---

### FR-01 — Landing Page

**Purpose:** Entry point. Routes user to Create Room or Join Room.

**AC:**

- [ ] Two CTAs visible: "Create a Room" (Facilitator) and "Join a Room" (Player).
- [ ] No login or registration required.
- [ ] Page loads in < 2 seconds.
- [ ] Responsive on mobile (375px) and desktop (1280px).

---

### FR-02 — Create Room Page

**Purpose:** Facilitator creates a new session.

**Flow:**

1. Facilitator clicks "Create a Room".
2. Client calls `POST /api/v1/rooms`.
3. Server returns `room_code` and `facilitator_token`.
4. Client stores `facilitator_token` in `localStorage`.
5. Facilitator is redirected to the Lobby Page.

**AC:**

- [ ] Room Code is displayed prominently (e.g., large font, copy-to-clipboard button).
- [ ] `facilitator_token` is stored in `localStorage` under key `tpa_facilitator_token`.
- [ ] If `facilitator_token` already exists in `localStorage` for the same room, page warns: "You already have an active session" with option to continue or start fresh.
- [ ] Room Code format: 3 uppercase letters + hyphen + 4 digits (e.g., `GOV-4821`). Generated server-side.

---

### FR-03 — Join Room Page

**Purpose:** Players enter room details to join.

**Fields:**

- Room Code (text, required, auto-uppercase)
- Full Name (text, required, max 100 chars)
- Country (text or dropdown, required)

**Flow:**

1. Player submits form.
2. Client calls `GET /api/v1/rooms/:code` to validate room existence and status.
3. If valid, client emits `player:join` via Socket.io.
4. Server validates: room exists, status is `waiting`, player count < 12, full_name not already taken.
5. On success: redirect to Lobby Page.

**AC:**

- [ ] Room Code input accepts 7–10 chars, auto-capitalizes.
- [ ] Form validates all 3 fields before submission.
- [ ] Error states: Room not found, Room is full (≥12), Session already started, Name already taken in this room.
- [ ] If game has already started and player enters the same Full Name used before, treat as reconnection (see FR-14).

---

### FR-04 — Lobby Page

**Purpose:** Waiting room before game starts.

**Facilitator View:**

- List of players who have joined (name, country, connected status).
- Room Code displayed for sharing.
- "Start Game" button (enabled only when 8 ≤ player count ≤ 12).
- Warning if player count < 8.

**Player View:**

- Confirmation: "You've joined! Waiting for the facilitator to start..."
- List of players who have joined (names only).
- Player count indicator.

**AC:**

- [ ] Lobby updates in real-time as players join (via `room:player_joined`).
- [ ] "Start Game" button is disabled if player count < 8 or > 12.
- [ ] Facilitator sees player count and min/max indicators.
- [ ] Clicking "Start Game" emits `facilitator:start_game`.
- [ ] Page auto-redirects all clients to Role Reveal when game starts.

---

### FR-05 — Role Reveal Page

**Purpose:** Each player privately sees their assigned role.

**Display per player:**

- Role Name (e.g., "Journalist")
- Role Description
- Objective
- **Secret Information** (distinct visual treatment — e.g., sealed/highlighted box)

**AC:**

- [ ] Role card content is player-specific. No player can see another player's role or secret info.
- [ ] Role assignment follows the ROLE_DISTRIBUTION table exactly based on player count (see §14.2).
- [ ] Role assignment is random within the distribution (Fisher-Yates shuffle).
- [ ] Mayor sees additional note: "You will have decision-making power after each vote."
- [ ] Facilitator sees a role list summary (all players and their assigned roles) — visible only on facilitator view.
- [ ] A "Continue" or "I've read my role" button is NOT required for players; the facilitator controls timing and manually advances to Scenario Display.

---

### FR-06 — Scenario Display Page

**Purpose:** Facilitator presents a scenario to all players.

**Content shown to all:**

- Scenario Title
- Scenario Description
- Challenge Summary
- Stakeholder Positions table (all roles and their recommended position)
- Options A, B, C: Label, Description, Advantages, Risks

**AC:**

- [ ] All players and facilitator see the same scenario content simultaneously upon `game:scenario_opened`.
- [ ] Indicator changes per option are **NOT** shown at this stage (revealed only on Outcome page).
- [ ] Facilitator has a "Start Discussion" button with a timer selector (default 7 minutes; adjustable 1–10 min in 1-min increments).
- [ ] Scenario index (1 of 3, 2 of 3, 3 of 3) is shown.

---

### FR-07 — Discussion Timer Page

**Purpose:** All participants see a countdown timer during face-to-face discussion.

**AC:**

- [ ] Timer counts down in real-time, synchronized across all clients (server-driven via `game:timer_update` every second).
- [ ] Timer displayed prominently (MM:SS format).
- [ ] Timer uses color changes as warning: green → yellow (≤2 min) → red (≤30 sec).
- [ ] When timer reaches 00:00, server emits `game:voting_opened` automatically and transitions to Voting phase.
- [ ] Facilitator can click "End Discussion Early" at any time, which also triggers voting phase.

---

### FR-08 — Voting Page

**Purpose:** Players privately cast their vote (A, B, or C).

**Player View:**

- Three buttons: Option A, Option B, Option C (label only — no indicator changes shown).
- After voting: "Your vote has been submitted. Waiting for others..."
- Real-time counter: "X of Y players have voted" (no names or choices shown).

**Facilitator View:**

- "X of Y players have voted" counter (real-time).
- "Close Voting" button (to force-close before all votes are in, if needed).

**AC:**

- [ ] Each player can vote exactly once per scenario (enforced server-side).
- [ ] Votes are hidden from all other players and facilitator until Mayor Decision phase.
- [ ] Mayor sees the same voting UI as other players — does NOT see results yet.
- [ ] When all players have voted, server automatically emits `game:voting_closed` and `mayor:vote_summary` (to Mayor only) and `facilitator:vote_summary` (to facilitator only).
- [ ] Voting is locked after submission (no re-votes).
- [ ] A player who disconnects and reconnects during voting can still cast their vote if voting is still open.

---

### FR-09 — Mayor Decision Page

**Purpose:** Mayor makes the final policy decision.

**Mayor's View:**

- Anonymous vote summary: "A: 3 votes | B: 2 votes | C: 1 vote"
- Tie detection: If two or more options share the highest vote count, show: "There is a tie between [Option X] and [Option Y]. You may choose any of the tied options."
- Decision options:
  - **Accept Majority** button (or, on tie, **Choose [Option X]** buttons for each tied option).
  - **Use Veto** — reveals a justification text field (required, 1–2 sentence limit). Mayor picks their preferred option and submits.

**All Other Players' View:**

- "Waiting for the Mayor to make a decision..."

**Facilitator's View:**

- Vote summary (same as Mayor) for oversight.
- Status indicator showing Mayor is deciding.

**AC:**

- [ ] Only the Mayor can submit a decision. Other players' inputs are disabled.
- [ ] Veto justification is mandatory if veto is used. Submit button disabled if field is empty.
- [ ] Veto justification character limit: 300 characters.
- [ ] On Mayor decision, server emits `game:mayor_decided` to all clients.
- [ ] Veto decision and justification are saved to `game_states` table.

---

### FR-10 — Outcome Reveal Page

**Purpose:** Show the result of the Mayor's decision and updated city indicators.

**Content:**

- Final chosen option (A, B, or C) — with label.
- If veto: display "Mayor used Veto. Reason: [justification]"
- Indicator change table (e.g., Economic Growth +12, Environmental Quality −20).
- Updated indicator values (after applying changes, clamped).
- Advantages and Risks text for the chosen option.

**AC:**

- [ ] Server applies indicator changes to `game_states` immediately upon Mayor's decision being received (not on client-side).
- [ ] All indicator values are clamped between 0 and 100 server-side before saving.
- [ ] Indicator changes animate visually (e.g., count-up/count-down animation with color coding: green for positive, red for negative).
- [ ] Facilitator can click "Next Scenario" (if scenario_index < 2) or "End Game" (if scenario_index == 2).

---

### FR-11 — City Dashboard Page

**Purpose:** Persistent visual tracker of all 6 city indicators.

**Display:**

- 6 indicator bars (0–100 scale) with current values.
- Indicator names: Economic Growth, Government Budget, People Welfare, Public Trust, Environmental Quality, Transparency.

**AC:**

- [ ] City Dashboard is accessible as a persistent sidebar or overlay throughout the game (from Scenario Display onwards), not a separate screen.
- [ ] Alternatively: shown as a dedicated screen after each Outcome Reveal before proceeding to the next scenario.
- [ ] Values update in real-time after each Outcome Reveal.
- [ ] All 6 indicators start at 50.

---

### FR-12 — Final Reflection Page

**Purpose:** End-of-game summary and educational wrap-up.

**Content:**

- Final values for all 6 indicators.
- Calculated scores: PS, GQS, SS, FPS.
- City Archetype(s) (max 3, shown in priority order).
- Archetype description, strengths, risks, and learning point.
- **"Who Benefited Most"** — list of roles that met their benefit threshold (educational purpose only, see §14.4).
- Educational Reflection quotes from each scenario played.
- Shareable result card (PNG or URL) showing City Archetype, FPS, GQS, SS.

**AC:**

- [ ] City Archetype resolution follows priority order (see §15.5).
- [ ] Max 3 archetypes displayed.
- [ ] "Who Benefited Most" section lists role names, not player names (privacy).
- [ ] Shareable card is a static PNG generated server-side or an in-browser canvas render.
- [ ] Facilitator sees an "Export Results" button that leads to Score Export.

---

### FR-13 — Score Export Page (Facilitator Only)

**Purpose:** Download session results as an Excel file.

**AC:**

- [ ] Accessible only to the facilitator (validated via `facilitator_token`).
- [ ] Triggers download of `.xlsx` file via `GET /api/v1/rooms/:code/export`.
- [ ] File is generated server-side using `exceljs`.
- [ ] File naming: `TPA_Results_[ROOMCODE]_[YYYY-MM-DD].xlsx`
- [ ] Download works in both Online and Offline Mode without internet (Offline Mode reads from local SQLite).
- [ ] Export button is only active after the game has reached `final_reflection` phase.
- [ ] See §16 for full column specification.

---

### FR-14 — Reconnection Flow

**Purpose:** Allow players who disconnect to rejoin without losing progress.

**Trigger:** Player navigates away, closes tab, or loses connection, then returns.

**Flow:**

1. Player goes to Join Room page.
2. Enters the same Room Code and Full Name used originally.
3. Server matches `(session_id, full_name)` and detects existing player record.
4. Server emits `player:state_restored` with current phase, scenario, indicators, and their role.
5. Client redirects to the correct current phase screen.

**AC:**

- [ ] Reconnection works at any game phase.
- [ ] Player's previous vote for the current scenario is preserved (cannot re-vote if already voted).
- [ ] Facilitator's dashboard shows the player as reconnected via `room:player_reconnected` event.
- [ ] If a player reconnects during Mayor Decision phase and they are the Mayor, they see the vote summary.
- [ ] If the session has `status = 'completed'`, reconnection is not allowed (show "Session has ended" message).

---

## 14. Game Content Specification

This section is **binding game-logic content** required for correct system behavior (scoring, role assignment, content display). Treat as data requirements, not narrative flavor.

### 14.1 Roles & Objectives

| Role           | Count (per §14.2) | Objective                                                                                                           |
| :------------- | :---------------: | :------------------------------------------------------------------------------------------------------------------ |
| Mayor          |         1         | Maintain public trust while balancing economic development, social welfare, and sustainable governance.             |
| Journalist     |         1         | Promote transparency by uncovering information; decide whether to support, challenge, or stay neutral on decisions. |
| Community Rep  |        1–2        | Ensure policies address citizens' needs and well-being; can be influenced by other stakeholders.                    |
| Business Rep   |        1–2        | Promote economic growth, business opportunity, and investment stability.                                            |
| Social Welfare |        1–2        | Promote fairness, inclusion, equal access, and protection of vulnerable groups.                                     |
| Environmental  |        1–2        | Protect natural resources and long-term environmental sustainability.                                               |
| Investor       |        1–2        | Maximize economic returns and attract/support growth-stimulating projects.                                          |
| Youth Rep      |        1–2        | Promote youth participation, innovation, and long-term/future-oriented gains.                                       |

### 14.2 Role Distribution Table (by Player Count)

| Players | Mayor | Journalist | Community Rep | Business Rep | Social Welfare | Env. Advocate | Investor | Youth Rep |
| :------ | :---: | :--------: | :-----------: | :----------: | :------------: | :-----------: | :------: | :-------: |
| 8       |   1   |     1      |       1       |      1       |       1        |       1       |    1     |     1     |
| 9       |   1   |     1      |       2       |      1       |       1        |       1       |    1     |     1     |
| 10      |   1   |     1      |       2       |      2       |       1        |       1       |    1     |     1     |
| 11      |   1   |     1      |       2       |      2       |       1        |       1       |    2     |     1     |
| 12      |   1   |     1      |       2       |      2       |       2        |       2       |    1     |     1     |

### 14.3 Secret Information (per role — shown ONLY to that role)

| Role           | Secret Information                                                                                                                                            |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mayor          | A close ally on the city council is privately pressuring you to favor decisions aligned with their business interests. You may comply or resist.              |
| Journalist     | A confidential source claims possible irregularities in project approvals — information that could shift public opinion if revealed.                          |
| Community Rep  | A local community leader has privately promised political support next election in exchange for backing a specific policy.                                    |
| Business Rep   | Your company stands to profit significantly from one particular option. Publicly you advocate economic growth, but privately you favor this specific outcome. |
| Social Welfare | You've received a confidential report that a welfare program may have been misused. You can expose it or stay silent to preserve alliances.                   |
| Environmental  | You possess unreleased data suggesting environmental impacts may be worse than publicly acknowledged.                                                         |
| Investor       | Investors are considering pulling out if major projects face delays; you've been privately told to push for the fastest possible approval.                    |
| Youth Rep      | A media company has offered sponsorship and visibility in exchange for your support of a specific infrastructure policy benefiting their corporate partners.  |

### 14.4 Individual Benefit Thresholds ("Who Benefited Most")

This is an **informational, educational reveal** at session end — it does not affect scoring or gate gameplay.

| Role           | Threshold                                                 |
| :------------- | :-------------------------------------------------------- |
| Mayor          | Public Trust ≥ 70 AND GQS ≥ 60                            |
| Journalist     | Transparency ≥ 70                                         |
| Community Rep  | People Welfare ≥ 70                                       |
| Business Rep   | Economic Growth ≥ 70                                      |
| Social Welfare | People Welfare ≥ 80                                       |
| Environmental  | Environmental Quality ≥ 75                                |
| Investor       | Economic Growth ≥ 75 AND Government Budget ≥ 65           |
| Youth Rep      | Average of (Economic Growth + Environmental Quality) ≥ 70 |

### 14.5 Scenarios

All six indicators (Economic Growth, Government Budget, People Welfare, Public Trust, Environmental Quality, Transparency) **start at 50**. Changes are cumulative across scenarios and **clamped to 0–100** after each one.

---

#### Scenario 1 — New Industrial Zone

A consortium proposes a new industrial zone promising jobs, tax revenue, and investment, against concerns over environmental impact, land acquisition, and transparency.

| Option                              | Econ. Growth | Gov. Budget | People Welfare | Public Trust | Env. Quality | Transparency |
| :---------------------------------- | :----------: | :---------: | :------------: | :----------: | :----------: | :----------: |
| A — Fast-Track Approval             |     +20      |     +15     |       +5       |     -10      |     -20      |     -15      |
| B — Balanced Development Plan       |     +12      |     +8      |      +10       |     +15      |      -5      |     +20      |
| C — Community and Environment First |     -15      |     -10     |       -5       |     +10      |     +20      |     +10      |

_Educational Reflection:_ Sustainable industrialization requires balancing immediate economic gains against long-term environmental and social safeguards to avoid future "governance debt."

---

#### Scenario 2 — Universal Free Education

A proposal to fund free education from primary school through university, weighed against fiscal burden and effects on other public services.

| Option                       | Econ. Growth | Gov. Budget | People Welfare | Public Trust | Env. Quality | Transparency |
| :--------------------------- | :----------: | :---------: | :------------: | :----------: | :----------: | :----------: |
| A — Universal Free Education |      +5      |     -30     |      +20       |     +15      |      0       |      0       |
| B — Targeted Free Education  |      +5      |     -15     |      +10       |     +10      |      0       |      +5      |
| C — Shared-Cost Education    |     +20      |     +10     |      -10       |      -5      |      0       |     -10      |

_Educational Reflection:_ Human capital drives prosperity, but universal access needs a stable fiscal foundation to remain sustainable.

---

#### Scenario 3 — Open Forest for Mining

A mineral deposit beneath a protected forest could be opened for extraction, weighed against deforestation, biodiversity loss, and harm to local communities.

| Option                           | Econ. Growth | Gov. Budget | People Welfare | Public Trust | Env. Quality | Transparency |
| :------------------------------- | :----------: | :---------: | :------------: | :----------: | :----------: | :----------: |
| A — Full Mining Approval         |     +25      |     +20     |       -5       |     -10      |     -30      |      -5      |
| B — Regulated Sustainable Mining |     +15      |     +12     |       +5       |     +10      |     -15      |     +15      |
| C — Protect the Forest           |     -15      |     -15     |       0        |     +10      |     +25      |     +10      |

_Educational Reflection:_ Resource extraction offers quick revenue but carries permanent ecological risk; leadership means weighing finite wealth against the heritage of future generations.

> _Note: Scenarios 4–10 are a post-launch addition and can be authored later using this same template (see §22)._

### 14.6 Outcome Formulas

- **PS** (Prosperity Score) = (Economic Growth + Government Budget + People Welfare) / 3
- **GQS** (Governance Quality Score) = (Public Trust + Transparency) / 2
- **SS** (Sustainability Score) = Environmental Quality
- **FPS** (Final Prosperity Score) = PS × Governance Modifier, clamped 0–100

**Governance Modifier (by GQS):**

| GQS Range | Modifier |
| :-------: | :------: |
|  80–100   |  ×1.05   |
|   60–79   |  ×1.02   |
|   40–59   |  ×1.00   |
|   20–39   |  ×0.98   |
|   0–19    |  ×0.95   |

### 14.7 City Archetypes

Display **up to 3 archetypes** at session end, in priority order: (1) Balanced Prosperity, (2) Crisis/nuanced types, (3) general success types. See §15.5 for the resolution algorithm.

Each archetype has an associated description, strengths, risks, and learning point that must display alongside the result (content as defined in the source GDD — provided separately to the content/UX team).

| Archetype                                                | Requirements                      |
| :------------------------------------------------------- | :-------------------------------- |
| Balanced Prosperity City                                 | FPS ≥ 65 AND GQS ≥ 70 AND SS ≥ 70 |
| Economic Powerhouse                                      | FPS ≥ 75                          |
| Welfare-Oriented City                                    | People Welfare ≥ 80               |
| Green & Sustainable City                                 | SS ≥ 80                           |
| Good Governance City                                     | GQS ≥ 80                          |
| Prosperous but Vulnerable City                           | FPS ≥ 75 AND GQS < 40             |
| Environmentally Protected but Economically Stagnant City | SS ≥ 80 AND FPS < 50              |
| Governance Crisis City                                   | FPS < 40 OR GQS < 30 OR SS < 30   |

---

## 15. Business Logic

### 15.1 Role Assignment Algorithm

```javascript
function assignRoles(players, playerCount) {
  const distribution = ROLE_DISTRIBUTION[playerCount];
  const rolePool = [];

  for (const [role, count] of Object.entries(distribution)) {
    for (let i = 0; i < count; i++) rolePool.push(role);
  }

  // Fisher-Yates shuffle
  for (let i = rolePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rolePool[i], rolePool[j]] = [rolePool[j], rolePool[i]];
  }

  return players.map((player, i) => ({ ...player, role: rolePool[i] }));
}
```

### 15.2 Voting & Tie-Breaking Logic

```javascript
function resolveVotes(votes) {
  const tally = { A: 0, B: 0, C: 0 };
  for (const vote of votes) tally[vote.choice]++;

  const maxVotes = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter((k) => tally[k] === maxVotes);

  return {
    tally,
    is_tie: winners.length > 1,
    majority: winners.length === 1 ? winners[0] : null,
    tied_options: winners.length > 1 ? winners : [],
  };
}
// If is_tie === true, Mayor must choose among tied_options freely.
// Mayor can also veto regardless of tie or majority.
```

### 15.3 Indicator Calculation

```javascript
function applyIndicatorChanges(currentState, scenarioIndex, choice) {
  const changes = SCENARIOS[scenarioIndex].options[choice].indicators;
  const updated = { ...currentState };

  for (const [key, delta] of Object.entries(changes)) {
    updated[key] = Math.min(100, Math.max(0, updated[key] + delta)); // clamp
  }
  return updated;
}
```

### 15.4 Score Formulas

```javascript
function calcPS(s) {
  return (s.economic_growth + s.government_budget + s.people_welfare) / 3;
}
function calcGQS(s) {
  return (s.public_trust + s.transparency) / 2;
}
function calcSS(s) {
  return s.environmental_quality;
}

function calcFPS(s) {
  const ps = calcPS(s);
  const gqs = calcGQS(s);
  const modifier =
    gqs >= 80
      ? 1.05
      : gqs >= 60
        ? 1.02
        : gqs >= 40
          ? 1.0
          : gqs >= 20
            ? 0.98
            : 0.95;
  return Math.min(100, Math.max(0, ps * modifier)); // clamp
}
```

### 15.5 Archetype Resolution

```javascript
function resolveArchetypes(s) {
  const fps = calcFPS(s),
    gqs = calcGQS(s),
    ss = calcSS(s);

  const candidates = [];

  // Priority 1 — Balanced Prosperity
  if (fps >= 65 && gqs >= 70 && ss >= 70)
    candidates.push({ priority: 1, name: "Balanced Prosperity City" });

  // Priority 2 — Crisis / Nuanced
  if (fps < 40 || gqs < 30 || ss < 30)
    candidates.push({ priority: 2, name: "Governance Crisis City" });
  if (fps >= 75 && gqs < 40)
    candidates.push({ priority: 2, name: "Prosperous but Vulnerable City" });

  // Priority 3 — Success types
  if (fps >= 75) candidates.push({ priority: 3, name: "Economic Powerhouse" });
  if (s.people_welfare >= 80)
    candidates.push({ priority: 3, name: "Welfare-Oriented City" });
  if (ss >= 80)
    candidates.push({ priority: 3, name: "Green & Sustainable City" });
  if (gqs >= 80) candidates.push({ priority: 3, name: "Good Governance City" });
  if (ss >= 80 && fps < 50)
    candidates.push({
      priority: 3,
      name: "Environmentally Protected but Economically Stagnant City",
    });

  // Sort by priority, deduplicate, cap at 3
  return candidates
    .sort((a, b) => a.priority - b.priority)
    .map((c) => c.name)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);
}
```

### 15.6 Benefit Threshold Check

```javascript
function resolveBeneficiaries(s, players) {
  return players
    .filter((p) => BENEFIT_THRESHOLDS[p.role]?.(s))
    .map((p) => p.role);
}
// Returns unique role names (not player names) that met their threshold.
```

---

## 16. Score Export Specification

Generated by `exceljs` on the server. One sheet named `"Session Results"`.

### File Details

| Field       | Value                                                      |
| :---------- | :--------------------------------------------------------- |
| Format      | `.xlsx` (Excel 2007+)                                      |
| Filename    | `TPA_Results_[ROOMCODE]_[YYYY-MM-DD].xlsx`                 |
| Sheet name  | `Session Results`                                          |
| Header row  | Row 1, bold, background fill: `#1F4E79`, font color: white |
| Data row    | Row 2 onwards                                              |
| Date format | `YYYY-MM-DD`                                               |

### Column Specification

| #   | Column Name                    | Data Type              | Source                                   |
| :-- | :----------------------------- | :--------------------- | :--------------------------------------- |
| 1   | Session ID                     | UUID string            | `sessions.id`                            |
| 2   | Room Code                      | String                 | `sessions.room_code`                     |
| 3   | Date                           | Date                   | `sessions.started_at` (date only)        |
| 4   | Start Time (UTC)               | Time string            | `sessions.started_at`                    |
| 5   | End Time (UTC)                 | Time string            | `sessions.ended_at`                      |
| 6   | Total Players                  | Integer                | COUNT of `players`                       |
| 7   | Scenario 1 Choice              | A / B / C              | `game_states.scenario_0_choice`          |
| 8   | Scenario 2 Choice              | A / B / C              | `game_states.scenario_1_choice`          |
| 9   | Scenario 3 Choice              | A / B / C              | `game_states.scenario_2_choice`          |
| 10  | Mayor Veto Used (S1)           | Yes / No               | `game_states.scenario_0_veto`            |
| 11  | Mayor Veto Reason (S1)         | String                 | `game_states.scenario_0_veto_reason`     |
| 12  | Mayor Veto Used (S2)           | Yes / No               | `game_states.scenario_1_veto`            |
| 13  | Mayor Veto Reason (S2)         | String                 | `game_states.scenario_1_veto_reason`     |
| 14  | Mayor Veto Used (S3)           | Yes / No               | `game_states.scenario_2_veto`            |
| 15  | Mayor Veto Reason (S3)         | String                 | `game_states.scenario_2_veto_reason`     |
| 16  | Economic Growth (Final)        | Integer 0–100          | `game_states.economic_growth`            |
| 17  | Government Budget (Final)      | Integer 0–100          | `game_states.government_budget`          |
| 18  | People Welfare (Final)         | Integer 0–100          | `game_states.people_welfare`             |
| 19  | Public Trust (Final)           | Integer 0–100          | `game_states.public_trust`               |
| 20  | Environmental Quality (Final)  | Integer 0–100          | `game_states.environmental_quality`      |
| 21  | Transparency (Final)           | Integer 0–100          | `game_states.transparency`               |
| 22  | PS (Prosperity Score)          | Decimal (2dp)          | `game_states.ps`                         |
| 23  | GQS (Governance Quality Score) | Decimal (2dp)          | `game_states.gqs`                        |
| 24  | SS (Sustainability Score)      | Decimal (2dp)          | `game_states.ss`                         |
| 25  | FPS (Final Prosperity Score)   | Decimal (2dp)          | `game_states.fps`                        |
| 26  | City Archetype(s)              | String (comma-sep)     | `game_states.archetypes` joined          |
| 27  | Role Beneficiaries             | String (comma-sep)     | `game_states.beneficiaries` joined       |
| 28  | Players & Roles                | String (semicolon-sep) | e.g. `"John Doe:Mayor; Jane:Journalist"` |

### exceljs Implementation Sketch

```javascript
import ExcelJS from 'exceljs';

async function generateExport(sessionId) {
  const session = await db.sessions.findUnique({ where: { id: sessionId },
    include: { players: true, game_state: true }
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Session Results');

  // Header row
  const headers = ["Session ID", "Room Code", "Date", ...]; // all 28 columns
  ws.addRow(headers);
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };

  // Data row
  const gs = session.game_state;
  ws.addRow([
    session.id,
    session.room_code,
    formatDate(session.started_at),
    // ... all 28 values
  ]);

  // Auto-fit columns
  ws.columns.forEach(col => { col.width = Math.max(col.header?.length ?? 10, 14); });

  return wb.xlsx.writeBuffer();
}
```

---

## 17. Offline Mode Requirements

### 17.1 What Offline Mode Is

Offline Mode allows the game to run entirely on the **facilitator's local machine** without internet. Players connect to the facilitator's device via a shared local WiFi network or mobile hotspot.

### 17.2 Packaging

The offline version must be packaged as a **Docker Compose** bundle.

```yaml
# docker-compose.offline.yml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      OFFLINE_MODE: "true"
      DATABASE_URL: "file:/data/tpa.db"
    volumes:
      - db_data:/data

volumes:
  db_data:
```

### 17.3 Facilitator Startup Steps (Documented in README)

```
1. Install Docker Desktop.
2. Download the offline package (ZIP).
3. Unzip and run: docker compose -f docker-compose.offline.yml up
4. Open browser: http://localhost:3000
5. Share local IP with players: e.g. http://192.168.1.x:3000
   (Find your IP: Windows: ipconfig | Mac/Linux: ifconfig)
```

### 17.4 Player Access in Offline Mode

- Facilitator shares local IP address and port verbally or on screen.
- Players type `http://192.168.x.x:3000` in their mobile browser.
- No internet required. Game plays identically to Online Mode.

### 17.5 Score Export in Offline Mode

- Export endpoint `GET /api/v1/rooms/:code/export` reads from local SQLite.
- Downloaded to facilitator's browser as `.xlsx`.
- No internet access needed at export time.

### 17.6 Feature Parity Checklist

| Feature                        | Online |       Offline       |
| :----------------------------- | :----: | :-----------------: |
| Real-time Socket.io events     |   ✅   |         ✅          |
| Room creation & joining        |   ✅   |         ✅          |
| Role assignment                |   ✅   |         ✅          |
| Voting & Mayor Decision        |   ✅   |         ✅          |
| Score calculation & Archetypes |   ✅   |         ✅          |
| Reconnection flow              |   ✅   |         ✅          |
| Score export (.xlsx)           |   ✅   |         ✅          |
| Shareable result card          |   ✅   | ✅ (local URL only) |

---

## 18. Non-Functional Requirements

### Performance

- Socket.io event round-trip < 300ms on local WiFi (Offline Mode).
- Page initial load < 3 seconds on a 4G connection (Online Mode).
- Support minimum 5 concurrent rooms (50–60 simultaneous WebSocket connections) on Online Mode.
- Export generation < 5 seconds per session.
- Must comfortably support real-time interaction for 8–12 concurrent players plus 1 facilitator per session, with multiple sessions running in parallel (both modes).

### Browser Support

- Chrome 100+, Safari 15+, Firefox 100+, Edge 100+.
- Mobile: iOS Safari 15+, Android Chrome 100+.

### Responsive Design

- Facilitator view optimized for: laptop/tablet (768px+).
- Player view optimized for: mobile (375px+).
- No horizontal scroll at any target breakpoint.

### Localization

- Primary language: English.
- Architecture must support adding Bahasa Indonesia and/or Thai translations without structural rework (translation scope to be confirmed — see §22).

### Security

- `facilitator_token` is a cryptographically random 64-char hex string (`crypto.randomBytes(32).toString('hex')`).
- `facilitator_token` is never sent in URLs — always in headers or localStorage.
- Room Code is 7 characters — collision handled by server uniqueness check with retry.
- No user data stored beyond session lifetime. Expired sessions can be purged after 24 hours.
- Socket.io rooms are isolated — no cross-room event leakage.

### Privacy / Data Minimization

- No accounts, login, or email collection; only Full Name and Country are captured from players.
- No cross-session data leakage between concurrently running Room Codes/sessions.

### Reliability

- If facilitator disconnects, session state is preserved in DB. Facilitator can rejoin via the same `facilitator_token` from localStorage.
- Server must reject duplicate `player:join` events for the same `full_name` in the same session.
- Offline Mode must run fully without internet, including data persistence and spreadsheet export, on hardware no more advanced than a typical facilitator laptop.

### Accessibility

- Minimum contrast ratio: 4.5:1 (WCAG AA) for all text elements.
- All interactive elements keyboard-navigable.
- Timer screen readable on small screens (min font size 32px for countdown).

---

## 19. Acceptance Criteria (Definition of Done)

- [ ] A facilitator can complete an entire session end-to-end (create room → role assignment → 3 scenarios → dashboard → reflection → export) in both Online and Offline mode, with identical player-facing behavior.
- [ ] All six indicators and FPS remain within 0–100 at every point in the session, including after Mayor veto/tie-break paths.
- [ ] A disconnected player can rejoin with Room Code + Full Name and resume correctly at the current game phase.
- [ ] Exported `.xlsx` file contains all required columns (§16) with correct, calculated values matching the session's actual choices and final indicators.
- [ ] Two or more sessions (Room Codes) can run at the same time, in mixed Online/Offline mode, with no visible cross-contamination of data or state.
- [ ] UI is usable on a mobile phone screen (375px+) for all required player-facing screens.
- [ ] Facilitator can run a full session without paper materials.
- [ ] Score export download works in both Online and Offline mode without requiring internet access at the moment of export.

---

## 20. Deliverables

- Complete source code (repository) + live URL (Online Mode)
- Mobile-responsive build for all required screens
- README covering both Online Mode and Offline/Local Mode setup
- Facilitator Guide (one-page, in-app or PDF): session management, launching Offline Mode, exporting results
- Docker Compose offline package (ZIP)
- Bug-fixing period: maximum **14 days** after delivery

---

## 21. Development Milestones

| Milestone                   | Scope                                                                                             | Target     |
| :-------------------------- | :------------------------------------------------------------------------------------------------ | :--------- |
| **M1 — Foundation**         | Project scaffold, DB schema, Socket.io connection, room create/join, lobby real-time sync         | W4 June    |
| **M2 — Core Game Loop**     | Role assignment, Scenario display, Discussion timer, Voting, Mayor Decision, Outcome Reveal       | W1 July    |
| **M3 — Scoring & End Game** | Indicator calculation, Score formulas, Archetype resolution, Benefit thresholds, Final Reflection | W1–W2 July |
| **M4 — Export & Offline**   | Score export (.xlsx), Docker packaging, Offline Mode README, Reconnection flow                    | W2 July    |
| **M5 — Polish & QA**        | UI responsive pass, Shareable card, Edge case handling, Bug fixes, Facilitator Guide              | W3 July    |
| **Launch**                  | Live URL + Offline package delivered                                                              | W3 July    |
| **Bug Fix Window**          | Post-launch fixes                                                                                 | +14 days   |

### Suggested Development Order

```
1.  DB schema + Prisma migrations
2.  REST: POST /rooms + GET /rooms/:code
3.  Socket.io: join, lobby sync
4.  Role assignment engine
5.  Game phase state machine (server-side)
6.  Per-phase Socket.io events (client + server)
7.  Voting + Mayor Decision logic
8.  Indicator calculation + score formulas
9.  Archetype resolver
10. Final Reflection screen
11. Score export (exceljs)
12. Reconnection handler
13. Offline Docker packaging
14. UI responsive pass
15. Shareable result card
16. README (both modes)
```

---

## 22. Risks & Open Questions

| #   | Item                                                                                                                                                                                                                          | Status                | Owner  |
| :-- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------- | :----- |
| 1   | **Translation scope unconfirmed** — Bahasa Indonesia and/or Thai are listed as "if possible." Needs a firm yes/no and owner before First Draft to avoid late rework.                                                          | **Decide before M1**  | Client |
| 2   | **Offline Mode technical risk** — Packaging a bundled database (SQLite) plus app server into a one-step runnable for non-technical facilitators may need early spike/prototyping to validate feasibility within the timeline. | **Spike in M1**       | Dev    |
| 3   | **Frontend framework** — React vs Vue both acceptable; React recommended for ecosystem size.                                                                                                                                  | **Decide before M1**  | Dev    |
| 4   | **Online hosting provider** — Railway, Render, Fly.io, or VPS.                                                                                                                                                                | **Decide before M4**  | Client |
| 5   | **Domain / URL for Online Mode**                                                                                                                                                                                              | **Decide before M5**  | Client |
| 6   | **Concurrent load in Online Mode** is not yet quantified (how many simultaneous rooms/players the cloud server must support) — recommend defining a target before infrastructure sizing.                                      | **Decide before M4**  | Client |
| 7   | **Shareable card** — canvas-based (client-side) or server-side render (Puppeteer/Sharp)?                                                                                                                                      | **Decide at M3**      | Dev    |
| 8   | **CSV export** is explicitly a nice-to-have — confirm whether it's needed for launch or can be deferred.                                                                                                                      | **Confirm before M4** | Client |
| 9   | **Scenarios 4–10** — Content template provided in GDD. Integration deferred post-launch. Authors using §14.5 as template.                                                                                                     | Post-launch           | Client |
| 10  | **Timer persistence** — Does facilitator-set discussion duration persist if facilitator disconnects? Assumed yes (stored in DB at start of discussion phase).                                                                 | **Assumption**        | Dev    |
| 11  | **Mayor disconnect during Mayor Decision phase** — Session waits. Facilitator can kick and re-assign Mayor?                                                                                                                   | **Clarify**           | Client |
| 12  | **Multiple facilitators** in the same room: NOT supported. One `facilitator_token` per `room_code`.                                                                                                                           | **Assumption**        | Dev    |

---

## 23. Development Gaps & Audit Notes (July 2026 Audit)

During the codebase audit on July 6, 2026, the following discrepancies and gaps between the codebase implementation and the PRD specifications were identified for future resolution:

### 23.1 Minimum Player Count Discrepancy (FR-04)

- **PRD Specification:** Game start button is active only when 8 <= player count <= 12, with a warning if the count is < 8.
- **Current Code Status:** The codebase has `minPlayers = 2` in frontend ([LobbyView.tsx](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/LobbyView.tsx)) and allows 2-12 players on the server-side socket handler ([socketHandler.ts](file:///g:/CODE/NEW%202026/code-dev2/code-dev/server/src/socketHandler.ts)). This fallback configuration must be restored to 8-12 for production.

### 23.2 Active Session Warn on Create Room (FR-02)

- **PRD Specification:** Warn the facilitator "You already have an active session" if a `facilitator_token` already exists in `localStorage` for the same room, with options to continue or start fresh.
- **Current Code Status:** The [CreateRoomView.tsx](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/CreateRoomView.tsx) directly creates a new room and overwrites the cached token without validating existing sessions.

### 23.3 Discussion Timer Color Warnings (FR-07)

- **PRD Specification:** Discussion countdown timer should change color dynamically: Green -> Yellow (<= 2 minutes) -> Red (<= 30 seconds).
- **Current Code Status:** The timer in [DiscussionView.tsx](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/DiscussionView.tsx) is statically colored using `text-neutral-600` and lacks visual warning states.

### 23.4 Vote State Recovery in Reconnection Flow (FR-14 & FR-08)

- **PRD Specification:** A player's previous vote for the current scenario must be preserved upon reconnection (no re-voting allowed).
- **Current Code Status:** The `player:reconnect` socket handler in [socketHandler.ts](file:///g:/CODE/NEW%202026/code-dev2/code-dev/server/src/socketHandler.ts) does not query or include the player's current scenario vote in the `player:state_restored` payload. Consequently, reconnecting players are presented with active voting buttons again, enabling them to re-vote or overwrite their previous choice.

### 23.5 Indicator Value Change Animation & Styling (FR-10)

- **PRD Specification:** Indicator values in the outcome reveal phase should animate (count-up/count-down) and apply color coding: green for positive changes and red for negative changes.
- **Current Code Status:** In [OutcomeRevealView.tsx](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/OutcomeRevealView.tsx), the final indicator values are static and hardcoded to red (`text-red-500`) regardless of the actual value or delta direction.

### 23.6 Localization of Reflection Quotes (FR-12 & FR-18)

- **PRD Specification:** Multilingual support for English and Bahasa Indonesia.
- **Current Code Status:** The primary reflections in [ReflectionView.tsx](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/ReflectionView.tsx) are hardcoded as English strings in a static array instead of loading translations or retrieving them from the scenario object.

### 23.7 Auto-Purge of Expired Sessions (FR-18)

- **PRD Specification:** Expired sessions should be purged from the database after 24 hours.
- **Current Code Status:** No scheduler or cleanup routine exists on the backend to execute database purges.

---

## 24. Post-M2 Stakeholder Feedback (July 2026)

Feedback berikut diterima dari klien/stakeholder setelah selesainya Milestone 2 (Core Game Loop). Seluruh poin di bawah ini wajib ditindaklanjuti sebelum Milestone 3.

**Tanggal Feedback:** Juli 2026
**Sumber:** Stakeholder Review — Post-M2

---

### 24.1 Konsistensi Penamaan / Terminologi (UI/UX)

- **Feedback:** Gunakan istilah yang konsisten sesuai proposal, baik dalam Bahasa Indonesia maupun Bahasa Inggris. Jangan menggunakan istilah seperti *"City Governance"* apabila nama resmi yang digunakan dalam proposal adalah **"The People's Assembly Game"**.
- **Action Required:** Audit seluruh teks di UI (label tombol, judul halaman, header, notifikasi) dan pastikan nama produk yang tampil selalu menggunakan **"The People's Assembly"** atau singkatan resminya. Hapus semua penggunaan nama alternatif yang tidak sesuai proposal.
- **Priority:** High

---

### 24.2 Pilihan Bahasa (Language Selection)

- **Feedback:** Pilihan bahasa sebaiknya hanya mencakup **Bahasa Indonesia, Bahasa Inggris, dan Bahasa Thailand** sesuai proposal. Jika menampilkan nama negara, pastikan menggunakan nama resmi/formal agar konsisten dan akurat.
- **Action Required:**
  - Batasi opsi bahasa hanya pada 3 bahasa resmi: `en` (English), `id` (Bahasa Indonesia), `th` (Thai/ภาษาไทย).
  - Hapus bahasa lain yang mungkin muncul di language selector.
  - Untuk dropdown Country, gunakan nama negara resmi/formal (contoh: "Timor-Leste" bukan "East Timor", "Türkiye" bukan "Turkey").
- **Priority:** High

---

### 24.3 Visual Identity & Font Size (UI/UX)

- **Feedback:** Ukuran font saat ini terlalu besar dan tampilan keseluruhan masih sangat menyerupai Duolingo. Mohon dibuat lebih berbeda agar memiliki **identitas visual sendiri**. Selain itu, gunakan **color palette yang telah diberikan** agar branding lebih konsisten.
- **Action Required:**
  - Review dan perkecil ukuran font di seluruh halaman player agar proporsional dan tidak mendominasi layar.
  - Rancang ulang visual identity agar tidak menyerupai Duolingo — pertimbangkan layout yang lebih formal/governmental, tone warna yang lebih serius.
  - Implementasikan color palette resmi yang sudah diberikan oleh klien ke seluruh komponen (tombol, background, header, indikator).
  - Pastikan perubahan diterapkan konsisten di semua screen (Lobby, Role Reveal, Voting, Outcome Reveal, dll.).
- **Priority:** High

---

### 24.4 Halaman Penjelasan per Case / Scenario dengan Visual (FR-06)

- **Feedback:** Belum terdapat halaman yang menjelaskan setiap *case* beserta visualnya. Sebelumnya sudah diminta agar setiap scenario/case memiliki **halaman penjelasan dengan ilustrasi atau visual yang sesuai**.
- **Action Required:**
  - Tambahkan ilustrasi atau visual (gambar/ikon/infografis) yang relevan di setiap halaman Scenario Display (FR-06) untuk masing-masing skenario (Scenario 1: New Industrial Zone, Scenario 2: Universal Free Education, Scenario 3: Open Forest for Mining).
  - Setiap halaman penjelasan case harus memuat minimal satu aset visual yang mendukung konteks skenario.
  - Koordinasikan dengan tim konten/desain untuk penyediaan aset visual per skenario.
- **Priority:** Medium–High

---

### 24.5 Archetype Result Page — Tidak Boleh Kosong (FR-12)

- **Feedback:** Pada halaman *Archetype Result*, yang ditampilkan saat ini hanya placeholder. Pengguna harus **selalu mendapatkan minimal satu hasil archetype** — halaman hasil tidak boleh kosong atau hanya menampilkan contoh.
- **Action Required:**
  - Pastikan fungsi `resolveArchetypes()` (§15.5) selalu me-return minimal 1 archetype. Jika tidak ada archetype yang memenuhi threshold, tambahkan fallback archetype (contoh: `"Developing City"` sebagai default catch-all).
  - Pastikan data archetype dari server benar-benar dikirim dan di-render di `FinalReflectionView` / halaman Archetype Result — bukan placeholder/dummy data.
  - Lakukan end-to-end test untuk memverifikasi archetype selalu muncul di berbagai kombinasi pilihan scenario (termasuk edge case semua indikator rendah).
- **Priority:** High

---

### 24.6 Ringkasan Action Items Post-M2

| # | Item | Priority | Target Milestone |
|:--|:-----|:--------:|:----------------:|
| 1 | Konsistensi nama produk ("The People's Assembly") di seluruh UI | High | M3 |
| 2 | Batasi language selector: EN / ID / TH saja; gunakan nama negara formal | High | M3 |
| 3 | Redesign visual identity; perkecil font; terapkan color palette resmi klien | High | M3 |
| 4 | Tambah halaman/visual per scenario di Scenario Display | Medium-High | M3–M4 |
| 5 | Archetype Result selalu tampil minimal 1 hasil; hapus placeholder | High | M3 |

---

## 25. Audit Kode — Temuan & Rencana Perbaikan (Per Item Feedback §24)

Audit kode menyeluruh dilakukan pada seluruh file di `client/src/` dan `server/src/` untuk memetakan lokasi eksak masalah dari setiap item feedback §24. Berikut hasil lengkapnya:

---

### 25.1 Audit Item 24.1 — Konsistensi Nama Produk

**Lokasi masalah yang ditemukan:**

| File | Baris | Isi Bermasalah | Perbaikan |
|:-----|:-----:|:---------------|:----------|
| [`LandingView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/LandingView.tsx) | 31 | `"Civic Education Simulation"` (label badge atas) | Ganti ke `"Governance Workshop Simulation"` sesuai i18n key `landing.badge` |
| [`LandingView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/LandingView.tsx) | 40 | `alt="City governance simulation"` (alt text gambar) | Ganti ke `alt="The People's Assembly"` |
| [`LandingView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/LandingView.tsx) | 46 | Subtitle hardcoded: `"A city governance simulation. Discuss, vote, and see the impact on your city."` | Ganti menggunakan i18n key `landing.subtitle` yang sudah benar |

**Catatan:** File `i18n.ts` dan `ReflectionView.tsx` sudah menggunakan nama resmi `"The People's Assembly"` dengan benar. Hanya `LandingView.tsx` yang bermasalah.

---

### 25.2 Audit Item 24.2 — Language Selector hanya EN / ID / TH

**Lokasi masalah yang ditemukan:**

| File | Baris | Isu |
|:-----|:-----:|:----|
| [`i18n.ts`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/i18n.ts) | 3 | `type Language = 'en' \| 'id' \| 'th' \| 'ph' \| 'vi' \| 'my'` — terdapat 3 kode bahasa tidak resmi |
| [`i18n.ts`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/i18n.ts) | 131–145 | Blok terjemahan untuk `ph` (Filipino), `vi` (Vietnam), `my` (Myanmar) masih ada |
| [`LanguageSelectView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/LanguageSelectView.tsx) | 19–26 | Array `languages` masih memuat entri `ph` (Filiphine), `vi` (Vietnam), `my` (Myanmar) |

**Perbaikan yang diperlukan:**
- Hapus `'ph' | 'vi' | 'my'` dari type `Language` di `i18n.ts`
- Hapus blok terjemahan `ph`, `vi`, `my` dari objek `translations`
- Hapus 3 entri dari array `languages` di `LanguageSelectView.tsx`, pertahankan hanya `id`, `en`, `th`

---

### 25.3 Audit Item 24.3 — Font Terlalu Besar & Visual Identity

**Lokasi masalah yang ditemukan:**

| File | Baris | Isu |
|:-----|:-----:|:----|
| [`DiscussionView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/DiscussionView.tsx) | 90 | Timer countdown menggunakan `text-7xl sm:text-8xl` — terlalu dominan |
| [`VotingView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/VotingView.tsx) | 93 | Vote counter menggunakan `text-7xl sm:text-8xl` |
| Seluruh komponen | — | Font keluarga `font-['Nunito']` digunakan di semua halaman — terlalu menyerupai Duolingo |
| Seluruh komponen | — | Pola tombol `shadow-[0px_4px_0px_0px_...]` + warna `lime-600` = identik gaya Duolingo |

**Perbaikan yang diperlukan:**
- Kurangi ukuran timer: `text-7xl sm:text-8xl` → `text-5xl sm:text-6xl`
- Ganti font primer dari `Nunito` ke `Inter` (lebih formal/governmental)
- Ganti color primer dari `lime-600` ke color palette resmi klien _(menunggu konfirmasi hex code dari klien)_
- Redesign pola tombol: kurangi shadow 3D menjadi flat/subtle

> **Open Question:** Color palette resmi yang disebutkan klien belum dilampirkan ke tim dev. Diperlukan sebelum mengimplementasikan perubahan warna.

---

### 25.4 Audit Item 24.4 — Visual/Ilustrasi per Scenario

**Lokasi masalah yang ditemukan:**

| File | Baris | Isu |
|:-----|:-----:|:----|
| [`ScenarioView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/ScenarioView.tsx) | — | Tidak ada elemen `<img>` atau ilustrasi di halaman Scenario Display |

**Perbaikan yang diperlukan:**
- Generate 3 aset ilustrasi (satu per skenario): New Industrial Zone, Universal Free Education, Open Forest for Mining
- Tambahkan logika di `ScenarioView.tsx` untuk menampilkan ilustrasi sesuai `scenarioIndex` (0, 1, 2)
- Simpan aset di `client/src/assets/` dengan nama: `scenario_1_industrial.png`, `scenario_2_education.png`, `scenario_3_forest.png`

---

### 25.5 Audit Item 24.5 — Archetype Result Tidak Boleh Kosong

**Lokasi masalah yang ditemukan:**

| File | Baris | Isu |
|:-----|:-----:|:----|
| [`server/src/gameEngine.ts`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/server/src/gameEngine.ts) | 114–159 | Fungsi `resolveArchetypes()` dapat mengembalikan array kosong `[]` jika tidak ada threshold yang terpenuhi — tidak ada fallback |
| [`ReflectionView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/ReflectionView.tsx) | 342 | Sudah ada fallback teks `'No Archetype Resolved'` tetapi seharusnya fallback ke archetype nyata, bukan pesan error |
| [`ReflectionView.tsx`](file:///g:/CODE/NEW%202026/code-dev2/code-dev/client/src/components/ReflectionView.tsx) | 382 | Guard `{archetypes.length > 0 && (...)}` menyebabkan seluruh blok Detailed City Profile hilang jika array kosong |

**Perbaikan yang diperlukan:**
- Di `gameEngine.ts`: tambahkan fallback di akhir `resolveArchetypes()` — jika `candidates` kosong, push `{ priority: 99, name: "Developing City" }`
- Tambahkan entri `"Developing City"` ke `ARCHETYPE_PROFILES` dan `ARCHETYPE_EXTENDED` di `ReflectionView.tsx`
- Hapus guard `archetypes.length > 0` — ganti dengan selalu render, menggunakan fallback archetype

---

### 25.6 Ringkasan Status & Urutan Perbaikan

| # | Item Feedback | Kompleksitas | Dependensi | Status |
|:--|:-------------|:------------:|:----------:|:------:|
| 1 | Hapus bahasa ph/vi/my dari `i18n.ts` + `LanguageSelectView.tsx` | Rendah | Tidak ada | ⬜ Belum |
| 2 | Fix nama produk di `LandingView.tsx` | Rendah | Tidak ada | ⬜ Belum |
| 3 | Fix archetype fallback di `gameEngine.ts` + `ReflectionView.tsx` | Rendah | Tidak ada | ⬜ Belum |
| 4 | Kurangi font size di `DiscussionView.tsx` + `VotingView.tsx` | Rendah | Tidak ada | ⬜ Belum |
| 5 | Generate & embed ilustrasi per scenario di `ScenarioView.tsx` | Sedang | Perlu generate aset | ⬜ Belum |
| 6 | Redesign visual identity & color palette | Tinggi | **Menunggu color palette klien** | ⏳ Blocked |

---

_End of Document — The People's Assembly PRD v1.1 (Complete Merged)_
_Last Updated: July 2026 — Audit Kode §25 ditambahkan_
_Next Review: After M3 (W2 July)_