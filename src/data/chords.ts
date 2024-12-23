import ChordShape from "../types/chord-shape";

const G_CHORDS: Record<string, { notes: string[], shapes: ChordShape[] }> = {
    G: {
        notes: ["G", "B", "D"],
        shapes: [
            { frets: ["3", "2", "0", "0", "0", "3"], fingersOpen: [2, 1, 0, 0, 0, 3], fingers: [3, 2, 1, 1, 1, 4] },
            { frets: ["3", "5", "5", "4", "3", "3"], fingers: [1, 3, 4, 2, 1, 1], fingersOpen: [0, 3, 4, 1, 0, 0] },
            { frets: ["3", "x", "0", "0", "0", "3"], fingersOpen: [2, 0, 0, 0, 0, 3], fingers: [3, 0, 1, 1, 1, 4] },
            { frets: ["x", "x", "5", "4", "3", "3"], fingers: [0, 0, 4, 3, 2, 1], fingersOpen: [0, 0, 2, 3, 0, 0] },
            { frets: ["x", "10", "9", "7", "8", "7"], fingers: [0, 4, 3, 1, 2, 1] },
        ],
    },
    Gm: {
        notes: ["G", "Bb", "D"],
        shapes: [
            { frets: ["3", "1", "0", "0", "3", "3"], fingersOpen: [2, 1, 0, 0, 3, 4] },
            { frets: ["3", "x", "0", "3", "3", "3"], fingersOpen: [2, 0, 0, 3, 3, 3] },
            { frets: ["x", "x", "5", "3", "3", "3"], fingers: [0, 0, 4, 2, 1, 1], fingersOpen: [0, 0, 3, 0, 0, 0] },
            { frets: ["3", "5", "5", "3", "3", "3"], fingers: [1, 3, 4, 1, 1, 1], fingersOpen: [0, 2, 3, 0, 0, 0] },
            { frets: ["x", "10", "12", "12", "11", "10"], fingersOpen: [0, 0, 3, 4, 1, 0], fingers: [0, 1, 3, 4, 2, 1] },
        ],
    },
    Gmaj7: {
        notes: ["G", "B", "D", "F#"],
        shapes: [
            { frets: ["3", "2", "0", "0", "0", "2"], fingers: [2, 1, 0, 0, 0, 3] },
            { frets: ["x", "x", "4", "4", "3", "2"], fingers: [0, 0, 3, 4, 2, 1] },
            { frets: ["3", "x", "4", "4", "3", "x"], fingers: [2, 0, 3, 3, 2, 0] },
        ],
    },
    G7: {
        notes: ["G", "B", "D", "F"],
        shapes: [
            { frets: ["3", "2", "0", "0", "0", "1"], fingersOpen: [3, 2, 0, 0, 0, 1] },
            { frets: ["3", "5", "3", "4", "6", "3"], fingers: [1, 3, 1, 2, 4, 1], fingersOpen: [0, 2, 0, 1, 3, 0] },
            { frets: ["3", "x", "3", "4", "3", "x"], fingers: [2, 0, 3, 4, 3, 0], fingersOpen: [0, 0, 1, 2, 1, 0] },
            { frets: ["x", "x", "5", "7", "6", "7"], fingers: [0, 0, 2, 3, 4, 3], fingersOpen: [0, 0, 0, 2, 1, 3] },
        ],
    },
    Gm7: {
        notes: ["G", "Bb", "D", "F"],
        shapes: [
            { frets: ["3", "1", "0", "3", "3", "3"], fingers: [2, 1, 0, 3, 3, 3] },
            { frets: ["3", "1", "3", "3", "3", "x"], fingers: [2, 1, 3, 3, 3, 0] },
            { frets: ["x", "x", "5", "3", "6", "3"], fingers: [0, 0, 3, 1, 4, 1] }, // inversion
            { frets: ["3", "5", "3", "3", "3", "3"], fingers: [1, 3, 1, 1, 1, 1], fingersOpen: [0, 2, 0, 0, 0, 0] },
            { frets: ["3", "x", "3", "3", "3", "x"], fingers: [2, 0, 2, 2, 2, 0], fingersOpen: [0, 0, 0, 0, 0, 0] },
            { frets: ["x", "10", "12", "10", "11", "10"], fingers: [0, 1, 3, 1, 2, 1], fingersOpen: [0, 0, 2, 0, 1, 0] },
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
            { frets: ["3", "5", "2", "4", "x", "x"], fingers: [3, 2, 1, 4, 0, 0] },
            { frets: ["3", "x", "2", "4", "3", "x"], fingers: [2, 0, 1, 4, 3, 0] },
            { frets: ["x", "10", "x", "9", "11", "10"], fingers: [0, 2, 0, 1, 4, 3] },
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

export default G_CHORDS;