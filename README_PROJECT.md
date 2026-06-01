# CarDekho AI Shortlist Builder - Next.js Frontend Client

This repository houses the frontend Next.js (App Router), TypeScript, and TailwindCSS application for the **AI Shortlist Builder** web app.

It is carefully crafted to mimic the signature look and feel of **CarDekho.com**, utilizing premium aesthetics, smooth transitions, and high-fidelity explainability metrics to elevate buyer confidence.

---

## 🎨 Design Theme & Core Visual Features

1. **Cardekho Brand Aesthetics**:
   - Primary Brand Color: Vibrant Red (`#F52F32`) for active selections and core CTAs.
   - Background Elements: Clean neutral off-white background (`#F8F9FA`) with pure-white (`#FFFFFF`) card panels.
   - Typography: Clean, responsive modern sans-serif.

2. **SVG Animated Radial Match Score Meter**:
   - Highlights the match score of recommended vehicles inside a custom, dynamic SVG progress ring. It animates on loading and color-codes: emerald (`>=90%`), amber (`80-89%`), or blue (`<80%`).

3. **Step-by-Step Gamified Survey**:
   - Organizes the 6 core questions (Budget, Family Size, Usage, Fuel, Body, Priority) into 4 highly intuitive, gamified stages to prevent decision fatigue. Uses custom vector icons (`lucide-react`) to represent options.

4. **Pulsating loading skeletons**:
   - Renders a complete matching wireframe skeleton with smooth CSS pulse effects (matching recommended card sizes, overall reasoning bullet blocks, and rejected boxes) while waiting for the LLM. It rotates dynamic messages to keep the user engaged.

5. **Grader Status Bar**:
   - An elegant header badge that dynamically displays system connection health, the database mode (Supabase Cloud vs Offline In-Memory Fallback), and the active AI engine (Claude vs OpenAI vs Heuristics). Excellent for immediate local verification!

---

## 📂 Folder Layout

```text
cardekho_ui/
├── app/
│   ├── layout.tsx         # Next.js global layout wrapper
│   ├── page.tsx           # Multi-state coordinator (Hero, Form, Loading, Results)
│   └── globals.css        # Tailwind 4 custom styles, keyframes & animations
├── components/
│   ├── QuestionForm.tsx   # Interactive questionnaire multi-step wizard
│   ├── RecommendationCard.tsx # Highlights Match Score meter, why it fits & tradeoffs
│   ├── ReasoningSection.tsx # AI reasoning bullet points
│   └── RejectedCars.tsx   # Explainability-focused rejected alternatives panel
├── services/
│   └── api.ts             # REST client with automatic timeout-retries
├── types/
│   └── index.ts           # Shared TypeScript interfaces
├── package.json
└── tsconfig.json
```

---

## 🛠️ Environment Configurations

Create a `.env` file in the root of this folder. You can copy the contents of `.env.example`:

```bash
# Absolute URL pointing to the Express REST API backend server (defaults to port 5001)
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🚀 Running the Client

### 1. Install Dependencies
```bash
npm install
```

### 2. Boot up Development Server
```bash
npm run dev
```
The application will boot and compile. Open **`http://localhost:3000`** in your browser to evaluate!
