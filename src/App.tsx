import React, { useState, useEffect } from 'react';
import { getChordShapes, chordDistance, ChordShape } from './chordLogic';
import { ChordDiagram } from './ChordDiagram';

const App: React.FC = () => {
  const [chordName, setChordName] = useState('');
  const [foundShapes, setFoundShapes] = useState<ChordShape[]>([]);

  const [sequence, setSequence] = useState<string[]>([]);
  const [chosenShapes, setChosenShapes] = useState<ChordShape[]>([]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chordName]);

  const handleSearch = () => {
    const shapes = getChordShapes(chordName.trim());
    setFoundShapes(shapes);
  };

  const handleAddToSequence = () => {
    const shapes = getChordShapes(chordName.trim());
    if (shapes.length === 0) return;

    if (sequence.length === 0) {
      setSequence([...sequence, chordName.trim()]);
      setChosenShapes([...chosenShapes, shapes[0]]);
    } else {
      const lastShape = chosenShapes[chosenShapes.length - 1];
      let bestShape = shapes[0];
      let bestDist = Infinity;
      for (const s of shapes) {
        const d = chordDistance(lastShape, s);
        if (d < bestDist) {
          bestDist = d;
          bestShape = s;
        }
      }
      setSequence([...sequence, chordName.trim()]);
      setChosenShapes([...chosenShapes, bestShape]);
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center">FretNinja</h1>
      <div className="mb-4">
        <input
          type="text"
          value={chordName}
          onChange={(e) => setChordName(e.target.value)}
          placeholder="Enter chord name (e.g., Gmaj7, Cmaj7, Gdim, Gm7(b5))"
          className="w-full border border-gray-300 rounded p-2 mb-2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddToSequence}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add To Sequence
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Found Chord Shapes</h2>
      {foundShapes.length === 0 && chordName.trim() !== '' && (
        <p className="text-gray-600">No shapes found</p>
      )}
      <div className="flex flex-wrap gap-4">
        {foundShapes.map((shape, i) => (
          <ChordDiagram key={i} frets={shape.frets} fingers={shape.fingers} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-6">Chord Sequence</h2>
      {sequence.map((ch, idx) => (
        <div key={idx} className="mb-6">
          <strong className="block font-semibold mb-1">{ch}</strong>
          {chosenShapes[idx] && (
            <ChordDiagram frets={chosenShapes[idx].frets} fingers={chosenShapes[idx].fingers} />
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
