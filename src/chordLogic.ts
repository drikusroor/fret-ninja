import G_CHORDS from "./data/chords";
import ChordShape, { ChordShapeRefined } from "./types/chord-shape";

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
  const root = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
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

function transposeChordShape(gShape: ChordShape, fromRoot: string, toRoot: string): ChordShapeRefined | null {

  const fromSemitone = NOTE_MAP[fromRoot];
  const toSemitone = NOTE_MAP[toRoot];
  const interval = (toSemitone - fromSemitone + 12) % 12;
  let newFrets: (string | number)[] = [];

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
    if (newFret < 0) return null;
    newFrets.push(newFret === 0 ? "0" : newFret.toString());
  }

  // If there are any chords of which all frets are never below 12, we should subtract 12 from all frets.
  const overTwelve = newFrets.every(f => f === 'x' || f !== 'x' && parseInt(f as string, 10) >= 12);

  if (overTwelve) {
    newFrets = newFrets.map(f => f === 'x' ? 'x' : (parseInt(f as string, 10) - 12).toString());
  }

  const isOpen = newFrets.some(f => f === '0');
  const refinedFingerPositions = isOpen ? gShape.fingersOpen : gShape.fingers;

  if (!refinedFingerPositions) return null;

  return { frets: newFrets, fingers: refinedFingerPositions };
}

function directMatch(quality: string): string[] {
  const keys = Object.keys(G_CHORDS);
  const query = `G${quality}`;
  return keys.filter(k => k.toLowerCase() === query.toLowerCase());
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

  let matchedChords = directMatch(quality);

  if (matchedChords.length === 0) {
    matchedChords = partialMatch(quality);
  }

  if (matchedChords.length === 0) return [];

  const results: { chordName: string; shapes: ChordShape[] }[] = [];

  matchedChords.forEach((gQuality) => {
    const displayName = root === "G" ? gQuality : root + gQuality.substring(1);

    const shapes = G_CHORDS[gQuality].shapes
      .map(shape => transposeChordShape(shape, "G", root))
      .filter(s => s !== null)
      .sort((a: ChordShapeRefined, b: ChordShapeRefined) => {
        const aFretsAVG = a!.frets.filter(f => f !== 'x').map(f => parseInt(f as string)).reduce((a, b) => a + b, 0) / a!.fingers.filter(f => f !== 0).length;
        const bFretsAVG = b!.frets.filter(f => f !== 'x').map(f => parseInt(f as string)).reduce((a, b) => a + b, 0) / b!.fingers.filter(f => f !== 0).length;

        return aFretsAVG - bFretsAVG;
      }) as ChordShapeRefined[];

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