export type ChordShape = {
    frets: (string | number)[];
    fingers: (number | 0)[];
  };
  
// Below is an expanded list of G-related chords, adding more alterations and multiple voicings.
// Note: The fingerings and shapes are illustrative. Guitar chord voicings can vary widely,
// and finger assignments are suggested but may be adjusted for personal comfort.
// Some shapes involve partial barres or less common fingerings. 
// These are intended as a reference starting point and may not be perfectly optimized for all hands.

const G_CHORDS: Record<string, ChordShape[]> = {
    "G": [
      { frets: ["3","2","0","0","0","3"], fingers: [2,1,0,0,0,3] },
      { frets: ["3","x","0","0","0","3"], fingers: [2,0,0,0,0,3] },
      { frets: ["x","x","5","4","3","3"], fingers: [0,0,4,3,2,1] }, // inversion
    ],
    "Gmaj7": [
      { frets: ["3","2","0","0","0","2"], fingers: [2,1,0,0,0,3] },
      { frets: ["x","x","4","4","3","2"], fingers: [0,0,3,4,2,1] },
      { frets: ["3","x","4","4","4","x"], fingers: [2,0,3,3,3,0] }, // barre style
    ],
    "G7": [
      { frets: ["3","2","0","0","0","1"], fingers: [3,2,0,0,0,1] },
      { frets: ["3","x","3","4","3","x"], fingers: [2,0,3,4,3,0] },
      { frets: ["x","x","5","7","6","7"], fingers: [0,0,2,4,3,4] }, // higher voicing
    ],
    "Gm7": [
      { frets: ["3","1","0","3","3","3"], fingers: [2,1,0,3,3,3] },
      { frets: ["3","1","3","3","3","x"], fingers: [2,1,3,3,3,0] },
      { frets: ["x","x","5","3","6","3"], fingers: [0,0,3,1,4,1] }, // different inversion
    ],
    "G9": [
      { frets: ["3","0","3","2","3","0"], fingers: [2,0,3,1,4,0] },
      { frets: ["3","2","3","2","3","x"], fingers: [2,1,3,1,4,0] },
    ],
    "Gm7(b5)": [
      { frets: ["3","1","3","3","2","x"], fingers: [2,1,3,4,1,0] },
      { frets: ["x","x","5","6","6","6"], fingers: [0,0,1,2,3,4] },
    ],
    "Gdim": [
      { frets: ["3","1","2","3","2","x"], fingers: [2,1,2,3,2,0] },
      { frets: ["x","x","2","3","2","3"], fingers: [0,0,1,3,2,4] },
    ],
    "Gaug": [
      { frets: ["3","2","1","0","0","3"], fingers: [3,2,1,0,0,4] },
      { frets: ["x","x","5","4","4","3"], fingers: [0,0,4,2,3,1] },
    ],
    "Gsus2": [
      { frets: ["3","0","0","0","3","3"], fingers: [2,0,0,0,3,4] },
      { frets: ["x","x","5","2","3","3"], fingers: [0,0,4,1,2,3] },
    ],
    "Gsus4": [
      { frets: ["3","3","0","0","1","3"], fingers: [3,4,0,0,1,4] },
      { frets: ["x","x","5","5","3","3"], fingers: [0,0,3,4,1,1] },
    ],
  
    // Additional Alterations and Extended Chords
    "G6": [
      { frets: ["3","2","0","0","0","0"], fingers: [3,2,0,0,0,0] }, // Open G6 (G B D G B E)
      { frets: ["3","x","2","4","3","x"], fingers: [2,0,1,4,3,0] }, // Another G6 voicing
      { frets: ["x","10","9","9","8","x"], fingers: [0,4,3,2,1,0] }, // Higher position G6
    ],
  
    "Gadd9": [
      { frets: ["3","2","0","2","3","3"], fingers: [3,2,0,1,4,4] }, 
      // G B D A D G - Gadd9 with a bit of a stretch. May use a barre on B and E strings with finger 4.
      { frets: ["3","0","0","2","3","3"], fingers: [2,0,0,1,3,4] },
      // G A D A D G (another form of Gadd9 with open strings)
    ],
  
    "Gmaj9": [
      { frets: ["3","x","4","4","3","5"], fingers: [2,0,3,4,1,4] }, 
      // G B F# A D (Gmaj9)
      { frets: ["x","10","9","11","10","12"], fingers: [0,3,2,4,1,4] },
      // Higher position Gmaj9
    ],
  
    "Gmaj6": [
      { frets: ["3","2","4","4","3","3"], fingers: [2,1,3,4,2,2] }, 
      // Often requires a partial barre. G B E G B G
      { frets: ["x","x","5","4","5","5"], fingers: [0,0,2,1,3,4] },
    ],
  
    "Gmaj13": [
      { frets: ["3","x","4","4","2","2"], fingers: [3,0,4,3,1,1] }, 
      // G B F# A E - Gmaj13 (barre on the last two strings)
      { frets: ["x","10","9","11","12","12"], fingers: [0,3,2,4,1,1] }, 
      // Another Gmaj13 higher up
    ],
  
    "G7sus2": [
      { frets: ["3","x","0","2","1","3"], fingers: [3,0,0,2,1,4] },
      { frets: ["x","x","5","5","3","1"], fingers: [0,0,3,4,2,1] },
    ],
  
    "G7b9": [
      { frets: ["3","2","3","1","0","1"], fingers: [3,2,4,1,0,1] }, 
      // Involves a tricky fingering, G7b9 with F (7th) and Ab(b9).
      { frets: ["3","x","3","4","3","4"], fingers: [2,0,3,4,3,4] }, 
      // Higher voicing with b9 tension
    ],
  
    "G7#9": [
      { frets: ["3","2","3","3","3","x"], fingers: [2,1,3,3,3,0] }, 
      // G7#9 (the Hendrix chord shape moved to G)
      { frets: ["x","10","9","10","11","x"], fingers: [0,3,2,4,1,0] },
    ],
  
    "G7b5": [
      { frets: ["3","x","3","4","2","x"], fingers: [2,0,3,4,1,0] }, 
      // G B Db F - G7b5
      { frets: ["x","x","5","6","4","5"], fingers: [0,0,2,3,1,4] },
    ],
  
    "G7#5": [
      { frets: ["3","x","3","4","4","x"], fingers: [2,0,3,4,4,0] },
      { frets: ["x","x","5","6","6","7"], fingers: [0,0,2,3,3,4] },
    ],
  
    "G7b13": [
      { frets: ["3","x","3","3","5","x"], fingers: [2,0,3,3,4,0] },
      { frets: ["x","x","5","6","7","8"], fingers: [0,0,1,2,3,4] },
    ],
  
    "G11": [
      { frets: ["3","2","3","3","1","x"], fingers: [3,2,4,4,1,0] },
      { frets: ["3","x","3","2","1","1"], fingers: [3,0,4,2,1,1] }, // Barre form
    ],
  
    "G13": [
      { frets: ["3","2","3","0","0","0"], fingers: [3,2,4,0,0,0] }, 
      // Simple G13 (no 9, no 11), G B F E
      { frets: ["3","x","3","4","5","5"], fingers: [2,0,3,4,3,4] },
    ],
  
    "Gdim7": [
      { frets: ["3","1","2","0","2","0"], fingers: [3,1,2,0,4,0] }, 
      // Gdim7 often repeats in minor 3rds
      { frets: ["x","x","2","3","2","3"], fingers: [0,0,1,3,2,4] },
      // Similar to Gdim above, but fully diminished 7th chord
    ],
  
    "Gm6": [
      { frets: ["3","1","2","3","0","x"], fingers: [3,1,2,4,0,0] },
      { frets: ["x","x","5","3","5","3"], fingers: [0,0,3,1,4,1] },
    ],
  
    "Gm9": [
      { frets: ["3","1","3","3","3","5"], fingers: [2,1,3,3,3,4] }, 
      { frets: ["x","x","5","3","6","5"], fingers: [0,0,2,1,4,3] },
    ],
  
    "Gm11": [
      { frets: ["3","1","3","3","1","x"], fingers: [3,1,4,4,1,0] }, 
      { frets: ["x","x","5","3","6","6"], fingers: [0,0,3,1,4,4] },
    ],
  
    "Gm13": [
      { frets: ["3","1","3","0","1","x"], fingers: [3,1,4,0,1,0] },
      { frets: ["x","x","5","3","5","5"], fingers: [0,0,3,1,4,4] },
    ],
  
    "GmMaj7": [
      { frets: ["3","1","2","3","2","x"], fingers: [3,1,2,4,2,0] }, 
      { frets: ["x","x","5","3","3","2"], fingers: [0,0,4,2,3,1] },
    ],
  
    "GmAdd9": [
      { frets: ["3","1","0","2","3","3"], fingers: [2,1,0,2,3,4] },
      // G Bb D A - Gmadd9
      { frets: ["x","x","5","3","6","3"], fingers: [0,0,3,1,4,1] }, 
    ],
  
    "Gm9(b5)": [
      { frets: ["3","1","3","2","3","x"], fingers: [3,1,4,2,4,0] },
      { frets: ["x","x","5","6","6","5"], fingers: [0,0,1,2,3,1] },
    ],
  
    "Gaug7": [
      { frets: ["3","2","3","4","4","x"], fingers: [2,1,3,4,4,0] },
      { frets: ["x","x","5","4","4","4"], fingers: [0,0,3,1,1,1] }, // Barre the top three
    ],
  
    "Gaug9": [
      { frets: ["3","2","3","2","4","x"], fingers: [2,1,3,1,4,0] },
      { frets: ["3","x","3","2","4","3"], fingers: [2,0,3,1,4,3] },
    ],
  
    "G6/9": [
      { frets: ["3","0","2","2","0","0"], fingers: [2,0,1,1,0,0] },
      // G B E A D - a nice G6/9 sound
      { frets: ["x","10","9","9","10","10"], fingers: [0,4,3,2,1,1] }, // higher voicing
    ]
  };
  
  export const NOTE_MAP: Record<string, number> = {
    "C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"F":5,"F#":6,"Gb":6,
    "G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11,

    // Alternative German naming
    "H":11,"H#":0,"Des":1,"Dis":3,"Es":3,"Fis":6,"Ges":6,
  };
  
  // Standard tuning
  const STRING_PITCHES = [28, 33, 38, 43, 47, 52];
  
  export function parseChordName(chordName: string): {root: string; quality: string} | null {
    const match = chordName.match(/^([A-G][b#]?)(.*)/);
    if (!match) return null;
    return { root: match[1], quality: match[2].trim() };
  }
  
  export function findGChordQuality(quality: string): string[] {
    const possibleQualities = Object.keys(G_CHORDS);
    // Let's match if the requested quality can be derived from G-based chords by replacing the root with G
    // Example: Cmaj7 -> maj7 should match "Gmaj7"
    // If no direct match, try partial matches.
    const directMatch = possibleQualities.filter(q => q.substring(1)===quality || q==="G"+quality);
    return directMatch;
  }
  
  function transposeChordShape(gShape: ChordShape, fromRoot: string, toRoot: string): ChordShape | null {
    const fromSemitone = NOTE_MAP[fromRoot];
    const toSemitone = NOTE_MAP[toRoot];
    const interval = (toSemitone - fromSemitone + 12) % 12;
  
    const newFrets: (string|number)[] = [];
  
    for (let i=0; i<gShape.frets.length; i++) {
      const f = gShape.frets[i];
      if (f === 'x') {
        newFrets.push('x');
        continue;
      }
      const oldFret = typeof f === 'string' ? parseInt(f,10) : f;
      const oldPitch = STRING_PITCHES[i] + oldFret;
      const newPitch = oldPitch + interval;
      const newFret = newPitch - STRING_PITCHES[i];
      if (newFret < 0 || newFret > 12) {
        return null;
      }
      newFrets.push(newFret === 0 ? "0" : newFret.toString());
    }
  
    return { frets: newFrets, fingers: gShape.fingers };
  }
  
  export function getChordShapes(chordName: string): ChordShape[] {
    const parsed = parseChordName(chordName);
    if (!parsed) return [];
    const {root, quality} = parsed;
  
    const matches = findGChordQuality(quality);
    if (matches.length===0) return [];
  
    let result: ChordShape[] = [];
    for (const gQuality of matches) {
      if (root === "G") {
        // Just return shapes for this quality
        result = result.concat(G_CHORDS[gQuality]);
      } else {
        // Transpose all shapes
        for (const shape of G_CHORDS[gQuality]) {
          const transposed = transposeChordShape(shape, "G", root);
          if (transposed) result.push(transposed);
        }
      }
    }
  
    return result;
  }
  
  export function chordDistance(chordA: ChordShape, chordB: ChordShape): number {
    let dist = 0;
    for (let i=0; i<6; i++) {
      const fA = chordA.frets[i]==='x'?-1:(chordA.frets[i]==='0'?0:parseInt(chordA.frets[i] as string));
      const fB = chordB.frets[i]==='x'?-1:(chordB.frets[i]==='0'?0:parseInt(chordB.frets[i] as string));
      if (fA>=0 && fB>=0) {
        dist += Math.abs(fA - fB);
      } else {
        dist += 2; // penalty
      }
    }
    return dist;
  }
  