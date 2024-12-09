import React, { useState, useEffect, KeyboardEvent } from 'react';
import { getChordShapes, chordDistance } from './chordLogic';
import { ChordShapeRefined } from './types/chord-shape';
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
  const [foundChords, setFoundChords] = useState<{ chordName: string; shapes: ChordShapeRefined[] }[]>([]);

  const [sequence, setSequence] = useState<string[]>(getSequenceFromUrl());
  const [chosenShapes, setChosenShapes] = useState<ChordShapeRefined[]>([]);

  // For the "show more" feature
  const [showAllChords, setShowAllChords] = useState(false);

  useEffect(() => {
    // On load, rebuild chosenShapes from the sequence in URL
    (async function rebuildChosenShapes() {
      const newShapes: ChordShapeRefined[] = [];
      let prevShape: ChordShapeRefined | null = null;

      for (const ch of sequence) {
        const allChords = getChordShapes(ch);
        const matched = allChords.find(c => c.chordName === ch);
        if (!matched || matched.shapes.length === 0) {
          newShapes.push({ frets: ['x', 'x', 'x', 'x', 'x', 'x'], fingers: [0, 0, 0, 0, 0, 0] });
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

  const chooseShapeForChord = (allShapes: ChordShapeRefined[], referenceShape?: ChordShapeRefined): ChordShapeRefined => {
    let chosenShape = allShapes[0];
    const ref = referenceShape || (chosenShapes.length > 0 ? chosenShapes[chosenShapes.length - 1] : null);
    if (ref) {
      let bestDist = Infinity;
      for (const s of allShapes) {
        const d = chordDistance(ref, s);
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
    const topGroup = foundChords[0];
    if (topGroup.shapes.length === 0) return;

    const chosenShape = chooseShapeForChord(topGroup.shapes);
    setSequence([...sequence, topGroup.chordName]);
    setChosenShapes([...chosenShapes, chosenShape]);
    setChordName(''); // Clear input after adding
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTopChordToSequence();
    }
  };

  const handleAddToSequence = () => {
    addTopChordToSequence();
  };

  const handleAddSpecificChord = (chordName: string, shape: ChordShapeRefined) => {
    // Add this exact shape to the sequence
    // The chordName given here is the displayName from foundChords
    // We might want to pick the best shape based on last chord
    const chosenShape = chooseShapeForChord([shape]);
    setSequence([...sequence, chordName]);
    setChosenShapes([...chosenShapes, chosenShape]);
    setChordName(''); // Clear input
  };

  const handleRemoveFromSequence = (index: number) => {
    const newSeq = [...sequence];
    const newShapes = [...chosenShapes];
    newSeq.splice(index, 1);
    newShapes.splice(index, 1);
    setSequence(newSeq);
    setChosenShapes(newShapes);
  };

  const handleReset = () => {
    setSequence([]);
    setChosenShapes([]);
    setChordName('');
  };

  // Determine how many chord groups to show
  const maxVisibleChords = 3;
  const visibleChords = showAllChords ? foundChords : foundChords.slice(0, maxVisibleChords);

  return (
    <div className='bg-indigo-100 min-h-screen'>
      <div className="container mx-auto p-4 font-sans">
        <h1 className="text-3xl font-bold mb-4 text-center">
          <img src="logo.png" alt="Fret Ninja" className="inline-block w-16 h-16 mr-2 rounded-lg" />
          Fret Ninja
        </h1>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chordName}
              onChange={(e) => setChordName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter chord name (e.g., Gma for Gmaj7)"
              className="flex-grow border border-gray-300 rounded p-2"
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
            <div className='flex flex-col gap-5'>
              {visibleChords.map((group, idx) => (
                <div key={idx} className={`${idx === 0 ? 'col-span-2' : ''}`}>
                  <h3 className="text-lg font-bold mb-2">{group.chordName}</h3>
                  <div className='flex flex-nowrap gap-4 overflow-x-auto'>
                    {group.shapes.map((shape, i) => (
                      <div key={i} className="relative">
                        <ChordDiagram
                          frets={shape.frets}
                          fingers={shape.fingers}
                          onAdd={() => handleAddSpecificChord(group.chordName, shape)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {foundChords.length > maxVisibleChords && (
              <button
                className="text-blue-600 underline hover:text-blue-800"
                onClick={() => setShowAllChords(!showAllChords)}
              >
                {showAllChords ? 'Show less' : 'Show more'}
              </button>
            )}
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
                    <ChordDiagram
                      frets={chosenShapes[idx].frets}
                      fingers={chosenShapes[idx].fingers}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;