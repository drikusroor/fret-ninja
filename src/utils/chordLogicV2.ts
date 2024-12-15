// chordLogicV2.ts

type Chord = {
    root: string;
    chordType: string;
    alterations: string[];
    bass?: string;
  };
  
  type ChordNotes = {
    notes: number[];
    bass?: number;
    name: string;
    root: string;
    chordType: string;
    alterations: string[];
  };
  
  type ChordDatabaseEntry = {
    name: string;
    root: string;
    chordType: string;
    alterations: string[];
    normalizedNotes: number[]; // Sorted and unique pitch classes
  };
  
  /**
   * Mapping from note names to their chromatic numbers.
   */
  const NOTE_TO_NUMBER: { [key: string]: number } = {
    'B#': 0,
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    Fb: 4, // E and Fb are enharmonic
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11,
    Cb: 11, // B and Cb are enharmonic
  };
  
  /**
   * Defines the intervals (in semitones) for various chord types.
   */
  const INTERVALS: { [key: string]: number[] } = {
    // Triads
    '': [0, 4, 7], // Major
    m: [0, 3, 7], // Minor
    dim: [0, 3, 6], // Diminished
    aug: [0, 4, 8], // Augmented
  
    // Seventh chords
    '7': [0, 4, 7, 10], // Dominant 7
    maj7: [0, 4, 7, 11], // Major 7
    m7: [0, 3, 7, 10], // Minor 7
    mMaj7: [0, 3, 7, 11], // Minor Major 7
    dim7: [0, 3, 6, 9], // Diminished 7
    halfDim7: [0, 3, 6, 10], // Half-Diminished 7
  
    // Extended chords
    '9': [0, 4, 7, 10, 14], // Dominant 9
    maj9: [0, 4, 7, 11, 14], // Major 9
    m9: [0, 3, 7, 10, 14], // Minor 9
  
    // Sixth chords
    '6': [0, 4, 7, 9], // Major 6
    m6: [0, 3, 7, 9], // Minor 6
  
    // Add more chord types as needed
  };
  
  /**
   * Defines how to apply alterations to chord intervals.
   */
  const ALTERATIONS: { [key: string]: (intervals: number[]) => number[] } = {
    'b5': (intervals) =>
      intervals.map((interval) => (interval === 7 ? 6 : interval)),
    '#5': (intervals) =>
      intervals.map((interval) => (interval === 7 ? 8 : interval)),
    'b9': (intervals) => {
      const ninth = 14 - 12; // 2 semitones
      if (!intervals.includes(ninth)) intervals.push(ninth);
      return intervals;
    },
    '#9': (intervals) => {
      const ninth = 14 - 12 + 1; // 3 semitones
      if (!intervals.includes(ninth)) intervals.push(ninth);
      return intervals;
    },
    // Add more alterations as needed
  };
  
  /**
   * Parses the chord name into its components: root, chordType, alterations, and optional bass.
   * @param chordName The chord name string.
   * @returns A Chord object containing parsed components.
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
      chordDescriptor = chordDescriptor.replace(alterationRegex, '');
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
  function applyAlterations(intervals: number[], alterations: string[]): number[] {
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
   * @returns A ChordNotes object containing the chord's details and note numbers.
   */
  export function chordToNotes(
    chordName: string,
    normalized: boolean = false
  ): ChordNotes | null {
    // Parse the chord name
    const chord = parseChordName(chordName);

    if (!chord) {
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
      notes = notes.filter((n) => (normalized ? n % 12 !== bassMod : n !== bassNum));
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
        const normalizedNotes = chordNotes.map((n) => n % 12).sort((a, b) => a - b);
        const uniqueNormalizedNotes = Array.from(new Set(normalizedNotes));
  
        const name = chordType
          ? `${root}${chordType}`
          : `${root}`; // e.g., C, Cm, Cmaj7
  
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
          const alteredNotes = alteredIntervals.map((interval) => rootNum + interval);
          const normalizedAlteredNotes = alteredNotes.map((n) => n % 12).sort((a, b) => a - b);
          const uniqueNormalizedAlteredNotes = Array.from(new Set(normalizedAlteredNotes));
  
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
    const targetNotesSet = Array.from(new Set(targetChord.notes)).sort((a, b) => a - b);
  
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
            ...chordToNotes(chord.name, normalized),
            bass: targetChord.bass, // Ensure same bass
          };
        } else {
          return chordToNotes(chord.name, normalized);
        }
      });
  
    // If a bass note is specified in the original chord, filter results to have the same bass
    if (targetChord.bass !== undefined) {
      return interchangeableChords.filter(
        (chord) => chord.bass === targetChord.bass
      );
    }
  
    return interchangeableChords;
  }
  
