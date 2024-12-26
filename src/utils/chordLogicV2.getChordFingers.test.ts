import { describe, it, expect } from "vitest"
import { getChordFingers } from "./chordLogicV2" 
// Update the path to wherever your function is defined

describe("getChordFingers()", () => {
  it("x02210 (Am) -> x02310", () => {
    const frets = ["x", 0, 2, 2, 1, 0]           // x02210
    const result = getChordFingers(frets)
    // Expect x02310. If your final code maps 'x' => 0, adapt accordingly.
    expect(result).toEqual(["x", 0, 2, 3, 1, 0])
  })

  it("320003 (G) -> 210003", () => {
    const frets = [3, 2, 0, 0, 0, 3]             // 320003
    const result = getChordFingers(frets)
    expect(result).toEqual([2, 1, 0, 0, 0, 3])   // 210003
  })

  it("320033 (G) -> 210034", () => {
    const frets = [3, 2, 0, 0, 3, 3]             // 320033
    const result = getChordFingers(frets)
    expect(result).toEqual([2, 1, 0, 0, 3, 4])   // 210034
  })

  it("320001 (G7) -> 320001", () => {
    const frets = [3, 2, 0, 0, 0, 1]             // 320001
    const result = getChordFingers(frets)
    expect(result).toEqual([3, 2, 0, 0, 0, 1])   // 320001
  })

  it("133211 (F) -> 134211", () => {
    const frets = [1, 3, 3, 2, 1, 1]             // 133211
    const result = getChordFingers(frets)
    expect(result).toEqual([1, 3, 4, 2, 1, 1])   // 134211
  })

  it("022100 (E) -> 023100", () => {
    const frets = [0, 2, 2, 1, 0, 0]             // 022100
    const result = getChordFingers(frets)
    expect(result).toEqual([0, 2, 3, 1, 0, 0])   // 023100
  })

  it("022130 (E7) -> 023140", () => {
    const frets = [0, 2, 2, 1, 3, 0]             // 022130
    const result = getChordFingers(frets)
    expect(result).toEqual([0, 2, 3, 1, 4, 0])   // 023140
  })

  it("x24432 (Bm) -> x13421", () => {
    const frets = ["x", 2, 4, 4, 3, 2]           // x24432
    const result = getChordFingers(frets)
    expect(result).toEqual(["x", 1, 3, 4, 2, 1]) // x13421
  })

  it("133111 (Fm) -> 134111", () => {
    const frets = [1, 3, 3, 1, 1, 1]             // 133111
    const result = getChordFingers(frets)
    expect(result).toEqual([1, 3, 4, 1, 1, 1])   // 134111
  })

  it("x21202 (B7) -> x21304", () => {
    const frets = ["x", 2, 1, 2, 0, 2]           // x21202
    const result = getChordFingers(frets)
    expect(result).toEqual(["x", 2, 1, 3, 0, 4]) // x21304
  })

  it("353463 (G7) -> 131241", () => {
    const frets = [3, 5, 3, 4, 6, 3]             // 353463
    const result = getChordFingers(frets)
    expect(result).toEqual([1, 3, 1, 2, 4, 1])   // 131241
  })
})
