# Code Escape Room

An immersive cyberpunk-inspired educational platform that teaches Python programming through interactive escape-room style challenges.

## Current Status

The project is currently under active development.

### Implemented
- React + Vite frontend
- Three.js immersive environment
- Monaco code editor integration
- Educational gameplay engine
- Python code execution backend
- Level progression system
- XP and mission structure
- Cyberpunk UI/UX system
- Local Python execution for development

### In Progress
- Additional Python levels
- Hint system
- User authentication
- Progress persistence
- AI mentor integration
- Achievement system

---

## Tech Stack

### Frontend
- React
- Vite
- Three.js
- React Three Fiber
- Framer Motion
- GSAP
- Tailwind CSS
- Zustand
- Monaco Editor

### Backend
- Node.js
- Express

### Temporary Execution Provider
- Local Python execution using `child_process`

---

## Running the Project

### Install dependencies

```bash
npm install
```

### Start frontend + backend

```bash
npm run dev:full
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
PYTHON_BIN=python
EXECUTION_PROVIDER=local
```

If Python is installed using the Windows launcher:

```env
PYTHON_BIN=py
```

---

## Project Goal

Code Escape Room aims to make programming education more engaging through:
- story-driven learning
- gamification
- interactive coding missions
- adaptive educational systems
- immersive visual environments

---

## Notes

The current execution system uses local Python execution temporarily during development.

Future plans include:
- Judge0 integration
- cloud-based execution
- Firebase authentication
- AI-powered tutoring
- multiplayer/co-op challenges
