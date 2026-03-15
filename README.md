# ◈ Sudoku Online

A Sudoku game you can run on your own computer.

This guide is written for beginners (non-technical users).

---

## What you need first

Before starting, install these 2 free tools:

1. **Node.js (LTS version)**
   - Download: https://nodejs.org/
   - Install it with default options.

2. **Git**
   - Download: https://git-scm.com/downloads
   - Install with default options.

After installing, **restart your computer once** (recommended).

---

## Step-by-step: run the app (simple way)

### Step 1) Download this project

Open terminal (or Command Prompt) and run:

```bash
git clone https://github.com/<your-username>/Sudoku.git
```

Then go into the project folder:

```bash
cd Sudoku
```

> If you already have the folder, just open terminal inside `Sudoku`.

### Step 2) Install app dependencies

Run:

```bash
npm install
```

Wait until it finishes. (Can take 1-5 minutes first time.)

### Step 3) Start the app

Run:

```bash
npm run dev
```

You will see a local address in terminal, usually:

- `http://localhost:5173/`

### Step 4) Open in browser

Copy that local address and open it in Chrome/Edge/Firefox.

Now the Sudoku app is running 🎉

---

## How to stop the app

In terminal, press:

- **Ctrl + C**

This safely stops the local server.

---

## Next time you want to run it

You only need these commands:

```bash
cd Sudoku
npm run dev
```

(Use `npm install` again only if dependencies were removed.)

---

## Optional: run tests

If you want to check that everything works technically:

```bash
npm test
```

---

## Common problems and easy fixes

### "npm is not recognized"

Node.js is not installed correctly. Reinstall Node.js from nodejs.org and restart computer.

### Port 5173 already in use

Close other running dev servers, then run `npm run dev` again.

### "Cannot find module" or install errors

Try:

```bash
npm cache clean --force
npm install
```

---

## Build for production (optional)

```bash
npm run build
```

Build files will be generated for deployment.
