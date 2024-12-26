import React, { useState, useEffect, KeyboardEvent } from "react";
import { getChordShapes, chordDistance } from "./utils/chordLogic";
import { ChordShapeRefined } from "./types/chord-shape";
import { ChordDiagram } from "./ChordDiagram";
import {
  findChordShapes,
  standardGuitar,
} from "./utils/chordLogicV2";

// Utility to parse and store sequence in URL
function getSequenceFromUrl(): string[] {
  const urlParams = new URLSearchParams(window.location.search);
  const seq = urlParams.get("seq");
  if (!seq) return [];
  return seq.split(",");
}

function setSequenceInUrl(sequence: string[]) {
  const url = new URL(window.location.href);
  if (sequence.length > 0) {
    url.searchParams.set("seq", sequence.join(","));
  } else {
    url.searchParams.delete("seq");
  }
  window.history.replaceState({}, "", url.toString());
}

const App: React.FC = () => {
  const [chordName, setChordName] = useState("");
  const [foundChords, setFoundChords] = useState<{ chordName: string; shapes: ChordShapeRefined[] }[]>([]);
  const [sequence, setSequence] = useState<string[]>(getSequenceFromUrl());
  const [chosenShapes, setChosenShapes] = useState<ChordShapeRefined[]>([]);
  const [showAllChords, setShowAllChords] = useState(false);
  const [version, setVersion] = useState<"v1" | "v2">("v2");

  useEffect(() => {
    (async function rebuildChosenShapes() {
      const newShapes: ChordShapeRefined[] = [];
      let prevShape: ChordShapeRefined | null = null;

      for (const ch of sequence) {
        const allChords = getChordShapes(ch);
        const matched = allChords.find((c) => c.chordName === ch);
        if (!matched || matched.shapes.length === 0) {
          newShapes.push({
            frets: ["x", "x", "x", "x", "x", "x"],
            fingers: [0, 0, 0, 0, 0, 0],
          });
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
  }, [chordName, version]);

  useEffect(() => {
    setSequenceInUrl(sequence);
  }, [sequence]);

  const handleSearch = () => {
    if (chordName.trim() === "") {
      setFoundChords([]);
      return;
    }

    let chords = [];

    if (version === "v1") {
      console.log('Version 1')
      // Version 1
      chords = getChordShapes(chordName.trim());
    } else {
      // Version 2
      console.log('Version 2')
      const trimmed = chordName.trim();
      const instrument = standardGuitar;
      const chordShapes = findChordShapes(chordName, instrument);
      chords = [{
        chordName: trimmed,
        shapes: chordShapes,
      }]
    }
    
    setFoundChords(chords);
  };

  const chooseShapeForChord = (
    allShapes: ChordShapeRefined[],
    referenceShape?: ChordShapeRefined
  ): ChordShapeRefined => {
    let chosenShape = allShapes[0];
    const ref =
      referenceShape ||
      (chosenShapes.length > 0 ? chosenShapes[chosenShapes.length - 1] : null);
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
    setChordName("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTopChordToSequence();
    }
  };

  const handleAddToSequence = () => {
    addTopChordToSequence();
  };

  const handleAddSpecificChord = (
    chordName: string,
    shape: ChordShapeRefined
  ) => {
    const chosenShape = chooseShapeForChord([shape]);
    setSequence([...sequence, chordName]);
    setChosenShapes([...chosenShapes, chosenShape]);
    setChordName("");
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
    setChordName("");
  };

  const maxVisibleChords = 3;
  const visibleChords = showAllChords
    ? foundChords
    : foundChords.slice(0, maxVisibleChords);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-center mb-8 bg-white rounded-lg shadow-lg p-4">
          <img src="logo.png" alt="Fret Ninja" className="w-16 h-16 mr-4" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fret Ninja
            </h1>
            <p className="text-gray-600 mt-1">Master your guitar chords with stealth</p>
          </div>
        </header>

        {/* Version Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex gap-2">
            <button
              className={`px-6 py-2 rounded-md transition-all ${
                version === "v1" 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setVersion("v1")}
            >
              Version 1
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-all ${
                version === "v2" 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setVersion("v2")}
            >
              Version 2
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={chordName}
              onChange={(e) => setChordName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter chord name (e.g., Gma for Gmaj7)"
              className="flex-grow px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
            <button
              onClick={handleAddToSequence}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
            >
              Add
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Found Chords Section */}
        {foundChords.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-indigo-600 rounded mr-3"></span>
              Found Chords
            </h2>
            <div className="space-y-8">
              {visibleChords.map((group, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <h3 className="text-xl font-bold text-indigo-600 mb-4">{group.chordName}</h3>
                  <div className="flex flex-wrap gap-6">
                    {group.shapes.map((shape, i) => (
                      <div key={i} className="transform hover:-translate-y-1 transition-transform">
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
                className="mt-6 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                onClick={() => setShowAllChords(!showAllChords)}
              >
                {showAllChords ? "↑ Show less" : "↓ Show more"}
              </button>
            )}
          </div>
        )}

        {/* Sequence Section */}
        {sequence.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-purple-600 rounded mr-3"></span>
              Chord Sequence
            </h2>
            <div className="flex flex-wrap gap-6">
              {sequence.map((ch, idx) => (
                <div key={idx} 
                  className="relative group bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                  <button
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveFromSequence(idx)}
                  >
                    ×
                  </button>
                  <div className="font-bold text-center text-gray-800 mb-2">{ch}</div>
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