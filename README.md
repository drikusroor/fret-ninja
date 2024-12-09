# Fret Ninja

<img src="public/logo.png" width="64" height="64" alt="Fret Ninja logo, a ninja-like figure with a guitar-shaped torso." style="float: left; margin: 1rem;" />

Fret Ninja is a React-based web application to search for guitar chords, view chord voicings, and build chord sequences. It aims to help guitarists find and sequence chords more easily, with features like fuzzy search, transposition, and minimal hand-movement voicing selection.

## What the App Does

Fret Ninja allows you to type in a chord name (or partial chord name) and instantly see potential chord voicings on the guitar. It focuses on chords derived from G-based chord shapes but can transpose them to other keys. For example, typing "Gma" will show you chords like Gmaj7 and Gmaj7(b5).

You can add found chords to a sequence. The app tries to select fingerings that minimize hand movement from one chord to the next. Once you've built a sequence, you can share it via a URL parameter so others can see and play your chord progression.

**Key Features:**
- **Fuzzy Search:** Type partial chord names (like "Gma") to find related chords (e.g., Gmaj7).
- **Multiple Voicings & Inversions:** See various chord shapes and choose which one to add.
- **Sequence Building:** Add chords to a sequence, reorder or remove them, and watch the app minimize hand movement.
- **URL Sharing:** Your chord sequence is encoded in the URL, so you can share it with others.
- **Expandable Results:** If many chord alterations are found, only the first few are shown initially. You can expand to see more while keeping the sequence visible.

## How to Use

1. **Search for a Chord:**
   - Type in a chord name (e.g., `Gmaj7`, `Cmaj7`, `Gdim`, `Gm7(b5)`) or a partial name (e.g., `Gma`) into the search box.
   - The app will display chord voicings found for that chord or closely matching chords.

2. **Add Chords to the Sequence:**
   - You can press *Enter* to add the top search result to the sequence automatically.
   - Alternatively, each chord voicing in the results has an "Add" button. Click it to add that specific voicing to the sequence.
   - After adding a chord, the search input will clear automatically.

3. **Edit Your Sequence:**
   - Chords you've added appear at the bottom. Each chord shows the chosen voicing.
   - Remove a chord by clicking the "X" button on that chord.
   - Use the "Reset" button to clear the entire sequence.

4. **Share the Sequence:**
   - The URL updates as you add or remove chords. Copy the URL and share it with others.
   - When someone opens the URL, they'll see the same chord sequence.

5. **Show More/Less Results:**
   - If more than 3 chord sets are found, only the first 3 are shown.
   - Click "Show more" to see the additional chord sets.

## Technical Overview

**Stack:**
- **React** with **TypeScript** for type safety and clarity.
- **Tailwind CSS** for styling.
- **URL Params** for state persistence and sharing chord sequences.

**Key Files:**
- `App.tsx`: Main application logic and UI.
- `chordLogic.ts`: Functions for chord parsing, fuzzy searching, transposition, and calculating minimal hand movement distances.
- `ChordDiagram.tsx`: A component that renders a single chord voicing diagram.

**Features Implemented:**
- **Fuzzy Chord Search:** The `getChordShapes()` function attempts to match partial chord qualities against a G-based chord database.
- **Transposition:** Chords are initially defined for the key of G. If another root is requested (e.g., Cmaj7), it transposes the G-based shape.
- **Sequence Management:** Sequences are stored in the URL and kept in sync with React state. Adding and removing chords updates the UI and URL.
- **Minimal Movement Selection:** When adding new chords, Fret Ninja tries to pick a voicing that minimizes the "distance" from the previous chord's voicing.
- **Collapsible Result Sets:** If more than 3 chord sets are found, only the first three show by default. A button toggles the visibility of the rest.

## Running the Project

1. **Install Dependencies:**
```bash
bun install # or npm install
```

2. **Start the Development Server:**
```bash
bun run dev # or npm run dev
```

3. **Build for Production:**
```bash
bun run build # bun run build
```

## Limitations & Future Improvements

- The chord database is limited and hardcoded for demonstration purposes.
- The fuzzy search is basic. A more robust search or chord-finding logic could be integrated.
- Finger assignments are simplified and might not reflect the most ergonomic or standard fingering choices.

Despite these limitations, Fret Ninja provides a flexible and visually clear way to experiment with chords and share your sequences.

## Contributing

We welcome PRs to improve or expand the list of chords and qualities, or improve / fix Fret Ninja in any other way. If you have suggestions or improvements, please feel free to contribute!