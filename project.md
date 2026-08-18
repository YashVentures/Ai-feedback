# True Feedback — Project Documentation

## Overview

**True Feedback** is a full-stack anonymous messaging web application where users can create a profile and receive honest, anonymous messages or questions from anyone — no login required to send. Think of it as a personal anonymous feedback board.

**Live URL:** https://ai-feedback-knq9.vercel.app  
**Platform:** Vercel  
**Repository:** Private

---

## Features

### User-Facing
- **Anonymous messaging** — Anyone can send a message to a user's public profile without signing in
- **AI-generated message suggestions** — Powered by Google Gemini, generates 3 engaging questions to help senders get started
- **Email verification** — OTP-based verification on sign-up via Gmail SMTP
- **Accept/Reject messages toggle** — Users can turn off incoming messages from their dashboard
- **Copy profile link** — One-click copy of the shareable anonymous message link
- **Delete messages** — Users can delete individual messages from their dashboard
- **Redirect logic** — Logged-in users are auto-redirected away from sign-in/sign-up pages

### Developer/Technical
- JWT-based authentication with NextAuth
- Protected routes via Next.js middleware
- Debounced real-time username availability check on sign-up
- Fully responsive UI (mobile + desktop)
- Type-safe schemas with Zod
- MongoDB with Mongoose ODM

---

## User Flow

### Sign Up
1. User enters username, email, and password on `/sign-up`
2. Username is checked for uniqueness in real-time (debounced API call)
3. On submit, account is created and a 6-digit OTP is sent to the email via Gmail SMTP
4. User is redirected to `/verify/[username]`
5. User enters OTP → account is verified → redirected to sign-in

### Sign In
1. User enters username/email and password on `/sign-in`
2. NextAuth validates credentials against MongoDB
3. On success, JWT session is created → redirected to `/dashboard`

### Dashboard (`/dashboard`)
1. Displays all received anonymous messages in a card grid
2. Shows the user's unique shareable profile URL with a copy button
3. Toggle to enable/disable accepting new messages
4. Refresh button to reload messages
5. Each message card has a delete button with confirmation dialog

### Public Profile (`/u/[username]`)
1. Anyone can visit this page without signing in
2. Enter and submit an anonymous message to the profile owner
3. Click **"✨ Generate Messages with AI"** to get 3 AI-suggested questions (via Gemini)
4. Click any suggestion to auto-fill the message box
5. Logged-in users see a **"Go to Home"** button; guests see **"Create Your Account"**

### Verify (`/verify/[username]`)
1. User enters the 6-digit OTP received in email
2. OTP is validated against stored code and expiry in MongoDB
3. On success, `isVerified` is set to `true` and user is redirected to sign-in

---

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing/home page |
| `/sign-up` | Static | Registration form |
| `/sign-in` | Static | Login form with test credentials hint |
| `/verify/[username]` | Dynamic | OTP verification page |
| `/dashboard` | Static (auth protected) | User dashboard |
| `/u/[username]` | Dynamic | Public anonymous message page |

### API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/sign-up` | POST | Register new user, send OTP email |
| `/api/verify-code` | POST | Validate OTP and verify account |
| `/api/check-username-unique` | GET | Check if username is available (real-time) |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth session handler |
| `/api/accept-messages` | GET/POST | Get or update message acceptance setting |
| `/api/get-messages` | GET | Fetch all messages for authenticated user |
| `/api/send-message` | POST | Send anonymous message to a user |
| `/api/delete-message/[messageid]` | DELETE | Delete a specific message |
| `/api/suggest-messages` | POST | Generate AI message suggestions via Gemini |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2.13 | React framework with App Router |
| React | 18 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4.1 | Styling |
| shadcn/ui | — | UI component library |
| Radix UI | — | Accessible component primitives |
| Lucide React | 0.446.0 | Icons |
| React Hook Form | 7.53.0 | Form state management |
| Zod | 3.23.8 | Schema validation |
| Embla Carousel | 8.3.0 | Carousel on landing page |
| dayjs | 1.11.13 | Date formatting |
| Axios | 1.7.7 | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Next.js API Routes | 14.2.13 | Serverless API endpoints |
| NextAuth.js | 4.24.8 | Authentication (JWT, credentials) |
| MongoDB | 6.9.0 | NoSQL database |
| Mongoose | 8.6.3 | MongoDB ODM |
| bcryptjs | 2.4.3 | Password hashing |
| Nodemailer | 6.10.1 | Email sending via Gmail SMTP |

### AI
| Technology | Purpose |
|---|---|
| Google Gemini 2.5 Flash | AI message suggestion generation |
| `@google/generative-ai` SDK | Gemini API client |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Hosting & deployment |
| MongoDB Atlas | Cloud database |
| Gmail SMTP | Transactional email (OTP verification) |

---

## Database Schema

### User
```
username        String   unique, required
email           String   unique, required
password        String   hashed with bcryptjs
verifyCode      String   6-digit OTP
verifyCodeExpiry Date    OTP expiry timestamp
isVerified      Boolean  default: false
isAcceptingMessage Boolean default: true
messages        Message[] embedded array
```

### Message (embedded in User)
```
content    String   required
createdAt  Date     default: Date.now
```

---

## Authentication & Authorization

- **Strategy:** JWT (JSON Web Tokens) via NextAuth credentials provider
- **Session:** Stored client-side as a signed JWT cookie
- **Password:** Hashed with `bcryptjs` before storing
- **Protected routes:** Next.js middleware checks JWT on every request to `/dashboard`
- **Redirect rules:**
  - Authenticated users visiting `/`, `/sign-in`, `/sign-up`, `/verify/*` → redirected to `/dashboard`
  - Unauthenticated users visiting `/dashboard` → redirected to `/sign-in`

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Secret key for JWT signing |
| `NEXTAUTH_URL` | Base URL (`http://localhost:3000` locally, production URL on Vercel) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GMAIL_USER` | Gmail address used for sending OTP emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16-char, not regular password) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/         # Sign in page
│   │   ├── sign-up/         # Sign up page
│   │   └── verify/[username]/ # OTP verification page
│   ├── (app)/
│   │   └── dashboard/       # User dashboard (auth protected)
│   ├── api/
│   │   ├── accept-messages/ # Toggle message acceptance
│   │   ├── auth/            # NextAuth handler
│   │   ├── check-username-unique/ # Username availability
│   │   ├── delete-message/  # Delete a message
│   │   ├── get-messages/    # Fetch user messages
│   │   ├── send-message/    # Send anonymous message
│   │   ├── sign-up/         # User registration
│   │   ├── suggest-messages/ # Gemini AI suggestions
│   │   └── verify-code/     # OTP verification
│   └── u/[username]/        # Public profile page
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── MessageCard.tsx      # Individual message card
├── helpers/
│   └── sendVerificationEmail.ts # Gmail SMTP email sender
├── hooks/
│   └── use-toast.ts         # Toast notification hook
├── lib/
│   ├── dbConnect.ts         # MongoDB connection
│   ├── mailer.ts            # Nodemailer transporter
│   └── utils.ts             # Tailwind utility merger
├── middleware.ts             # Route protection & redirects
├── model/
│   └── User.ts              # Mongoose User & Message schema
├── schemas/                 # Zod validation schemas
└── types/                   # TypeScript type definitions
emails/
└── VerificationEmail.tsx    # React Email OTP template
```

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with required variables (see Environment Variables above)

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Deployment

Deployed on **Vercel** with automatic deployments on push to `main`.

Steps to redeploy:
1. Push changes to GitHub
2. Vercel auto-detects and builds
3. Ensure all environment variables are set in Vercel → Project Settings → Environment Variables
