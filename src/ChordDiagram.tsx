import React from 'react';
import ChordShape from './types/chord-shape';

const STRING_NAMES = ["e","b","g","d","a","e"];

interface ChordDiagramProps {
  frets: ChordShape['frets'];
  fingers: ChordShape['fingers'];
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ frets, fingers }) => {
  const invertedFrets = [...frets].reverse();
  const invertedFingers = [...fingers].reverse();

  return (
    <div className="font-mono border rounded p-2 text-sm bg-white shadow hover:shadow-md transition-shadow inline-block">
      {STRING_NAMES.map((stringName, i) => {
        const f = invertedFrets[i];
        const fi = invertedFingers[i];
        let fingerName = '';
        switch(fi) {
          case 1: fingerName='(Index)'; break;
          case 2: fingerName='(Middle)'; break;
          case 3: fingerName='(Ring)'; break;
          case 4: fingerName='(Pinky)'; break;
        }

        return (
          <div key={i} className="flex items-center">
            <span className="w-4 font-bold">{stringName}</span>
            <span className="mx-2">|</span>
            <span className="tabular-nums">{f}</span>
            {fingerName && <span className="ml-2 text-gray-600">{fingerName}</span>}
          </div>
        );
      })}
    </div>
  );
};
