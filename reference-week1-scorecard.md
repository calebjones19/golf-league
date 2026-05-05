# Week 1 Full Scorecard Reference — woodside.golfleague.net
Date: 04/29/2026 · Paint Creek CC · Back 9 (Holes 10–18)

## Course Data
| Hole        | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Total |
|-------------|----|----|----|----|----|----|----|----|----|----|
| Par         |  5 |  3 |  4 |  4 |  4 |  4 |  5 |  4 |  3 |  36 |
| Raw HCP     |  8 | 16 | 14 |  2 | 10 |  6 | 12 |  4 | 18 |     |
| Rank (1=hardest) | 4 | 8 | 7 | 1 | 5 | 3 | 6 | 2 | 9 |     |

**Scratch par (used for handicap calc):** 33.6 (back 9)

Stroke allocation rule: `playerStrokesOnHole(hcp, holeRank, 9)`
= `Math.floor(hcp/9) + (holeRank <= hcp%9 ? 1 : 0)`

---

## Team Points (Reference)
| Pos | Team             | Total Gross | Total Net | Team Points |
|-----|------------------|-------------|-----------|-------------|
|  1  | Denzel / Rob F   | 107         | 75        | 9.50        |
|  2  | Caleb / Kevin    | 92          | 75        | 9.00        |
|  3  | Jim / Brad       | 95          | 83        | 8.50        |
|  3  | Truman / Eric P. | 100         | 77        | 8.50        |
|  5  | Jon / Mike       | 97          | 76        | 7.50        |
|  5  | Matt / Ray       | 113         | 82        | 7.50        |
|  7  | Anthony/Nicholas | 99          | 86        | 3.50        |
|  7  | Daniel / Jake    | 101         | 83        | 3.50        |
|  9  | Matt / Calvin    | 112         | 97        | 2.50        |
|  9  | Kyle N / Scott   | 111         | 90        | 2.50        |
| 11  | Kevin / Kyle W   | 110         | 84        | 2.00        |
| 12  | Eric L. / Ryan   | 121         | 95        | 1.50        |

---

## Match #1 — Jon/Mike (7.50 pts) vs Daniel/Jake (3.50 pts)

### Jon Dahlke — Hcp 10 · Strokes: 10
Stroke holes: H13×2, H17, H15, H10, H14
(base=1 every hole, +1 on rank≤1 → H13 gets 2; wait — hcp=10: base=floor(10/9)=1, extra=10%9=1 → every hole gets 1 stroke + rank≤1 holes get extra → H13 gets 2)

Corrected: base=1, extra=1 → every hole gets 1 stroke + H13(rank1) gets +1 = 2 strokes on H13, 1 elsewhere.

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  6 |  6 |  4 |  8 |  4 |  5 |  6 |  4 |  3 | 46 |
| Strk |  1 |  1 |  1 |  2 |  1 |  1 |  1 |  1 |  1 | 10 |
| Net  |  5 |  5 |  3 |  6 |  3 |  4 |  5 |  3 |  2 | 36 |

### Mike Morgan — Hcp 11 *(app had 13 — CORRECT TO 11)* · Strokes: 11
base=1, extra=2 → every hole +1; H13(rank1) and H17(rank2) get +1 extra

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  6 |  5 |  5 |  7 |  6 |  7 |  7 |  4 |  4 | 51 |
| Strk |  1 |  1 |  1 |  2 |  1 |  1 |  1 |  2 |  1 | 11 |
| Net  |  5 |  4 |  4 |  5 |  5 |  6 |  6 |  2 |  3 | 40 |

**Jon+Mike team net by hole:** 10,9,7,11,8,10,11,5,5 = **76** ✓

### Daniel Jipping — Hcp 9 · Strokes: 9
base=1, extra=0 → every hole gets exactly 1 stroke

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  9 |  3 |  5 |  5 |  5 |  6 |  6 |  6 |  6 | 51 |
| Strk |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  9 |
| Net  |  8 |  2 |  4 |  4 |  4 |  5 |  5 |  5 |  5 | 42 |

### Jake Waldorf — Hcp 9 · Strokes: 9
base=1, extra=0 → every hole gets exactly 1 stroke

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  5 |  5 |  7 |  5 |  5 |  6 |  6 |  6 |  5 | 50 |
| Strk |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  9 |
| Net  |  4 |  4 |  6 |  4 |  4 |  5 |  5 |  5 |  4 | 41 |

**Daniel+Jake team net by hole:** 12,6,10,8,8,10,10,10,9 = **83** ✓

### Hole-by-hole (Team A net vs Team B net):
| Hole     | 10  | 11 | 12 | 13  | 14 | 15  | 16  | 17 | 18 | Winner |
|----------|-----|----|----|-----|----|-----|-----|----|----|--------|
| A (J+M)  | 10  |  9 |  7 | 11  |  8 | 10  | 11  |  5 |  5 |        |
| B (D+J)  | 12  |  6 | 10 |  8  |  8 | 10  | 10  | 10 |  9 |        |
| Winner   |  A  |  B |  A |  B  |  T |  T  |  B  |  A |  A |        |

Holes A wins: 10,12,17,18 = 4 pts + 1 match bonus = 5 pts
Holes B wins: 11,13,16 = 3 pts
Ties: 14,15 = 0.5 each → A: 0.5+0.5=1 extra, B: 1 extra
A total holes+ties = 4+1 = 5, B = 3+1 = 4
A gets match bonus (+1) = 5+1=6? No...

Wait, let me re-check points: each hole = 1pt win, 0.5 each tie.
A wins holes 10,12,17,18 = 4 pts; ties 14,15 = +0.5 each = 5 pts before bonuses
B wins holes 11,13,16 = 3 pts; ties 14,15 = +0.5 each = 4 pts before bonuses
A wins match (5>4) → A gets +1 match bonus = 6 pts
Medal: A net 76 vs B net 83 → A wins → +1 medal bonus = 7 pts... but reference shows 7.5

Hmm - need to verify hole-by-hole. The 7.5/3.5 split means 11 total pts, which is correct (9 holes × 1pt + 1 match + 1 medal = 11). A=7.5 B=3.5.

---

## Match #2 — Jim/Brad (8.50 pts) vs Kyle N/Scott (2.50 pts)

### Jim Dahlke — Hcp 8 · Strokes: 8
base=0, extra=8 → strokes on all holes EXCEPT rank 9 (H18)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  7 |  4 |  5 |  7 |  5 |  5 |  5 |  5 |  6 | 49 |
| Strk |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  0 |  8 |
| Net  |  6 |  3 |  4 |  6 |  4 |  4 |  4 |  4 |  6 | 41 |

### Brad House — Hcp 4 · Strokes: 4
base=0, extra=4 → strokes on H13(r1), H17(r2), H15(r3), H10(r4)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  5 |  5 |  7 |  6 |  4 |  5 |  5 |  4 |  5 | 46 |
| Strk |  1 |  0 |  0 |  1 |  0 |  1 |  0 |  1 |  0 |  4 |
| Net  |  4 |  5 |  7 |  5 |  4 |  4 |  5 |  3 |  5 | 42 |

**Jim+Brad team net by hole:** 10,8,11,11,8,8,9,7,11 = **83** ✓

### Kyle N (Bill Para) — Hcp 13 *(app had 15 — CORRECT TO 13)* · Strokes: 13
base=1, extra=4 → every hole +1; H13(r1), H17(r2), H15(r3), H10(r4) get +1 extra

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross| 10 |  8 |  5 |  6 |  6 |  6 |  8 |  7 |  5 | 61 |
| Strk |  2 |  1 |  1 |  2 |  1 |  2 |  1 |  2 |  1 | 13 |
| Net  |  8 |  7 |  4 |  4 |  5 |  4 |  7 |  5 |  4 | 48 |

### Scott Bocquet — Hcp 8 · Strokes: 8
base=0, extra=8 → all holes except H18(r9)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  8 |  3 |  4 |  3 |  5 |  6 |  8 |  6 |  7 | 50 |
| Strk |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  0 |  8 |
| Net  |  7 |  2 |  3 |  2 |  4 |  5 |  7 |  5 |  7 | 42 |

**Kyle N+Scott team net:** 15,9,7,6,9,9,14,10,11 = **90** ✓

---

## Match #3 — Caleb/Kevin B (9.00 pts) vs Kevin W/Kyle W (2.00 pts)

### Kevin Briel — Hcp 6 · Strokes: 6
base=0, extra=6 → H13(r1), H17(r2), H15(r3), H10(r4), H14(r5), H16(r6)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  5 |  3 |  5 |  6 |  4 |  6 |  7 |  5 |  3 | 44 |
| Strk |  1 |  0 |  0 |  1 |  1 |  1 |  1 |  1 |  0 |  6 |
| Net  |  4 |  3 |  5 |  5 |  3 |  5 |  6 |  4 |  3 | 38 |

### Caleb Jones — Hcp 11 · Strokes: 11
base=1, extra=2 → every hole +1; H13(r1), H17(r2) get +1 extra
Note: H18 score unknown from scorecard (shown as ?)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  6 |  5 |  6 |  5 |  7 |  6 |  6 |  5 |  ? | 48 (w/ H18)|
| Strk |  1 |  1 |  1 |  2 |  1 |  1 |  1 |  2 |  1 | 11 |
| Net  |  5 |  4 |  5 |  3 |  6 |  5 |  5 |  3 |  ? | 37 |

**Caleb+Kevin team net = 92−17 = 75** ✓

### Kevin Wink — Hcp 15 · Strokes: 15
base=1, extra=6 → every hole +1; H13(r1),H17(r2),H15(r3),H10(r4),H14(r5),H16(r6) get +1 extra

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  8 |  5 |  7 |  5 |  6 |  6 |  8 |  6 |  6 | 57 |
| Strk |  2 |  1 |  1 |  2 |  2 |  2 |  2 |  2 |  1 | 15 |
| Net  |  6 |  4 |  6 |  3 |  4 |  4 |  6 |  4 |  5 | 42 |

### Kyle Wink — Hcp 11 · Strokes: 11
Same stroke pattern as Caleb: every hole +1; H13(r1), H17(r2) get +1 extra

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  8 |  4 |  5 |  6 |  6 |  6 |  7 |  7 |  4 | 53 |
| Strk |  1 |  1 |  1 |  2 |  1 |  1 |  1 |  2 |  1 | 11 |
| Net  |  7 |  3 |  4 |  4 |  5 |  5 |  6 |  5 |  3 | 42 |

**Kevin W + Kyle W team net = 110−26 = 84** ✓

---

## Match #4 — Anthony/Nicholas (3.50 pts) vs Matt Z/Ray (7.50 pts)

### Nicholas O'Neil — Hcp 8 · Strokes: 8
base=0, extra=8 → all holes except H18(r9)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  8 |  5 |  5 |  6 |  5 |  5 |  5 |  5 |  6 | 50 |
| Strk |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  0 |  8 |
| Net  |  7 |  4 |  4 |  5 |  4 |  4 |  4 |  4 |  6 | 42 |

### Anthony Codrean — Hcp 5 *(app had 6 — CORRECT TO 5)* · Strokes: 5
base=0, extra=5 → H13(r1), H17(r2), H15(r3), H10(r4), H14(r5)

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  5 |  5 |  6 |  5 |  6 |  5 |  6 |  6 |  5 | 49 |
| Strk |  1 |  0 |  0 |  1 |  1 |  1 |  0 |  1 |  0 |  5 |
| Net  |  4 |  5 |  6 |  4 |  5 |  4 |  6 |  5 |  5 | 44 |

**Anthony+Nicholas team net = 99−13 = 86** ✓

### Matt Zellers — Hcp 13 · Strokes: 13
base=1, extra=4 → every hole +1; H13(r1),H17(r2),H15(r3),H10(r4) get +1 extra

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  9 |  5 |  5 |  6 |  7 |  5 |  5 |  6 |  5 | 53 |
| Strk |  2 |  1 |  1 |  2 |  1 |  2 |  1 |  2 |  1 | 13 |
| Net  |  7 |  4 |  4 |  4 |  6 |  3 |  4 |  4 |  4 | 40 |

### Ray Cela — Hcp 18 · Strokes: 18
base=2, extra=0 → every hole gets exactly 2 strokes

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  6 |  4 |  5 |  8 |  7 |  8 |  7 |  8 |  7 | 60 |
| Strk |  2 |  2 |  2 |  2 |  2 |  2 |  2 |  2 |  2 | 18 |
| Net  |  4 |  2 |  3 |  6 |  5 |  6 |  5 |  6 |  5 | 42 |

**Matt+Ray team net = 113−31 = 82** ✓

---

## Match #5 — Eric L/Ryan (1.50 pts) vs Denzel/Rob F (9.50 pts)

Hole-by-hole scores not captured from screenshot — only totals available.

### Eric Larock — Hcp 15 *(app had 16 — CORRECT TO 15)* · Strokes: 15
Gross=62, Net=47

### Ryan Gillespie — Hcp 11 · Strokes: 11
Gross=59, Net=48 (59−11=48)

**Eric+Ryan team net = 121−26 = 95** ✓

### Rob Fitzpatrick — Hcp 16 *(app had 17 — CORRECT TO 16)* · Strokes: 16
base=1, extra=7 → every hole +1; H13(r1),H17(r2),H15(r3),H10(r4),H14(r5),H16(r6),H12(r7) get +1 extra

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  8 |  4 |  4 |  6 |  7 |  8 |  6 |  7 |  4 | 54 |
| Strk |  2 |  1 |  2 |  2 |  2 |  2 |  2 |  2 |  1 | 16 |
| Net  |  6 |  3 |  2 |  4 |  5 |  6 |  4 |  5 |  3 | 38 |

### Denzel Wright — Hcp 16 *(app had 17 — CORRECT TO 16)* · Strokes: 16
Same stroke pattern as Rob

| Hole | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Tot |
|------|----|----|----|----|----|----|----|----|----|----|
| Gross|  7 |  6 |  5 |  6 |  5 |  7 |  7 |  7 |  3 | 53 |
| Strk |  2 |  1 |  2 |  2 |  2 |  2 |  2 |  2 |  1 | 16 |
| Net  |  5 |  5 |  3 |  4 |  3 |  5 |  5 |  5 |  2 | 37 |

**Denzel+Rob team net = 107−32 = 75** ✓

---

## Match #6 — Truman/Eric P. (8.50 pts) vs Matt/Calvin (2.50 pts)
*Scorecard not captured — derived from reference app totals*

Reference: Team A Gross=100, Net=77, Strokes=23 · Team B Gross=112, Net=97, Strokes=15

### Team A (Truman/Eric P.) — combined strokes must equal 23
Our app shows both players at hcp=14 each → 28 strokes (off by 5).
Likely correction: one player hcp=9 (not 14) → 9+14=23.
**⚠️ Needs admin verification — check player profiles for Truman and Eric P.**

### Team B (Matt/Calvin) — combined strokes must equal 15
Our app: Matt hcp=3, Calvin hcp=13 → 16 strokes (off by 1).
Correction: Calvin hcp=12 (not 13) → 3+12=15 ✓
Net = 112−15 = 97 ✓
**⚠️ Calvin's handicap needs to be corrected to 12.**

---

## Handicap Corrections Required

| Player | App Hcp | Correct Hcp | Match |
|--------|---------|-------------|-------|
| Mike Morgan | 13 | **11** | Match #1 |
| Bill Para (Kyle N) | 15 | **13** | Match #2 |
| Rob Fitzpatrick | 17 | **16** | Match #5 |
| Denzel Wright | 17 | **16** | Match #5 |
| Eric Larock | 16 | **15** | Match #5 |
| Anthony Codrean | 6 | **5** | Match #4 (pts same) |
| Calvin (Match #6) | 13 | **12** | Match #6 |
| Truman or Eric P. | 14 | **~9** | Match #6 — ⚠️ needs verification |

---

## Handicap Calculation Method (Reference App)
1. Variation = Adjusted Gross − Scratch par (33.6 back / 34.5 front)
2. Use last 6 rounds
3. Discard 2 highest variations
4. Average remaining 4
5. Multiply by 90%
6. Truncate at hundredths (not round)
7. Round to whole number
8. Cap at 18

**Our app currently uses actual par total instead of scratch par** — will diverge over time.
Need to update `recalcHandicaps()` to use 33.6/34.5 scratch par constants.
