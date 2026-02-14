# AI UI Generator

A **deterministic AI-powered UI generator** that converts natural language descriptions into working React UI code using structured agent orchestration.

**Think:** Claude Code for UI, but safe, reproducible, and debuggable.

 **Live Demo:** [Coming soon - Deploy link here]  
**Demo Video:** [Coming soon - Video link here]

---

## Features

-**Deterministic Output** - Same input → Same output every time  
-**Multi-Agent Pipeline** - Planner → Validator → Generator → Explainer  
-**Iterative Modifications** - Preserves unchanged components  
-**Live Preview** - Real-time UI rendering with hot reload  
-**Version Control** - Full rollback support  
-**AI Explanations** - Understand every design decision
-**Fixed Component Library** - 8 production-ready React components
-**Safety First** - Validation at every step

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│             FRONTEND (Next.js + React)              │
│  ┌──────────┬─────────────┬─────────────────┐       │
│  │   Chat   │ Code Editor │  Live Preview   │       │
│  │  Panel   │   (Monaco)  │   (iframe)      │       │
│  └──────────┴─────────────┴─────────────────┘       │
└─────────────────────────────────────────────────────┘
                        REST API
┌─────────────────────────────────────────────────────┐
│             BACKEND (Node.js + Express)             │
│                                                     │
│  User Request → Orchestrator                        │
│       ↓                                             │
│  Planner Agent (Claude/Gemini API)                  │
│       ↓                                             │
│  Plan Validator (Whitelist Enforcement)             │
│       ↓                                             │
│  Code Generator (Claude API)                        │
│       ↓                                             │
│  Code Validator (Safety Checks)                     │
│       ↓                                             │
│  Explainer Agent (Gemini API)                       │
│       ↓                                             │
│  State Manager (Version Control)                    │
│       ↓                                             │
│  Return Result                                      │
└─────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **Explicit Agent Pipeline**: NOT a single LLM call - each step is separate and visible
- **Deterministic Components**: Fixed library of 8 components that never change
- **Validation Everywhere**: Plans and code validated before acceptance
- **Iterative Preservation**: Modifications preserve unchanged components


---

## Quick Start

### Prerequisites

- Node.js 18+
- Claude API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone repository
git clone https://github.com/AbhinavBangar1/deterministic-ui-agent.git
cd deterministic-ui-agent

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Setup frontend (in another terminal)
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local if needed

# Run backend
cd backend
npm run dev

# Run frontend (in another terminal)
cd frontend
npm run dev
```

Open http://localhost:3000

---

## 📦 Component Library

**8 Fixed Components:**

| Component | Props | Purpose |
|-----------|-------|---------|
| Button | variant, children, onClick | Actions |
| Card | title, children | Content grouping |
| Input | type, placeholder, value | Form inputs |
| Table | columns, data, headers | Data display |
| Modal | isOpen, title, children, onClose | Overlays |
| Sidebar | items, children | Navigation |
| Navbar | title, items | Top navigation |
| Chart | type, data, title | Visualizations |

**The AI can ONLY:**
- Select components from this list
- Set allowed props
- Compose layouts

**The AI cannot:**
- Create new components
- Generate CSS
- Use inline styles
- Modify component implementations

---

## 💡 Usage Examples

### 1. Generate New UI

```
User: "Create a login form with email and password"

AI generates:
- Structured plan (JSON)
- React code using Card, Input, Button components
- Explanation of layout and component choices
- Live preview rendered in iframe
```

### 2. Modify Existing UI

```
User: "Add a 'Forgot Password' link"

AI:
- Preserves existing Card and Inputs
- Adds new Button component
- Explains what changed and why
- Updates preview
```

### 3. Rollback

```
User: Clicks "Rollback" button

System:
- Reverts to previous version
- Restores old code and preview
- Shows version history
```

---

## 🛡️ Safety & Validation

### Component Whitelist Enforcement

```typescript
// Allowed
{ "type": "Button", "props": { "variant": "primary" } }

// Rejected
{ "type": "CustomButton", "props": { "color": "#ff0000" } }
```

### Prop Validation

```typescript
// Allowed
{ "type": "Button", "props": { "variant": "primary", "children": "Click" } }

// Rejected (invalid prop)
{ "type": "Button", "props": { "customColor": "red" } }
```

### Code Safety

Forbidden patterns:
- `style={{ ... }}` - Inline styles
- `dangerouslySetInnerHTML` - XSS risk
- `eval()` - Code injection
- Non-whitelisted imports

---

## Project Structure

```
ai-ui-generator-full-stack/
├── backend/
│   ├── src/
│   │   ├── types.ts              # Type definitions
│   │   ├── validator.ts          # Validation logic
│   │   ├── prompts.ts            # AI agent prompts
│   │   ├── orchestrator.ts       # Agent pipeline
│   │   ├── stateManager.ts       # Version control
│   │   ├── api/
│   │   │   ├── server.ts         # Express server
│   │   │   ├── routes.ts         # API endpoints
│   │   │   └── middleware.ts     # CORS, logging
│   │   └── services/
│   │       └── geminiClient.ts   # Gemini API wrapper
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main 3-panel UI
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ChatPanel.tsx     # Left: Chat
│   │   │   ├── CodeEditor.tsx    # Middle: Monaco
│   │   │   ├── PreviewPanel.tsx  # Right: Preview
│   │   │   ├── VersionHistory.tsx # Version UI
│   │   │   └── ui/               # 8 fixed components
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       └── ... (6 more)
│   │   └── lib/
│   │       └── api.ts            # Backend client
│   └── package.json
│
├── README.md
├── SETUP.md
├── ARCHITECTURE.md
└── IMPROVEMENTS.md
```

---

## 🎯 Key Achievements

 **Multi-Agent Orchestration** - Visible separation of Planner, Generator, Explainer  
 **Deterministic System** - Fixed component library, consistent output  
 **Iterative Intelligence** - Preserves structure during modifications  
 **Complete Validation** - Checks at plan and code level  
 **Production UI** - Three-panel interface with Monaco Editor  
 **Version Control** - Full rollback support  
 **Live Preview** - Real-time iframe rendering  

---

## Technologies Used

- **Backend:** Node.js 18+, Express, TypeScript
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Editor:** Monaco Editor (VS Code engine)
- **AI:** Gemini flash 2.5
- **Validation:** Multi-layer (plan + code)
- **State:** In-memory with version history

---

## Known Limitations

1. **In-Memory State** - Versions lost on server restart (use database in production)
2. **Single User** - No multi-user support or authentication
3. **Mock Chart** - Chart component is visual placeholder (integrate real library for production)
4. **Basic Error Handling** - Could be enhanced with retry logic
5. **No Streaming** - AI responses not streamed (could add for better UX)


---


## License

MIT

---


**Technologies:**
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Tailwind CSS](https://tailwindcss.com/)

---

