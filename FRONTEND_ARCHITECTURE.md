# Veralabel Frontend Architecture Guide 🛡️

Welcome to the **Veralabel Frontend** architecture documentation. This guide details how the client-side application is structured, how state is managed, how routing works, and how the core workspace annotation modalities operate.

---

## 📂 Directory Structure

The codebase is organized into modules to keep concerns separated and highly maintainable:

```
src/
├── app/                  # Application initialization configuration
├── assets/               # Public assets (icons, static images)
├── shared/               # Shared logic, hooks, types, and components
│   ├── components/       # Shared UI primitives (Buttons, Inputs, etc.)
│   ├── hooks/            # Custom React hooks (timers, API integrations)
│   ├── store/            # Global/Shared Zustand stores (e.g. notifications)
│   ├── theme/            # Theme settings and CSS variables
│   ├── types/            # App-wide TypeScript definitions
│   └── utils/            # Shared utility functions (validation, routing context)
├── modules/              # Feature modules (encapsulated domains)
│   ├── admin/            # Platform moderation, telemetry dashboards, user vetting
│   ├── auth/             # Login, SignUp, Password Reset pages and layout
│   ├── buyer/            # Dataset marketplace, cart, buyer profiles, and request modal
│   ├── labeller/         # Custom Labeller Workbench, claimable batches, wallet dashboards
│   ├── landingPage/      # Public marketing landing page, FAQs, pricing templates
│   ├── payment/          # Payout forms and transaction histories
│   └── reviewer/         # Reviewer audit queues, consensuses, and feedback modalities
├── firebase.ts           # Firebase connection configuration (notifications, auth sync)
├── main.tsx              # React mounting root
└── App.tsx               # App entrypoint, global providers, and Router definitions
```

---

## ⚙️ Routing & Navigation

The application uses **React Router** for routing. Navigation layout is split based on user roles and features:

- **Public Routes**: Managed under `landingPage` module (Landing page, FAQ, pricing).
- **Authentication**: Isolated pages under `auth` module.
- **Admin Portal (`/admin/*`)**: Restricts access to admin roles. Features user management dashboards and system analytics.
- **Labeller Workbench (`/labeller/*`)**: Built specifically for labellers to view earnings and claim task batches.
- **Reviewer Portal (`/reviewer/*`)**: Allows quality auditors to verify submissions and manage audits.

---

## 🧠 State Management (Zustand)

Veralabel uses **Zustand** for lightweight, decentralized state management. Instead of a single giant store, state is scoped within each feature module:

### Core Stores:
1. **`authStore`** (`src/modules/auth/useAuthstore.tsx`): Stores authentication states, current user profile, token contexts, and session data.
2. **`taskStore`** (`src/modules/labeller/store/taskStore.tsx`): Tracks claimed batches, local tasks progress, submit/flag actions, and payloads fetched from storage.
3. **`walletStore`** (`src/modules/labeller/store/walletStore.tsx`): Coordinates labeller balances, pending payouts, and earnings.
4. **`userManagementStore`** (`src/modules/admin/store/userManagementStore.tsx`): Powers administrative tools like user vetting, promotions, and blocks.

---

## 🖌️ Labeller Workbench Modalities

The Labeller Workbench (`src/modules/labeller/pages/Workbench.tsx`) dynamically adapts its layout and editing tools based on the task's resolved content type and labeling protocol:

### 1. Visual Modality (`ImageStage.tsx`)
- **Interaction**: Features interactive canvas viewport controls (Pointer pan, Zoom, Reset scale) and Bounding Box tools.
- **Labels**: Strict labeling checks matching target categories from the dataset protocol.
- **Robustness**: Uses standard image loading fallback patterns. Captures browser and network loading errors to display immediate feedback instead of loading indefinitely.

### 2. Audio Modality (`AudioStage.tsx`)
- Includes audio waveform controls.
- Provides transcription inputs with custom telemetry length verification.
- Supports single/multi-category audio classification.

### 3. NLP Modality (`TextStage.tsx`)
- Renders formatting prompts, long-form documents, or code inputs.
- Handles text categorization tasks.

### 4. RLHF Stage (`RLHF.tsx`)
- Displays preference rating (A vs B outputs) alongside dimensional scoring criteria (1-5 scales) and linguistic justification textareas.

---

## ⚡ API & Cloud Storage Integration

1. **REST API**: Axios instance loaded under `src/shared/types/api.ts` maps requests to `VITE_API_URL` with auto-attached Authorization bearer headers.
2. **Cloudflare R2**:
   - For performance, the workbench uploads result JSON files **directly to R2** via pre-signed upload URLs, bypassing the application backend.
   - Once upload completes successfully, the frontend notifies the backend database to finalize submission metadata.

---

## 📦 Build Commands

| Command | Action |
|---|---|
| `npm run dev` | Runs the Vite development server locally. |
| `npm run build` | Builds the client app using `tsc -b` and `vite build` for production. |
| `npm run preview` | Runs a local server to preview the built dist bundle. |
