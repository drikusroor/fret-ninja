import React from 'react';
import { ChordShape } from './chordLogic';

// We'll display from top to bottom: e (high), b, g, d, a, e (low)
const STRING_NAMES = ["e","b","g","d","a","e"]; // high e at top, low E at bottom
// But in our logic low E is index 0, high e is index 5
// So we must invert this order when displaying.

interface ChordDiagramProps {
  frets: ChordShape['frets'];
  fingers: ChordShape['fingers'];
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ frets, fingers }) => {
  // frets[0] corresponds to the low E string
  // We must invert the array to display high e at top
  const invertedFrets = [...frets].reverse();
  const invertedFingers = [...fingers].reverse();

  return (
    <div className="font-mono mb-5 border p-2 inline-block text-sm">
      {STRING_NAMES.map((stringName, i) => {
        const f = invertedFrets[i];
        const fi = invertedFingers[i];
        let displayFret = f;
        if (f==='0') displayFret = '0';
        if (f==='x') displayFret = 'x';
        else if (f!=='x' && f!=='0') displayFret = f;
        
        // Optional: show finger symbol next to fret
        let fingerName = '';
        switch(fi) {
          case 1: fingerName='(Index)'; break;
          case 2: fingerName='(Middle)'; break;
          case 3: fingerName='(Ring)'; break;
          case 4: fingerName='(Pinky)'; break;
        }

        return (
          <div key={i} className="flex">
            <span className="w-4">{stringName}</span>
            <span className="mx-2">|</span>
            <span>{displayFret} {fingerName}</span>
          </div>
        );
      })}
    </div>
  );
};
