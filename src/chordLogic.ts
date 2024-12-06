export type ChordShape = {
  frets: (string | number)[];
  fingers: (number | 0)[];
};

export const NOTE_MAP: Record<string, number> = {
  C: 0,
  "C#": 1, Db: 1,
  D: 2,
  "D#": 3, Eb: 3,
  E: 4,
  F: 5,
  "F#": 6, Gb: 6,
  G: 7,
  "G#": 8, Ab: 8,
  A: 9,
  "A#": 10, Bb: 10,
  B: 11,

  H: 11,
  Des: 1, Dis: 3, Es: 3, Fis: 6, Ges: 6
};

const STRING_PITCHES = [28, 33, 38, 43, 47, 52]; // For fret transpositions

function normalizeNoteName(n: string): string {
  const map: Record<string, string> = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Des: "C#", Dis: "D#", Es: "D#", Fis: "F#", Ges: "F#",
    H: "B", "H#": "C"
  };
  let root = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
  if (map[root]) return map[root];
  return root;
}

export function parseChordName(chordName: string): { root: string; quality: string; bass: string | null } | null {
  // Treat 'ø' as 'm7b5'
  chordName = chordName.replace('ø', 'm7b5');

  const match = chordName.match(/^([A-GH][b#]?)(.*?)(\/([A-GH][b#]?))?$/i);
  if (!match) return null;
  const root = normalizeNoteName(match[1]);
  const quality = match[2].trim();
  const bass = match[4] ? normalizeNoteName(match[4]) : null;
  return { root, quality, bass };
}

const G_CHORDS: Record<string, { notes: string[], shapes: ChordShape[] }> = {
  G: {
    notes: ["G", "B", "D"],
    shapes: [
      { frets: ["3", "2", "0", "0", "0", "3"], fingers: [2, 1, 0, 0, 0, 3] },
      { frets: ["3", "x", "0", "0", "0", "3"], fingers: [2, 0, 0, 0, 0, 3] },
      { frets: ["x", "x", "5", "4", "3", "3"], fingers: [0, 0, 4, 3, 2, 1] }, // inversion
    ],
  },
  Gm: {
    notes: ["G", "Bb", "D"],
    shapes: [
      { frets: ["3", "1", "0", "0", "3", "3"], fingers: [2, 1, 0, 0, 3, 4] },
      { frets: ["3", "x", "0", "3", "3", "3"], fingers: [2, 0, 0, 3, 3, 3] },
      { frets: ["x", "x", "5", "3", "3", "3"], fingers: [0, 0, 4, 2, 1, 1] }, // inversion
    ],
  },
  Gmaj7: {
    notes: ["G", "B", "D", "F#"],
    shapes: [
      { frets: ["3", "2", "0", "0", "0", "2"], fingers: [2, 1, 0, 0, 0, 3] },
      { frets: ["x", "x", "4", "4", "3", "2"], fingers: [0, 0, 3, 4, 2, 1] },
      { frets: ["3", "x", "4", "4", "4", "x"], fingers: [2, 0, 3, 3, 3, 0] },
    ],
  },
  G7: {
    notes: ["G", "B", "D", "F"],
    shapes: [
      { frets: ["3", "2", "0", "0", "0", "1"], fingers: [3, 2, 0, 0, 0, 1] },
      { frets: ["3", "x", "3", "4", "3", "x"], fingers: [2, 0, 3, 4, 3, 0] },
      { frets: ["x", "x", "5", "7", "6", "7"], fingers: [0, 0, 2, 4, 3, 4] },
    ],
  },
  Gm7: {
    notes: ["G", "Bb", "D", "F"],
    shapes: [
      { frets: ["3", "1", "0", "3", "3", "3"], fingers: [2, 1, 0, 3, 3, 3] },
      { frets: ["3", "1", "3", "3", "3", "x"], fingers: [2, 1, 3, 3, 3, 0] },
      { frets: ["x", "x", "5", "3", "6", "3"], fingers: [0, 0, 3, 1, 4, 1] }, // inversion
      { frets: ["3", "5", "3", "3", "3", "3"], fingers: [1, 3, 1, 1, 1, 1] }, // barre style
      { frets: ["3", "x", "3", "3", "3", "x"], fingers: [2, 0, 2, 2, 2, 0] }, // bossa nova style
    ],
  },
  G9: {
    notes: ["G", "B", "D", "F", "A"],
    shapes: [
      { frets: ["3", "0", "3", "2", "3", "0"], fingers: [2, 0, 3, 1, 4, 0] },
      { frets: ["3", "2", "3", "2", "3", "x"], fingers: [2, 1, 3, 1, 4, 0] },
    ],
  },
  "Gm7(b5)": {
    notes: ["G", "Bb", "Db", "F"],
    shapes: [
      { frets: ["3", "1", "3", "3", "2", "x"], fingers: [2, 1, 3, 4, 1, 0] },
      { frets: ["x", "x", "5", "6", "6", "6"], fingers: [0, 0, 1, 2, 3, 4] },
    ],
  },
  Gdim: {
    notes: ["G", "Bb", "Db"],
    shapes: [
      { frets: ["3", "1", "2", "3", "2", "x"], fingers: [2, 1, 2, 3, 2, 0] },
      { frets: ["x", "x", "2", "3", "2", "3"], fingers: [0, 0, 1, 3, 2, 4] },
    ],
  },
  Gaug: {
    notes: ["G", "B", "D#"],
    shapes: [
      { frets: ["3", "2", "1", "0", "0", "3"], fingers: [3, 2, 1, 0, 0, 4] },
      { frets: ["x", "x", "5", "4", "4", "3"], fingers: [0, 0, 4, 2, 3, 1] },
    ],
  },
  Gsus2: {
    notes: ["G", "A", "D"],
    shapes: [
      { frets: ["3", "0", "0", "0", "3", "3"], fingers: [2, 0, 0, 0, 3, 4] },
      { frets: ["x", "x", "5", "2", "3", "3"], fingers: [0, 0, 4, 1, 2, 3] },
    ],
  },
  Gsus4: {
    notes: ["G", "C", "D"],
    shapes: [
      { frets: ["3", "3", "0", "0", "1", "3"], fingers: [3, 4, 0, 0, 1, 4] },
      { frets: ["x", "x", "5", "5", "3", "3"], fingers: [0, 0, 3, 4, 1, 1] },
    ],
  },

  // Additional Alterations and Extended Chords
  G6: {
    notes: ["G", "B", "D", "E"],
    shapes: [
      { frets: ["3", "2", "0", "0", "0", "0"], fingers: [3, 2, 0, 0, 0, 0] },
      { frets: ["3", "x", "2", "4", "3", "x"], fingers: [2, 0, 1, 4, 3, 0] },
      { frets: ["x", "10", "9", "9", "8", "x"], fingers: [0, 4, 3, 2, 1, 0] },
    ],
  },

  Gadd9: {
    notes: ["G", "B", "D", "A"],
    shapes: [
      { frets: ["3", "2", "0", "2", "3", "3"], fingers: [3, 2, 0, 1, 4, 4] },
      { frets: ["3", "0", "0", "2", "3", "3"], fingers: [2, 0, 0, 1, 3, 4] },
    ],
  },

  Gmaj9: {
    notes: ["G", "B", "D", "F#", "A"],
    shapes: [
      { frets: ["3", "x", "4", "4", "3", "5"], fingers: [2, 0, 3, 4, 1, 4] },
      { frets: ["x", "10", "9", "11", "10", "12"], fingers: [0, 3, 2, 4, 1, 4] },
    ],
  },

  Gmaj6: {
    notes: ["G", "B", "D", "E"],
    shapes: [
      { frets: ["3", "2", "4", "4", "3", "3"], fingers: [2, 1, 3, 4, 2, 2] },
      { frets: ["x", "x", "5", "4", "5", "5"], fingers: [0, 0, 2, 1, 3, 4] },
    ],
  },

  Gmaj13: {
    notes: ["G", "B", "D", "F#", "A", "E"],
    shapes: [
      { frets: ["3", "x", "4", "4", "2", "2"], fingers: [3, 0, 4, 3, 1, 1] },
      { frets: ["x", "10", "9", "11", "12", "12"], fingers: [0, 3, 2, 4, 1, 1] },
    ],
  },

  G7sus2: {
    notes: ["G", "A", "D", "F"],
    shapes: [
      { frets: ["3", "x", "0", "2", "1", "3"], fingers: [3, 0, 0, 2, 1, 4] },
      { frets: ["x", "x", "5", "5", "3", "1"], fingers: [0, 0, 3, 4, 2, 1] },
    ],
  },

  G7b9: {
    notes: ["G", "B", "D", "F", "Ab"],
    shapes: [
      { frets: ["3", "2", "3", "1", "0", "1"], fingers: [3, 2, 4, 1, 0, 1] },
      { frets: ["3", "x", "3", "4", "3", "4"], fingers: [2, 0, 3, 4, 3, 4] },
    ],
  },

  "G7#9": {
    notes: ["G", "B", "D", "F", "A#"],
    shapes: [
      { frets: ["3", "2", "3", "3", "3", "x"], fingers: [2, 1, 3, 3, 3, 0] },
      { frets: ["x", "10", "9", "10", "11", "x"], fingers: [0, 3, 2, 4, 1, 0] },
    ],
  },

  G7b5: {
    notes: ["G", "B", "Db", "F"],
    shapes: [
      { frets: ["3", "x", "3", "4", "2", "x"], fingers: [2, 0, 3, 4, 1, 0] },
      { frets: ["x", "x", "5", "6", "4", "5"], fingers: [0, 0, 2, 3, 1, 4] },
    ],
  },

  "G7#5": {
    notes: ["G", "B", "D#", "F"],
    shapes: [
      { frets: ["3", "x", "3", "4", "4", "x"], fingers: [2, 0, 3, 4, 4, 0] },
      { frets: ["x", "x", "5", "6", "6", "7"], fingers: [0, 0, 2, 3, 3, 4] },
    ],
  },

  G7b13: {
    notes: ["G", "B", "D", "F", "Eb"],
    shapes: [
      { frets: ["3", "x", "3", "3", "5", "x"], fingers: [2, 0, 3, 3, 4, 0] },
      { frets: ["x", "x", "5", "6", "7", "8"], fingers: [0, 0, 1, 2, 3, 4] },
    ],
  },

  G11: {
    notes: ["G", "B", "D", "F", "C"],
    shapes: [
      { frets: ["3", "2", "3", "3", "1", "x"], fingers: [3, 2, 4, 4, 1, 0] },
      { frets: ["3", "x", "3", "2", "1", "1"], fingers: [3, 0, 4, 2, 1, 1] },
    ],
  },

  G13: {
    notes: ["G", "B", "D", "F", "E"],
    shapes: [
      { frets: ["3", "2", "3", "0", "0", "0"], fingers: [3, 2, 4, 0, 0, 0] },
      { frets: ["3", "x", "3", "4", "5", "5"], fingers: [2, 0, 3, 4, 3, 4] },
    ],
  },

  Gdim7: {
    notes: ["G", "Bb", "Db", "E"],
    shapes: [
      { frets: ["3", "1", "2", "0", "2", "0"], fingers: [3, 1, 2, 0, 4, 0] },
      { frets: ["x", "x", "2", "3", "2", "3"], fingers: [0, 0, 1, 3, 2, 4] },
    ],
  },

  Gm6: {
    notes: ["G", "Bb", "D", "E"],
    shapes: [
      { frets: ["3", "1", "2", "3", "0", "x"], fingers: [3, 1, 2, 4, 0, 0] },
      { frets: ["x", "x", "5", "3", "5", "3"], fingers: [0, 0, 3, 1, 4, 1] },
    ],
  },

  Gm9: {
    notes: ["G", "Bb", "D", "F", "A"],
    shapes: [
      { frets: ["3", "1", "3", "3", "3", "5"], fingers: [2, 1, 3, 3, 3, 4] },
      { frets: ["x", "x", "5", "3", "6", "5"], fingers: [0, 0, 2, 1, 4, 3] },
    ],
  },

  Gm11: {
    notes: ["G", "Bb", "D", "F", "C"],
    shapes: [
      { frets: ["3", "1", "3", "3", "1", "x"], fingers: [3, 1, 4, 4, 1, 0] },
      { frets: ["x", "x", "5", "3", "6", "6"], fingers: [0, 0, 3, 1, 4, 4] },
    ],
  },

  Gm13: {
    notes: ["G", "Bb", "D", "F", "A", "C", "E"],
    // Full extension: 1 (G), b3 (Bb), 5 (D), b7 (F), 9 (A), 11 (C), 13 (E)
    shapes: [
      { frets: ["3", "1", "3", "0", "1", "x"], fingers: [3, 1, 4, 0, 1, 0] },
      { frets: ["x", "x", "5", "3", "5", "5"], fingers: [0, 0, 3, 1, 4, 4] },
    ],
  },

  GmMaj7: {
    notes: ["G", "Bb", "D", "F#"],
    shapes: [
      { frets: ["3", "1", "2", "3", "2", "x"], fingers: [3, 1, 2, 4, 2, 0] },
      { frets: ["x", "x", "5", "3", "3", "2"], fingers: [0, 0, 4, 2, 3, 1] },
    ],
  },

  GmAdd9: {
    notes: ["G", "Bb", "D", "A"],
    shapes: [
      { frets: ["3", "1", "0", "2", "3", "3"], fingers: [2, 1, 0, 2, 3, 4] },
      { frets: ["x", "x", "5", "3", "6", "3"], fingers: [0, 0, 3, 1, 4, 1] },
    ],
  },

  "Gm9(b5)": {
    notes: ["G", "Bb", "Db", "F", "A"],
    shapes: [
      { frets: ["3", "1", "3", "2", "3", "x"], fingers: [3, 1, 4, 2, 4, 0] },
      { frets: ["x", "x", "5", "6", "6", "5"], fingers: [0, 0, 1, 2, 3, 1] },
    ],
  },

  Gaug7: {
    notes: ["G", "B", "D#", "F"],
    shapes: [
      { frets: ["3", "2", "3", "4", "4", "x"], fingers: [2, 1, 3, 4, 4, 0] },
      { frets: ["x", "x", "5", "4", "4", "4"], fingers: [0, 0, 3, 1, 1, 1] },
    ],
  },

  Gaug9: {
    notes: ["G", "B", "D#", "F", "A"],
    shapes: [
      { frets: ["3", "2", "3", "2", "4", "x"], fingers: [2, 1, 3, 1, 4, 0] },
      { frets: ["3", "x", "3", "2", "4", "3"], fingers: [2, 0, 3, 1, 4, 3] },
    ],
  },

  "G6/9": {
    notes: ["G", "B", "D", "E", "A"],
    shapes: [
      { frets: ["3", "0", "2", "2", "0", "0"], fingers: [2, 0, 1, 1, 0, 0] },
      { frets: ["x", "10", "9", "9", "10", "10"], fingers: [0, 4, 3, 2, 1, 1] },
    ],
  },
};

// Minimal chord formulas
const CHORD_FORMULAS: Record<string, number[]> = {
  "maj7": [0, 4, 7, 11],
  "m7": [0, 3, 7, 10],
  "7": [0, 4, 7, 10],
  "6": [0, 4, 7, 9],
  "m6": [0, 3, 7, 9],
  "m7b5": [0, 3, 6, 10], // half-diminished
  "m": [0, 3, 7],
  "maj": [0, 4, 7],
  "dim": [0, 3, 6],
  "dim7": [0, 3, 6, 9],
  "aug": [0, 4, 8],
  "add9": [0, 4, 7, 14],
};

function noteToSemitone(note: string): number {
  note = normalizeNoteName(note);
  return NOTE_MAP[note];
}

function notesToIntervalPattern(notes: string[]): number[] {
  const semis = notes.map(noteToSemitone);
  const root = semis[0];
  const intervals = semis.map(s => (s - root + 12) % 12).sort((a, b) => a - b);
  return intervals;
}

function identifyChord(notes: string[]): { root: string; name: string } | null {
  if (notes.length === 0) return null;
  const uniqueNotes = Array.from(new Set(notes));
  if (uniqueNotes.length < 2) return null;

  for (let i = 0; i < uniqueNotes.length; i++) {
    const rotated = [...uniqueNotes.slice(i), ...uniqueNotes.slice(0, i)];
    const intervals = notesToIntervalPattern(rotated);

    for (const formulaName in CHORD_FORMULAS) {
      const formula = CHORD_FORMULAS[formulaName];
      if (intervals.length === formula.length && intervals.every((val, idx) => val === formula[idx])) {
        // Found match
        const root = rotated[0];
        let chordName = root + formulaName;
        // If formulaName is 'maj' and only three notes, it's a major triad
        // If formulaName is 'm', it's minor triad
        // Try some simplifications:
        if (formulaName === 'maj') chordName = root;
        return { root, name: chordName };
      }
    }
  }
  return null;
}

function transposeChordShape(gShape: ChordShape, fromRoot: string, toRoot: string): ChordShape | null {
  const fromSemitone = NOTE_MAP[fromRoot];
  const toSemitone = NOTE_MAP[toRoot];
  const interval = (toSemitone - fromSemitone + 12) % 12;

  const newFrets: (string | number)[] = [];
  for (let i = 0; i < gShape.frets.length; i++) {
    const f = gShape.frets[i];
    if (f === 'x') {
      newFrets.push('x');
      continue;
    }
    const oldFret = typeof f === 'string' ? parseInt(f, 10) : f;
    const oldPitch = STRING_PITCHES[i] + oldFret;
    const newPitch = oldPitch + interval;
    const newFret = newPitch - STRING_PITCHES[i];
    if (newFret < 0 || newFret > 12) return null;
    newFrets.push(newFret === 0 ? "0" : newFret.toString());
  }

  return { frets: newFrets, fingers: gShape.fingers };
}

function partialMatch(quality: string): string[] {
  const keys = Object.keys(G_CHORDS);
  return keys.filter(k => k.startsWith("G") && k.toLowerCase().includes(quality.toLowerCase()));
}

function allRotations(notes: string[]): string[][] {
  const rotations: string[][] = [];
  for (let i = 0; i < notes.length; i++) {
    rotations.push([...notes.slice(i), ...notes.slice(0, i)]);
  }
  return rotations;
}

export function getChordShapes(chordName: string): { chordName: string; shapes: ChordShape[] }[] {
  const parsed = parseChordName(chordName);
  if (!parsed) return [];
  const { root, quality, bass } = parsed;

  const matchedChords = partialMatch(quality);
  if (matchedChords.length === 0) return [];

  const results: { chordName: string; shapes: ChordShape[] }[] = [];

  matchedChords.forEach((gQuality) => {
    const displayName = root === "G" ? gQuality : root + gQuality.substring(1);

    const shapes = G_CHORDS[gQuality].shapes
      .map(shape => root === "G" ? shape : transposeChordShape(shape, "G", root))
      .filter(s => s !== null) as ChordShape[];

    if (shapes.length > 0) {
      results.push({ chordName: displayName, shapes });
    }
  });

  if (results.length === 0) return results;

  // After fetching mainResult and gQualityUsed
  const mainResult = results[0];
  const gQualityUsed = matchedChords[0];

  // Original line:
  // let chordNotes = G_CHORDS[gQualityUsed].notes.map(normalizeNoteName);

  // New code to transpose chordNotes to the requested root
  let chordNotes = G_CHORDS[gQualityUsed].notes.map(normalizeNoteName);

  const fromSemitone = NOTE_MAP["G"];
  const toSemitone = NOTE_MAP[root];
  const interval = (toSemitone - fromSemitone + 12) % 12;

  function transposeNote(note: string, semis: number): string {
    const originalSemi = noteToSemitone(note);
    const newSemi = (originalSemi + semis) % 12;

    // Find a nice note name for the new semitone.
    // For simplicity, just choose a name without flats/sharps preference:
    for (const candidate in NOTE_MAP) {
      if (NOTE_MAP[candidate] === newSemi && !candidate.includes('b') && !candidate.includes('#')) {
        return candidate;
      }
    }

    // If none found without accidentals, just return the first match:
    for (const candidate in NOTE_MAP) {
      if (NOTE_MAP[candidate] === newSemi) {
        return candidate;
      }
    }
    return "C"; // fallback, should never happen
  }

  chordNotes = chordNotes.map(n => transposeNote(n, interval));

  // NEW LOGIC: If we have a bass note, let's specifically try to start from that bass note 
  // and see if identifyChord gives us something interesting (like Gm7 for Bb/G).

  // We have chordNotes corresponding to the chosen chord from G_CHORDS, transposed to `root`.
  // Now handle the bass note if there is one:
  if (bass) {
    const bassNormalized = normalizeNoteName(bass);
    // If the bass note isn't already in chordNotes, add it:
    const normalizedChordNotes = chordNotes.map(normalizeNoteName);
    if (!normalizedChordNotes.includes(bassNormalized)) {
      chordNotes.push(bassNormalized);
    }

    // Now reorder chordNotes so that the bass is at the front:
    const bassSemi = noteToSemitone(bassNormalized);
    const chordSemis = chordNotes.map(n => noteToSemitone(n) % 12);
    const bassIndex = chordSemis.indexOf(bassSemi);
    if (bassIndex >= 0 && bassIndex !== 0) {
      chordNotes = [...chordNotes.slice(bassIndex), ...chordNotes.slice(0, bassIndex)];
    }
  }

  // Now chordNotes represent the actual notes played, including the bass note if it wasn't there.
  // For Bb/G, chordNotes should now be [G, Bb, D, F] after this block.

  // Continue with identifyChord and the enharmonic checks:
  const foundNames = new Set<string>([mainResult.chordName]);

  for (const rotation of allRotations(chordNotes)) {
    const identified = identifyChord(rotation);
    if (identified && !foundNames.has(identified.name)) {
      foundNames.add(identified.name);
      results.push({
        chordName: identified.name + " (Enharm.)",
        shapes: mainResult.shapes
      });
    }
  }

  return results;
}

export function chordDistance(chordA: ChordShape, chordB: ChordShape): number {
  let dist = 0;
  for (let i = 0; i < 6; i++) {
    const fA = chordA.frets[i] === 'x' ? -1 : (chordA.frets[i] === '0' ? 0 : parseInt(chordA.frets[i] as string));
    const fB = chordB.frets[i] === 'x' ? -1 : (chordB.frets[i] === '0' ? 0 : parseInt(chordB.frets[i] as string));
    if (fA >= 0 && fB >= 0) dist += Math.abs(fA - fB);
    else dist += 2;
  }
  return dist;
}