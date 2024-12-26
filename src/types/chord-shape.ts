export type Fret = number | string;
export type Finger = number | string;

type ChordShape = {
    frets: Fret[];
    fingers?: Finger[];
    fingersOpen?: Finger[];
};

export type ChordShapeRefined = {
    frets: Fret[];
    fingers: Finger[];
}

export default ChordShape;