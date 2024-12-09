type ChordShape = {
    frets: (string | number)[];
    fingers?: (number | 0)[];
    fingersOpen?: (number | 0)[];
};

export type ChordShapeRefined = {
    frets: (string | number)[];
    fingers: (number | 0)[];
}

export default ChordShape;