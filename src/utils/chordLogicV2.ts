// chordLogicV2.ts

export type Chord = {
  root: string;
  chordType: string;
  alterations: string[];
  bass?: string;
};

export type ChordNotes = {
  notes: number[];
  bass?: number;
  name: string;
  root: string;
  chordType: string;
  alterations: string[];
};

export type ChordDatabaseEntry = {
  name: string;
  root: string;
  chordType: string;
  alterations: string[];
  normalizedNotes: number[]; // Sorted and unique pitch classes
};

export type String = {
  note: number;
  octave: number;
};

export type Instrument = {
  name: string;
  tuning: String[];
};

export const standardTuning: String[] = [
  { note: 4, octave: 2 }, // E2
  { note: 9, octave: 2 }, // A2
  { note: 2, octave: 3 }, // D3
  { note: 7, octave: 3 }, // G3
  { note: 11, octave: 3 }, // B3
  { note: 4, octave: 4 }, // E4
];

export const standardGuitar: Instrument = {
  name: "Guitar",
  tuning: standardTuning,
};

export type ChordShape = {
  frets: (number | "x")[]; // 'x' represents a muted string
  fingers?: (number | 0)[]; // Optional finger positions (not implemented)
  fingersOpen?: (number | 0)[]; // Optional open string indicators (not implemented)
};

/**
 * Mapping from note names to their chromatic numbers.
 */
const NOTE_TO_NUMBER: { [key: string]: number } = {
  "B#": 0,
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4, // E and Fb are enharmonic
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11, // B and Cb are enharmonic
};

/**
 * Defines the intervals (in semitones) for various chord types.
 */
const INTERVALS: { [key: string]: number[] } = {
  // Triads
  "": [0, 4, 7], // Major
  m: [0, 3, 7], // Minor
  dim: [0, 3, 6], // Diminished
  aug: [0, 4, 8], // Augmented

  // Seventh chords
  "7": [0, 4, 7, 10], // Dominant 7
  maj7: [0, 4, 7, 11], // Major 7
  m7: [0, 3, 7, 10], // Minor 7
  mMaj7: [0, 3, 7, 11], // Minor Major 7
  dim7: [0, 3, 6, 9], // Diminished 7
  halfDim7: [0, 3, 6, 10], // Half-Diminished 7

  // Extended chords
  "9": [0, 4, 7, 10, 14], // Dominant 9
  maj9: [0, 4, 7, 11, 14], // Major 9
  m9: [0, 3, 7, 10, 14], // Minor 9

  // Sixth chords
  "6": [0, 4, 7, 9], // Major 6
  m6: [0, 3, 7, 9], // Minor 6

  // Add more chord types as needed
};

/**
 * Defines how to apply alterations to chord intervals.
 */
const ALTERATIONS: { [key: string]: (intervals: number[]) => number[] } = {
  b5: (intervals) =>
    intervals.map((interval) => (interval === 7 ? 6 : interval)),
  "#5": (intervals) =>
    intervals.map((interval) => (interval === 7 ? 8 : interval)),
  b9: (intervals) => {
    const ninth = 14 - 12; // 2 semitones
    if (!intervals.includes(ninth)) intervals.push(ninth);
    return intervals;
  },
  "#9": (intervals) => {
    const ninth = 14 - 12 + 1; // 3 semitones
    if (!intervals.includes(ninth)) intervals.push(ninth);
    return intervals;
  },
  // Add more alterations as needed
};

/**
 * Parses the chord name into its components: root, chordType, alterations, and optional bass.
 * @param chordName The chord name string.
 * @returns A Chord object containing parsed components or null if invalid.
 */
function parseChordName(chordName: string): Chord | null {
  const regex = /^([A-G](?:#|b)?)([^\/]*)(?:\/([A-G](?:#|b)?))?$/;
  const match = chordName.match(regex);
  if (!match) {
    return null;
  }

  const root = match[1];
  let chordDescriptor = match[2];
  const bass = match[3];

  // Extract alterations within parentheses, e.g., Fmaj7(b5)
  const alterationRegex = /\(([^)]+)\)/;
  const alterationMatch = chordDescriptor.match(alterationRegex);
  let alterations: string[] = [];
  if (alterationMatch) {
    const alterationStr = alterationMatch[1];
    // Split alterations by comma or space
    alterations = alterationStr.split(/[\s,]+/);
    // Remove the alteration part from chordDescriptor
    chordDescriptor = chordDescriptor.replace(alterationRegex, "");
  }

  // Trim any remaining whitespace
  chordDescriptor = chordDescriptor.trim();

  return {
    root,
    chordType: chordDescriptor,
    alterations,
    bass,
  };
}

/**
 * Retrieves the chromatic number for a given note.
 * @param note The note string (e.g., "C", "C#", "Db").
 * @returns The chromatic number (0-11).
 */
function getChromaticNumber(note: string): number {
  const num = NOTE_TO_NUMBER[note];
  if (num === undefined) {
    throw new Error(`Invalid note: ${note}`);
  }
  return num;
}

/**
 * Retrieves the intervals for a given chord type.
 * @param chordType The type of the chord (e.g., "m7", "maj7").
 * @returns An array of intervals in semitones.
 */
function getChordIntervals(chordType: string): number[] {
  if (INTERVALS.hasOwnProperty(chordType)) {
    return [...INTERVALS[chordType]];
  } else {
    // Attempt to find the closest match
    for (const key in INTERVALS) {
      if (chordType.startsWith(key)) {
        return [...INTERVALS[key]];
      }
    }
    throw new Error(`Unsupported chord type: ${chordType}`);
  }
}

/**
 * Applies alterations to the chord intervals.
 * @param intervals The original intervals.
 * @param alterations The list of alterations to apply.
 * @returns The modified intervals.
 */
function applyAlterations(
  intervals: number[],
  alterations: string[]
): number[] {
  let modified = [...intervals];
  alterations.forEach((alter) => {
    if (ALTERATIONS.hasOwnProperty(alter)) {
      modified = ALTERATIONS[alter](modified);
    } else {
      console.warn(`Unsupported alteration: ${alter}`);
    }
  });
  // Remove duplicates and sort
  modified = Array.from(new Set(modified)).sort((a, b) => a - b);
  return modified;
}

/**
 * Converts a chord name to an object containing chord information and its notes.
 * @param chordName The chord name string (e.g., "Gm7", "C6/D").
 * @param normalized Optional parameter to normalize notes within 0-11.
 * @returns A ChordNotes object containing the chord's details and note numbers, or null if invalid.
 */
export function chordToNotes(
  chordName: string,
  normalized: boolean = false
): ChordNotes | null {
  // Parse the chord name
  const chord = parseChordName(chordName);

  if (!chord) {
    console.warn(`Invalid chord name: ${chordName}`);
    return null;
  }

  const rootNum = getChromaticNumber(chord.root);

  // Get the base intervals for the chord type
  let intervals: number[];
  try {
    intervals = getChordIntervals(chord.chordType);
  } catch (error) {
    throw new Error(`Error parsing chord type: ${(error as Error).message}`);
  }

  // Apply any alterations
  if (chord.alterations.length > 0) {
    intervals = applyAlterations(intervals, chord.alterations);
  }

  // Calculate note numbers based on root
  let notes: number[] = intervals.map((interval) => rootNum + interval);

  // Handle bass note if specified
  let bassNum: number | undefined;
  if (chord.bass) {
    bassNum = getChromaticNumber(chord.bass);
    // Remove any existing occurrence of the bass note (modulo 12 if normalized)
    const bassMod = normalized ? bassNum % 12 : bassNum;
    notes = notes.filter((n) =>
      normalized ? n % 12 !== bassMod : n !== bassNum
    );
    // Prepend the bass note
    notes.unshift(bassNum);
  }

  // Normalize if required
  if (normalized) {
    notes = notes.map((n) => n % 12);
  }

  // If bass is specified and normalized, ensure it's within 0-11
  if (bassNum !== undefined && normalized) {
    bassNum = bassNum % 12;
  }

  return {
    notes,
    bass: bassNum,
    name: chordName,
    root: chord.root,
    chordType: chord.chordType,
    alterations: chord.alterations,
  };
}

/**
 * Generates a chord database containing all possible chords based on the defined chord types and roots.
 * @returns An array of ChordDatabaseEntry objects.
 */
function generateChordDatabase(): ChordDatabaseEntry[] {
  const chordDatabase: ChordDatabaseEntry[] = [];
  const roots = Object.keys(NOTE_TO_NUMBER).filter(
    (note, index, self) => self.indexOf(note) === index
  ); // Unique roots

  const chordTypes = Object.keys(INTERVALS);

  roots.forEach((root) => {
    chordTypes.forEach((chordType) => {
      // Skip if chordType is undefined or unsupported
      if (!INTERVALS.hasOwnProperty(chordType)) return;

      // Base chord without alterations
      const baseIntervals = INTERVALS[chordType];
      const rootNum = getChromaticNumber(root);
      const chordNotes = baseIntervals.map((interval) => rootNum + interval);
      const normalizedNotes = chordNotes
        .map((n) => n % 12)
        .sort((a, b) => a - b);
      const uniqueNormalizedNotes = Array.from(new Set(normalizedNotes));

      const name = chordType ? `${root}${chordType}` : `${root}`; // e.g., C, Cm, Cmaj7

      chordDatabase.push({
        name,
        root,
        chordType,
        alterations: [],
        normalizedNotes: uniqueNormalizedNotes,
      });

      // Handle chords with alterations if any alterations are defined
      Object.keys(ALTERATIONS).forEach((alter) => {
        const alteredIntervals = ALTERATIONS[alter](baseIntervals.slice());
        const alteredNotes = alteredIntervals.map(
          (interval) => rootNum + interval
        );
        const normalizedAlteredNotes = alteredNotes
          .map((n) => n % 12)
          .sort((a, b) => a - b);
        const uniqueNormalizedAlteredNotes = Array.from(
          new Set(normalizedAlteredNotes)
        );

        const alteredName = chordType
          ? `${root}${chordType}(${alter})`
          : `${root}(${alter})`; // e.g., Cmaj7(b5)

        chordDatabase.push({
          name: alteredName,
          root,
          chordType,
          alterations: [alter],
          normalizedNotes: uniqueNormalizedAlteredNotes,
        });
      });
    });
  });

  return chordDatabase;
}

/**
 * Finds all interchangeable chords that share the same set of notes as the given chord.
 * @param chordName The chord name string (e.g., "Gm7", "C6/D").
 * @param normalized Optional parameter to normalize notes within 0-11. Defaults to true.
 * @returns An array of ChordNotes objects representing interchangeable chords.
 */
export function findInterchangeableChords(
  chordName: string,
  normalized: boolean = true
): ChordNotes[] {
  // Generate the chord database
  const chordDatabase = generateChordDatabase();

  // Get the notes of the given chord
  const targetChord = chordToNotes(chordName, normalized);

  if (!targetChord) {
    return [];
  }

  // Extract unique pitch classes and sort
  const targetNotesSet = Array.from(new Set(targetChord.notes)).sort(
    (a, b) => a - b
  );

  // Find all chords in the database that have the same normalizedNotes
  const interchangeableChords: ChordNotes[] = chordDatabase
    .filter((chord) => {
      // Compare normalized pitch class sets
      if (chord.normalizedNotes.length !== targetNotesSet.length) return false;
      for (let i = 0; i < chord.normalizedNotes.length; i++) {
        if (chord.normalizedNotes[i] !== targetNotesSet[i]) return false;
      }
      return true;
    })
    .map((chord) => {
      // Construct chord name with bass if necessary
      if (targetChord.bass !== undefined) {
        return {
          ...(chordToNotes(chord.name, normalized) as ChordNotes),
          bass: targetChord.bass, // Ensure same bass
        };
      } else {
        return chordToNotes(chord.name, normalized) as ChordNotes;
      }
    })
    .filter((chord): chord is ChordNotes => chord !== null); // Type guard

  // If a bass note is specified in the original chord, filter results to have the same bass
  if (targetChord.bass !== undefined) {
    return interchangeableChords.filter(
      (chord) => chord.bass === targetChord.bass
    );
  }

  return interchangeableChords;
}

/**
 * Finds possible chord shapes for a given chord and instrument.
 * @param chordName The chord name string (e.g., "Gm7", "C6/D").
 * @param instrument The instrument object with tuning information.
 * @param limit Optional parameter to limit the number of chord shapes returned. Defaults to 5.
 * @returns An array of ChordShape objects representing possible chord shapes.
 */
export function findChordShapes(
  chordName: string,
  instrument: Instrument,
  limit: number = 5
): ChordShape[] {
  const chordNotesObj = chordToNotes(chordName, true); // Normalize notes for comparison
  if (!chordNotesObj) {
    console.warn(`Cannot find notes for chord: ${chordName}`);
    return [];
  }

  const requiredNotes = chordNotesObj.notes; // Array of numbers (0-11)
  const bassNote = chordNotesObj.bass; // Number (0-11) or undefined

  // For each string, list possible frets that can produce required notes or 'x' to mute
  const stringFretOptions: (number | "x")[][] = instrument.tuning.map(
    (string) => {
      const openNote = string.note % 12;
      const options: (number | "x")[] = [];

      // List frets 0-12 that produce required notes
      for (let fret = 0; fret <= 12; fret++) {
        const noteAtFret = (openNote + fret) % 12;
        if (requiredNotes.includes(noteAtFret)) {
          options.push(fret);
        }
      }

      // Always allow 'x' to mute the string
      options.push("x");

      return options;
    }
  );

  const results: ChordShape[] = [];

  /**
   * Recursive backtracking function to find chord shapes.
   * @param currentFretList The current list of frets assigned to strings.
   * @param currentNotesCovered The set of chord notes covered so far.
   * @param stringIndex The current string being processed.
   * @param minFret The lowest fret assigned so far (excluding 0).
   * @param maxFret The highest fret assigned so far.
   * @param bassAssigned Whether the bass note has been assigned.
   */
  function backtrack(
    currentFretList: (number | "x")[],
    currentNotesCovered: Set<number>,
    stringIndex: number,
    minFret: number | null,
    maxFret: number | null,
    bassAssigned: boolean
  ) {
    if (results.length >= limit) {
      return;
    }

    if (stringIndex === instrument.tuning.length) {
      // All strings processed
      // Check if all required notes are covered
      const allNotesCovered = requiredNotes.every((note) =>
        currentNotesCovered.has(note)
      );

      // Check bass note condition
      let bassCondition = true;
      if (bassNote !== undefined) {
        // Find the lowest played string (lowest index)
        for (let i = 0; i < currentFretList.length; i++) {
          const fret = currentFretList[i];
          if (fret === "x") continue;
          const string = instrument.tuning[i];
          const note = (string.note + (fret as number)) % 12;
          if (note === bassNote) {
            break;
          } else {
            bassCondition = false;
            break;
          }
        }
      }

      if (allNotesCovered && bassCondition) {

        const fingers = getChordFingers(currentFretList);

        results.push({
          frets: [...currentFretList],
          fingers,
          name: chordName,
        });
      }
      return;
    }

    const options = stringFretOptions[stringIndex];

    for (const option of options) {
      // Prune if already exceeded the fret limit
      if (typeof option === "number" && option > 12) continue;

      // Initialize new min and max frets
      let newMinFret = minFret;
      let newMaxFret = maxFret;

      let isBassAssignment = false;

      // Check if this option assigns the bass note
      if (
        bassNote !== undefined &&
        !bassAssigned &&
        typeof option === "number"
      ) {
        const string = instrument.tuning[stringIndex];
        const note = (string.note + option) % 12;
        if (note === bassNote) {
          isBassAssignment = true;
        }
      }

      if (isBassAssignment) {
        // Assign the bass note to this string
        // Update min and max frets
        if (option !== 0) {
          newMinFret =
            newMinFret === null ? option : Math.min(newMinFret, option);
          newMaxFret =
            newMaxFret === null ? option : Math.max(newMaxFret, option);
        }

        // Check fret span
        if (newMinFret !== null && newMaxFret !== null) {
          const fretSpan = newMaxFret - newMinFret;
          if (fretSpan > 4) {
            continue; // Exceeds maximum fret span
          }
        }
      } else {
        // Not assigning the bass note here
        // Update min and max frets
        if (typeof option === "number" && option !== 0) {
          newMinFret =
            newMinFret === null ? option : Math.min(newMinFret, option);
          newMaxFret =
            newMaxFret === null ? option : Math.max(newMaxFret, option);

          // Check fret span
          if (newMinFret !== null && newMaxFret !== null) {
            const fretSpan = newMaxFret - newMinFret;
            if (fretSpan > 4) {
              continue; // Exceeds maximum fret span
            }
          }
        }
      }

      const newFretList = [...currentFretList, option];
      const newNotesCovered = new Set(currentNotesCovered);

      if (option !== "x") {
        const string = instrument.tuning[stringIndex];
        const note = (string.note + (option as number)) % 12;
        newNotesCovered.add(note);
      }

      // Early pruning: check if it's possible to cover remaining notes with remaining strings
      const remainingStrings = instrument.tuning.length - (stringIndex + 1);
      const remainingNotes = requiredNotes.filter(
        (note) => !newNotesCovered.has(note)
      );

      // Each remaining string can cover at most 2 notes (assumption)
      if (remainingNotes.length > remainingStrings * 2) {
        continue;
      }

      // Recursively backtrack
      backtrack(
        newFretList,
        newNotesCovered,
        stringIndex + 1,
        newMinFret,
        newMaxFret,
        bassAssigned || isBassAssignment
      );

      if (results.length >= limit) {
        return;
      }
    }
  }

  // Start backtracking with initial minFret and maxFret as null, and bassAssigned as false
  backtrack([], new Set<number>(), 0, null, null, false);

  return results;
}

export function getChordFingers(frets: (number | "x")[]): (number | 0 | "x")[] {
  console.log("Frets:", frets);

  // 1 = Index, 2 = Middle, 3 = Ring, 4 = Pinky

  // Create a parallel array for finger assignments; use 'x' to indicate unassigned.
  const fingers = new Array(frets.length).fill("x");

  // Figure out the lowest fret (ignore "x" and 0)
  const minFret = frets.reduce((min, fret) => {
    if (fret === "x" || fret === 0) return min;
    return Math.min(min, fret as number);
  }, Infinity);

  // Count how many times that lowest fret appears
  const minFretCount = frets.filter((fret) => fret === minFret).length;

  // Check if it’s potentially a barre chord
  const hasBarrePotential = minFretCount > 1 && minFret !== Infinity;
  const indexOfFirstMinFret = frets.indexOf(minFret);
  const stringsAboveIndex = frets.slice(indexOfFirstMinFret + 1);
  const isBarreChord =
    hasBarrePotential && stringsAboveIndex.every((fret) => fret !== 0);

  // 1) Assign Index finger (1)
  if (minFret !== Infinity && minFret !== 0 && minFret !== "x") {
    if (isBarreChord) {
      // Barre chord: index finger on all strings that have this min fret
      frets.forEach((fret, i) => {
        if (fret === minFret) {
          fingers[i] = 1;
        }
      });
    } else {
      fingers[indexOfFirstMinFret] = 1;
    }
  }

  // 2) Assign Middle (2), Ring (3), Pinky (4), in that order
  //    We'll just do a simple approach: pick unassigned notes in ascending fret order.
  for (const finger of [2, 3, 4]) {
    assignFinger(finger, frets, fingers);
  }

  console.log("Assigned Fingers:", fingers);

  // Finally, preserve "x" if the original fret was "x"; convert unassigned to "x" or 0 for open strings
  return fingers.map((finger, i) => {
    // If the original chord has "x", keep it muted in the output
    if (frets[i] === "x") return "x";

    // If the fret is open (0) but never assigned a finger, use 0
    if (finger === "x" && frets[i] === 0) return 0;

    // Unassigned but not open => treat as "x" (i.e. not played)
    if (finger === "x") return "x";

    // Otherwise, cast finger to number
    return finger as number;
  });
}

/**
 * Assign a single finger (2=middle,3=ring,4=pinky) to the *left-most, lowest fret*
 * among the remaining unassigned notes. Then stop (only assign one note).
 */
function assignFinger(
  fingerValue: number,
  frets: (number | "x")[],
  fingers: (number | string)[]
) {
  // Gather indices of unassigned notes (non-"x"/0 in frets, but still "x" in fingers)
  const unassignedIndices: number[] = [];
  for (let i = 0; i < frets.length; i++) {
    if (frets[i] !== "x" && frets[i] !== 0 && fingers[i] === "x") {
      unassignedIndices.push(i);
    }
  }
  if (unassignedIndices.length === 0) return;

  // Sort them by ascending fret, then by ascending string index
  unassignedIndices.sort((a, b) => {
    const fretA = frets[a] as number;
    const fretB = frets[b] as number;
    if (fretA === fretB) {
      return a - b; // tie-break by the lower string index
    }
    return fretA - fretB;
  });

  // Assign this finger to the first (lowest fret, left-most) unassigned note
  const chosenIdx = unassignedIndices[0];
  fingers[chosenIdx] = fingerValue;
}
