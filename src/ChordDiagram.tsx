import React from "react";
import { ChordShapeRefined } from "./types/chord-shape";
import { audioService } from "./utils/audioService";

const STRING_NAMES = ["e", "b", "g", "d", "a", "e"];

interface ChordDiagramProps {
  frets: ChordShapeRefined["frets"];
  fingers: ChordShapeRefined["fingers"];
  onAdd?: () => void; // Make onAdd optional
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  frets,
  fingers = [],
  onAdd,
}) => {
  const invertedFrets = [...frets].reverse();
  const invertedFingers = [...fingers].reverse();

  const hardToPlay =
    fingers
      .filter((f) => typeof f === "number")
      .reduce((acc, f) => acc + f, 0) <= 0;

  const handlePlay = () => {
    audioService.playChord(frets);
  };

  return (
    <div className="font-mono bg-white rounded-lg shadow-lg p-4 relative group border border-gray-300">
      <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onAdd && (
          <button
            onClick={onAdd}
            title="Add to sequence"
            className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            +
          </button>
        )}
        <button
          onClick={handlePlay}
          className="hidden group-hover:inline-block p-1 rounded-full w-8 h-8 bg-green-500 hover:bg-green-600 text-white transition-colors"
          title="Play chord (arpeggiated)"
        >
          {/* utf play icon */}▶
        </button>
      </div>

      <div className="space-y-2">
        {STRING_NAMES.map((stringName, i) => {
          const f = invertedFrets[i];
          const fi = invertedFingers[i];
          let fingerName = "";
          switch (fi) {
            case 1:
              fingerName = "(Index)";
              break;
            case 2:
              fingerName = "(Middle)";
              break;
            case 3:
              fingerName = "(Ring)";
              break;
            case 4:
              fingerName = "(Pinky)";
              break;
          }

          return (
            <div key={i} className="flex items-center text-gray-700">
              <span className="w-6 font-bold text-indigo-600">
                {stringName}
              </span>
              <span className="mx-2 bg-gray-400 w-4 h-0.5" />
              <span className="w-4 text-center tabular-nums">{f}</span>
              {fingerName && (
                <span className="ml-2" title={`Finger ${fi}`}>
                  {fingerName}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {hardToPlay && (
        <div className="mt-2 text-center bg-red-500 text-white text-sm py-1 rounded-md font-bold">
          Difficult
        </div>
      )}
    </div>
  );
};

export default ChordDiagram;
