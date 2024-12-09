// audioService.ts
const NOTE_FREQUENCIES: Record<string, number> = {
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'B2': 123.47,
    'C3': 130.81,
    'C#3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'B3': 246.94,
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
  };
  
  const STRING_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
  
  class AudioService {
    private audioContext: AudioContext | null = null;
    private isPlaying: boolean = false;
  
    private initAudioContext() {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }
      return this.audioContext;
    }
  
    private createOscillator(frequency: number, startTime: number, duration: number) {
      const ctx = this.initAudioContext();
      
      // Create oscillator and gain nodes
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Set oscillator properties
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      
      // Set envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Start and stop the oscillator
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    }
  
    private getNoteFrequency(stringIndex: number, fret: number): number {
      const baseName = STRING_TUNING[stringIndex];
      const baseFreq = NOTE_FREQUENCIES[baseName];
      return baseFreq * Math.pow(2, fret / 12);
    }
  
    playChord(frets: (string | number)[]) {
      if (this.isPlaying) return;
      this.isPlaying = true;
  
      const ctx = this.initAudioContext();
      const now = ctx.currentTime;
      const noteDuration = 0.5;
      const arpeggioDelay = 0.12;
  
      // Filter out muted strings and convert fret numbers
      const validNotes = frets.map((fret, index) => ({
        fret: fret === 'x' ? -1 : (typeof fret === 'string' ? parseInt(fret) : fret),
        index
      })).filter(note => note.fret >= 0);
  
      // Play each note in sequence
      validNotes.forEach((note, i) => {
        const freq = this.getNoteFrequency(note.index, note.fret);
        this.createOscillator(freq, now + (i * arpeggioDelay), noteDuration);
      });
  
      // Reset playing flag after the arpeggio is complete
      setTimeout(() => {
        this.isPlaying = false;
      }, (validNotes.length * arpeggioDelay + noteDuration) * 1000);
    }
  
    cleanup() {
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    }
  }
  
  export const audioService = new AudioService();