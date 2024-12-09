import React from 'react';
import { ChordShapeRefined } from './types/chord-shape';
import { audioService } from './utils/audioService';

const STRING_NAMES = ["e", "b", "g", "d", "a", "e"];

interface ChordDiagramProps {
  frets: ChordShapeRefined['frets'];
  fingers: ChordShapeRefined['fingers'];
  onAdd?: () => void;  // Make onAdd optional
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ frets, fingers, onAdd }) => {
  const invertedFrets = [...frets].reverse();
  const invertedFingers = [...fingers].reverse();

  const handlePlay = () => {
    audioService.playChord(frets);
  };

  return (
    <div className="font-mono border rounded p-2 text-sm bg-white shadow hover:shadow-md transition-shadow inline-block relative group">
      <div className="absolute top-2 right-2 flex gap-2">
        {onAdd && (
          <button
            onClick={onAdd}
            title="Add to sequence"
            className="hidden group-hover:inline-block px-2 py-1 text-xs rounded-full w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            {/* utf plus icon */}
            &#x2b;
          </button>
        )}
        <button
          onClick={handlePlay}
          className="hidden group-hover:inline-block p-1 rounded-full w-8 h-8 bg-green-500 hover:bg-green-600 text-white transition-colors"
          title="Play chord (arpeggiated)"
        >
          {/* utf play icon */}
          ▶
        </button>
      </div>

      {STRING_NAMES.map((stringName, i) => {
        const f = invertedFrets[i];
        const fi = invertedFingers[i];
        let fingerName = '';
        switch (fi) {
          case 1: fingerName = '(Index)'; break;
          case 2: fingerName = '(Middle)'; break;
          case 3: fingerName = '(Ring)'; break;
          case 4: fingerName = '(Pinky)'; break;
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