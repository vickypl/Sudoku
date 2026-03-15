# ◈ Sudoku (HTML + CSS + JavaScript)

This repository is now a **vanilla web app only** and contains just the files needed to run Sudoku in the browser.

## Project structure

- `index.html` – app markup
- `styles.css` – app styles/themes
- `app.js` – game logic and interactions

## Run locally

### Option 1: open directly
1. Download this project and extract it.
2. Open the folder.
3. Double-click `index.html`.

### Option 2: tiny local server (recommended)

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Controls
- Click a cell, then click 1-9 to place a number.
- Keyboard: press `1-9` to place.
- `Backspace/Delete` to erase selected cell.
- `Notes` button toggles note mode.
- `Hint` fills selected cell with the correct value.
- `Check` highlights conflicts.
