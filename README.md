<div align="center">

# 🚀 Dev-Seeker

**A real-time collaboration platform for developers — get instant help, share knowledge, and earn rewards.**

Stuck on a bug? Create a room, invite the community in, and solve it together over live video and screen-share. Help others fix theirs and earn **Seeker Coins**, badges, and rep along the way.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Stream](https://img.shields.io/badge/Stream-Video%20SDK-005FFF)](https://getstream.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth-Google-7C3AED)](https://next-auth.js.org/)

</div>

---

## ✨ Features

### 🎥 Real-Time Collaboration Rooms
- **Live video calls + screen sharing** powered by [Stream Video SDK](https://getstream.io/video/)
- **Waiting lobby & admit system** — host approves who joins their room
- **Live indicator** that auto-updates if a host loses connection
- Tags, difficulty, category, and estimated time on every room

### 🪙 Coins & Gamification
- **Earn Seeker Coins** for helping fix bugs (rate-limited per minute)
- **Achievement badges** — First Room, 10 Hours Helped, 5-Star Dev, Coin Collector, and more
- **Leaderboard** — top earners, most active, and most rooms created
- **Contribution map** (GitHub-style) on every profile

### 👥 Social Features
- **Friend requests** — bi-directional with accept/decline
- **Follow system** — one-directional, lighter than friends
- **Discussion forums** for general questions
- **Blog system** — write technical articles, like and comment
- **Notification feed** with categorized notifications

### 🌐 User Profiles
- Bio, country, role (student/professional), institute, tech-stack tags
- GitHub link, profile picture upload
- Transaction history (coins earned/spent)
- Public list of rooms, blogs, friends, followers

### 🎨 UI / UX
- **Dark mode** with custom violet/cyan/fuchsia gradient theme
- **Glassmorphism + neon glow** design language
- Built with [shadcn/ui](https://ui.shadcn.com/), [Lucide icons](https://lucide.dev/), and [Lottie](https://lottiefiles.com/) animations
- Fully responsive — mobile-first

---

## 🛠️ Tech Stack

| Layer        | Tech                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| **Framework**| [Next.js 14](https://nextjs.org/) (App Router) + React 18              |
| **Auth**     | [NextAuth.js](https://next-auth.js.org/) with Google OAuth (JWT)       |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Video**    | [@stream-io/video-react-sdk](https://getstream.io/video/docs/)         |
| **Styling**  | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Forms**    | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Animation**| [Framer Motion](https://www.framer.com/motion/) + [Lottie](https://lottiereact.com/) |
| **3D**       | [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Drei](https://github.com/pmndrs/drei) |
| **Real-time**| Server-Sent Events (SSE) for live room status                          |

---

## 📂 Project Structure

```
dev-seeker/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── blog/                 # Blog CRUD endpoints
│   │   ├── leaderboard/          # Leaderboard aggregation
│   │   ├── room/                 # Room CRUD + SSE live-stream
│   │   ├── upload/               # Image uploads
│   │   └── user/                 # User profile endpoints
│   ├── about/                    # About page
│   ├── blog/                     # Blog list, create, edit, view
│   ├── browse/                   # Browse rooms with filters
│   ├── create-room/              # Room creation form
│   ├── feedback/                 # Post-session feedback
│   ├── leaderboard/              # Leaderboard UI
│   ├── room/[roomId]/            # Live room (video + admit panel)
│   ├── user/                     # User profiles, edit, friends, notifications
│   ├── globals.css               # Global styles + custom utilities
│   ├── layout.js                 # Root layout
│   ├── page.jsx                  # Landing page
│   └── Provider.js               # Session + theme providers
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui primitives
│   ├── Header.jsx                # Top navigation
│   ├── Footer.jsx                # Footer
│   ├── RoomCard.jsx              # Room card grid item
│   ├── ContributionMap.jsx       # GitHub-style activity heatmap
│   └── ...
├── context/
│   └── CallContext.jsx           # Global call/room state
├── database/
│   ├── mongoose.js               # MongoDB connection
│   └── model/                    # Mongoose schemas
│       ├── user2.js              # User schema (badges, follow, etc.)
│       ├── room2.js              # Room schema
│       ├── blog.js               # Blog schema
│       ├── discussion.js         # Discussion forum schema
│       ├── joinRequest.js        # Room join requests
│       ├── account.js            # OAuth account linking
│       └── Testimonal.js         # Landing page testimonials
├── lib/
│   ├── auth.js                   # NextAuth config + helpers
│   └── utils.js                  # Shared utilities (splitTags, cn, etc.)
├── public/                       # Static assets
├── *.json                        # Lottie animation files
├── middleware.js                 # Route middleware
├── next.config.mjs               # Next.js config
├── tailwind.config.js            # Tailwind config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x ([download](https://nodejs.org/))
- **npm** / **yarn** / **pnpm**
- A **MongoDB** database — local install or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A **Google OAuth client** ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))
- A **Stream account** for video calling ([dashboard.getstream.io](https://dashboard.getstream.io/))

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/dev-seeker.git
cd dev-seeker
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/devseeker

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Stream Video / Chat
NEXT_PUBLIC_GET_STREAM_API_KEY=<your-stream-public-key>
GET_STREAM_SECRET=<your-stream-secret-key>

# Coin economy (tweak as needed)
ROOM_HELP_REWARD_RATE=2      # coins per minute helping
ROOM_DELETE_COINS=10         # coins refunded on room delete
```

> 💡 **Google OAuth setup:** in the Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.

> 💡 **Stream setup:** create a project at [dashboard.getstream.io](https://dashboard.getstream.io/), grab the API Key and Secret. Both Video and Chat products should be enabled (Chat is used server-side for token signing).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Sign in with Google to get started — new users are gifted **100 Seeker Coins** as a welcome bonus.

### 4. Build for production

```bash
npm run build
npm start
```

---

## 📜 Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server on `:3000`      |
| `npm run build` | Build the production bundle          |
| `npm start`     | Start the production server          |
| `npm run lint`  | Run ESLint                           |

---

## 🧠 How It Works

### Coin Economy
1. Anyone can **create a room** (free) describing the problem they need help with.
2. Other devs **browse** or **search** for live rooms by tags, difficulty, or category.
3. The host **admits** the helper into the call from the lobby.
4. Both jump into a **live video + screen-share** session via Stream.
5. When the helper leaves, they're rewarded **`ROOM_HELP_REWARD_RATE` coins per minute** of help.
6. The host gives feedback (rating + comment) — affects the helper's profile rating.

### Live Status
- Rooms broadcast their `isLive` state via **Server-Sent Events** (`/api/room/live-stream`).
- The host's browser sends keepalive pings; if the connection drops, network goes offline, the tab is hidden for >30s, or the page is closed, the room is marked **not live** automatically (using `fetch({ keepalive: true })` for unload reliability).
- Browse page shows live rooms with a pulsing indicator in real time.

### Badges (auto-computed)
Badges are calculated from existing user data each time a profile is viewed and persisted to the user document:
- 🚀 First Room • 🏠 Room Master (10) • ⏱️ First Hour • 🔥 10 Hours • 💎 50 Hours
- ⭐ 5-Star Dev • 🪙 Coin Collector (500) • 💰 Coin Hoarder (2000)
- 🦋 Social Butterfly (5 friends) • 📣 Popular (10 followers) • 📅 Week Streak

---

## 🔐 Security Notes

- Auth uses **NextAuth JWT sessions** (24h max, 1h refresh).
- Stream tokens are generated server-side as signed JWTs (`HS256`) with `iat`/`exp` claims — never exposed to the client.
- API routes validate session before any mutation.
- Room joins require an **admit** from the host — no public crashing.
- All env secrets are server-only except `NEXT_PUBLIC_GET_STREAM_API_KEY`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the repo
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔀 Open a Pull Request

---

## 📝 License

This project is open source — feel free to use, modify, and share. Add a `LICENSE` file with your preferred license (MIT recommended).

---

## 🙌 Acknowledgments

- [Stream](https://getstream.io/) — for the rock-solid Video SDK
- [shadcn/ui](https://ui.shadcn.com/) — for the beautiful component primitives
- [Lucide](https://lucide.dev/) — for the icon set
- [LottieFiles](https://lottiefiles.com/) — for the animations

---

<div align="center">

**Built with ☕ and a lot of late-night debugging.**

⭐ Star this repo if you find it useful!

</div>


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
