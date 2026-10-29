> ✨ **Inspired Project**

<div align="center">

# 🏏 Cricket Arena — 3D IPL Seat Booking

**Pick an IPL home ground, explore it in 3D, sit in any seat and book up to 3 seats.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r186-000000?logo=threedotjs&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/R3F-9-black)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?logo=vitest&logoColor=white)

</div>

---

## ✨ Features

- 🔐 **Simple sign-in:** a name or email plus a 10-digit phone number (the phone number is the user id)
- 🏟️ **10 IPL stadiums:** the number of 3D seats follows each stadium's real capacity
- 🎥 **Cinematic camera:** a spinning intro → click to enter → fly to any stand → click a seat to sit in it and look around
- 💺 **Live availability:** seats booked by others are greyed out, with a "X of N seats available" counter
- 💰 **Price tiers:** Premium ₹3,500 · Standard ₹2,000 · Economy ₹1,200, colour-coded in 3D
- 🔄 **Cross-tab sync:** bookings update live between browser tabs, so you can test several users side by side
- 🌗 **Dark & light themes:** a night skyline with lit windows and stars, or daytime with sun and clouds
- 📱 **Responsive:** works on phones, tablets and laptops
- ⚡ **Fast first load:** Three.js is code-split and downloads only when a stadium opens

## 🚀 Getting started

```bash
git clone <your-repo-url>
cd cricket-seats
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Serve the production build locally  |
| `npm run typecheck` | TypeScript only                     |
| `npm run lint`      | Lint with oxlint                    |
| `npm run format`    | Format everything with Prettier     |
| `npm test`          | Run unit tests (Vitest)             |

## 🕹️ How to use

1. **Sign in** with your name/email and a 10-digit phone number.
2. **Choose a stadium** from the list.
3. **Click the spinning stadium** to enter.
4. **Fly around:** use the stand letters, drag to rotate, scroll/pinch to zoom, right-drag to pan.
5. **Click a seat** to select it and see the view from it.
6. **Confirm** your selection (max 3 seats per user). Release a booking at any time from _My bookings_.

> 💡 Open a second tab, sign in with a different phone number, and watch bookings sync live.

## 🗺️ Routes

| URL            | Screen                          |
| -------------- | ------------------------------- |
| `/login`       | Sign in                         |
| `/stadiums`    | Choose a stadium                |
| `/stadium/:id` | 3D stadium, e.g. `/stadium/rcb` |

Signed-out users are sent to `/login` and returned to the page they wanted after sign-in.

## 🧱 Tech stack

| Area      | Tools                                                    |
| --------- | -------------------------------------------------------- |
| UI        | React 19, TypeScript, react-router 7, plain CSS + tokens |
| 3D        | three.js, @react-three/fiber, @react-three/drei          |
| Animation | GSAP (camera fly-to moves)                               |
| State     | Zustand (auth · booking · view slices)                   |
| Tooling   | Vite, Vitest, oxlint, Prettier                           |

## 🔀 How it works

- **Components** only read state and call store actions. They never re-implement booking rules.
- **Store actions** (Zustand) call pure, unit-tested rules (`features/booking/rules.ts`,
  `features/auth/validation.ts`) and read/write browser storage.
- **The camera is driven by commands.** UI code calls `cameraControls.focusSector(...)`,
  `viewFromSeat(...)` and so on, and `CameraRig` (inside the 3D canvas) animates them with GSAP.
- **Layouts are generated.** `getStadiumLayout(venueId)` builds a stadium's seats once from its
  capacity and caches it. All seats are drawn as a single instanced mesh, so thousands stay fast.
- **Tabs stay in sync.** A booking saved in one tab fires a `storage` event in the others, which
  refreshes their bookings and drops any seat that was just taken.

## 📁 Project structure

```
src/
├── app/                  Router, route table, auth guard
├── config/               Constants and the list of IPL venues
├── store/                Zustand store: auth, booking, view slices
├── features/
│   ├── auth/             Login page and form validation
│   ├── venues/           Stadium list page and cards
│   ├── booking/          Pure booking rules, storage and cross-tab sync
│   └── stadium/
│       ├── layout/       Generates seats and geometry for a venue
│       ├── scene/        3D scene: seats, stands, field, camera rig
│       │   └── environment/   Sky, ground and the city
│       └── hud/          On-screen controls over the 3D view
├── shared/               Storage, formatting, theme, header, error boundary
└── styles/               Design tokens, base styles, shared UI classes
```

### Adding a stadium

Add an entry to `VENUES` in [`src/config/venues.ts`](src/config/venues.ts) (id, team, colours,
capacity, ground size). The list page, route, 3D layout and seat count all follow from it.

## 💾 Where data lives

There is **no backend**. Everything is stored in the browser:

- **Bookings:** `localStorage`, one key per stadium (`cricket-seats:bookings:<venueId>`)
- **Signed-in user:** `sessionStorage` (this tab only)
- **Theme:** `localStorage`

That's fine for a demo, but bookings aren't shared between devices and phone numbers aren't
verified. Real use would need a server that owns bookings and verifies users (e.g. with an OTP).

## ☁️ Deploying

```bash
npm run build      # outputs to dist/
```

Upload `dist/` to any static host. Because of client-side routing, unknown paths must serve `index.html`:

- **Vercel:** `vercel.json` (included)
- **Netlify / Cloudflare Pages:** `public/_redirects` (included)
- **Others (nginx, S3 + CloudFront…):** add a "fall back to `/index.html`" rule

## 📝 Notes

- Capacities are approximate and the stadium models are stylised, not exact replicas.
- The 3D view needs WebGL. Without it, users see a friendly error instead of a blank page.
