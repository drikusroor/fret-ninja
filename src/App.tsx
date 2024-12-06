import React, { useState, useEffect, KeyboardEvent } from 'react';
import { getChordShapes, chordDistance, ChordShape } from './chordLogic';
import { ChordDiagram } from './ChordDiagram';

// Utility to parse and store sequence in URL
function getSequenceFromUrl(): string[] {
  const urlParams = new URLSearchParams(window.location.search);
  const seq = urlParams.get('seq');
  if (!seq) return [];
  return seq.split(',');
}

function setSequenceInUrl(sequence: string[]) {
  const url = new URL(window.location.href);
  if (sequence.length > 0) {
    url.searchParams.set('seq', sequence.join(','));
  } else {
    url.searchParams.delete('seq');
  }
  window.history.replaceState({}, '', url.toString());
}

const App: React.FC = () => {
  const [chordName, setChordName] = useState('');
  const [foundChords, setFoundChords] = useState<{chordName:string; shapes:ChordShape[]}[]>([]);

  const [sequence, setSequence] = useState<string[]>(getSequenceFromUrl());
  const [chosenShapes, setChosenShapes] = useState<ChordShape[]>([]);

  useEffect(() => {
    // On load, we have a sequence from URL, but we need chosenShapes.
    // Without actual voicing info, we must recalculate chosenShapes:
    // This is tricky because we need chord shapes for each.
    // As a simplification, let's recalculate chosen shapes from scratch:
    (async function rebuildChosenShapes() {
      const newShapes: ChordShape[] = [];
      let prevShape: ChordShape | null = null;

      for (const ch of sequence) {
        // Retrieve shapes for this exact chord name:
        // We'll do a quick hack: the chord name might not match the fuzzy pattern.
        // We'll just call getChordShapes and filter by exact chordName:
        const allChords = getChordShapes(ch);
        const matched = allChords.find(c => c.chordName === ch);
        if (!matched || matched.shapes.length === 0) {
          // no shape found, skip
          newShapes.push({frets: ['x','x','x','x','x','x'], fingers:[0,0,0,0,0,0]});
          continue;
        }

        let chosen = matched.shapes[0];
        if (prevShape) {
          let bestDist = Infinity;
          for (const s of matched.shapes) {
            const d = chordDistance(prevShape, s);
            if (d < bestDist) {
              bestDist = d;
              chosen = s;
            }
          }
        }
        newShapes.push(chosen);
        prevShape = chosen;
      }
      setChosenShapes(newShapes);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chordName]);

  useEffect(() => {
    // Update URL params whenever sequence changes
    setSequenceInUrl(sequence);
  }, [sequence]);

  const handleSearch = () => {
    if (chordName.trim() === '') {
      setFoundChords([]);
      return;
    }
    const chords = getChordShapes(chordName.trim());
    setFoundChords(chords);
  };

  const chooseShapeForChord = (allShapes: ChordShape[]): ChordShape => {
    let chosenShape = allShapes[0];
    if (sequence.length > 0) {
      const lastShape = chosenShapes[chosenShapes.length - 1];
      let bestDist = Infinity;
      for (const s of allShapes) {
        const d = chordDistance(lastShape, s);
        if (d < bestDist) {
          bestDist = d;
          chosenShape = s;
        }
      }
    }
    return chosenShape;
  };

  const addTopChordToSequence = () => {
    if (foundChords.length === 0) return;
    // Take the first group's first shape
    const topGroup = foundChords[0];
    if (topGroup.shapes.length === 0) return;

    const chosenShape = chooseShapeForChord(topGroup.shapes);
    setSequence([...sequence, topGroup.chordName]);
    setChosenShapes([...chosenShapes, chosenShape]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTopChordToSequence();
    }
  };

  const handleAddToSequence = () => {
    addTopChordToSequence();
  };

  const handleRemoveFromSequence = (index: number) => {
    const newSeq = [...sequence];
    const newShapes = [...chosenShapes];
    newSeq.splice(index,1);
    newShapes.splice(index,1);
    setSequence(newSeq);
    setChosenShapes(newShapes);
  };

  const handleReset = () => {
    setSequence([]);
    setChosenShapes([]);
    setChordName('');
  };

  return (
    <div className="container mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center">FretNinja</h1>
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={chordName}
            onChange={(e) => setChordName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter chord name (e.g., Gma for Gmaj7)"
            className="flex-grow border border-gray-300 rounded p-2 mb-2"
          />
          <button
            onClick={handleAddToSequence}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 h-10 self-end"
          >
            Add
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 h-10 self-end"
          >
            Reset
          </button>
        </div>
      </div>

      {foundChords.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Found Chords</h2>
          {foundChords.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{group.chordName}</h3>
              <div className="flex flex-wrap gap-4">
                {group.shapes.map((shape, i) => (
                  <ChordDiagram key={i} frets={shape.frets} fingers={shape.fingers} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {sequence.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Chord Sequence</h2>
          <div className="flex flex-wrap gap-4">
            {sequence.map((ch, idx) => (
              <div key={idx} className="inline-flex flex-col items-center relative border p-2 rounded bg-gray-100">
                <button
                  className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded-bl hover:bg-red-600"
                  onClick={() => handleRemoveFromSequence(idx)}
                >
                  X
                </button>
                <strong className="block font-semibold mb-1 text-center">{ch}</strong>
                {chosenShapes[idx] && (
                  <ChordDiagram frets={chosenShapes[idx].frets} fingers={chosenShapes[idx].fingers} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
