# x0xb0x BOM (PCB-only build) — clear shopping + inventory list

Source baseline:
- Official “x0xb0x – Bill of Materials (BOM)” PDF (counts/values)
- Ladyada parts list page (specific part numbers + some acceptable alternates)

Notes:
- This BOM is written as a *procurement* document: enough to order and to check-in parts.
- Designators (R###, C###, etc.) are largely not present in the condensed PDF; use the silkscreen + build manual during placement.
- “Rare” parts: secure these first before buying the 500-passive avalanche.

---

## 0) Big / structural (optional depending on your build)

- [ ] ABS Case (PacTec PT-10) — Qty 1
- [ ] Set of main + I/O panels — Qty 1
- [ ] Set of main + I/O PCBs — Qty 1
- [ ] 9VAC wall wart, 300–500mA, 2.1mm barrel — Qty 1

---

## 1) Hardware / mounting

- [ ] 15/32" x 1/4" standoff (4-40) — Qty 3
- [ ] 3/8" x 1/4" standoff (4-40) — Qty 4
- [ ] 4-40 lock washer — Qty 7
- [ ] 4-40 washer — Qty 4
- [ ] 4-40 x 1/4" hex button — Qty 7
- [ ] 4-40 x 1/4" phillips button — Qty 7
- [ ] 4-40 x 1/2" phillips cheesehead/fillister — Qty 4
- [ ] Rubber feet — Qty 4

---

## 2) I/O connectors

### Audio / CV / power / USB
- [ ] 1/4" stereo jack — Qty 3 (MIXOUT, MIXIN, HEADPHONE)
  - Suggested: Neutrik NYS216
- [ ] 1/8" jack — Qty 2 (CV, GATE)
  - Suggested: CUI MJ-CP3536N
- [ ] 2.1mm power jack — Qty 1
  - Suggested: CUI PJ-202AH
- [ ] USB Type-B through-hole jack — Qty 1
  - Suggested: Kobiconn 154-2442-E (any TH Type-B OK)

### MIDI / DINSYNC
- [ ] 5-pin DIN jack — Qty 4 (MIDI In/Out/Thru + DINSYNC)
  - Suggested: CUI SDS-50J (front-pin match matters more than brand)

---

## 3) UI / controls

- [ ] Toggle switch — Qty 1 (saw/square)
  - Suggested: NKK B12AB-RO
- [ ] Rotary encoder — Qty 1 (tempo)
  - Suggested: CTS 290VAA5F201B2
- [ ] 16-position rotary switch — Qty 2 (bank + mode)
  - Suggested: Grayhill 25LB22-H
- [ ] Tact switch, “standard 12mm” — Qty 23
  - Suggested: E-Switch TL1100F160Q
- [ ] Switch cap (white) — Qty 8
- [ ] Switch cap (black) — Qty 15
- [ ] Potentiometer knob — Qty 8
- [ ] Switch knob — Qty 2

---

## 4) Wiring

- [ ] Solid ~20-gauge wire (bring your own) — (used for jumpers)
- [ ] Jumper ribbon cable set — Qty 4 total sets, one of:
  - Option A: 16-wire jumper ribbon cable
  - Option B: 9-wire + 6-wire
  - Option C: 2×9-conductor + 1×6-conductor

---

## 5) LEDs

- [ ] 0.22–0.24" LED standoff — Qty 40
- [ ] Red 5mm LED — Qty 40
- [ ] LED series resistors (value varies by LED brightness) — Qty 40

---

## 6) Diodes

- [ ] 1N4001 — Qty 4
- [ ] 1N4148 — Qty 29

---

## 7) Resistors — 5% (through-hole)

- [ ] 10Ω — Qty 2
- [ ] 22Ω — Qty 2
- [ ] 27Ω — Qty 2
- [ ] 100Ω — Qty 7
- [ ] 220Ω — Qty 5
- [ ] 470Ω — Qty 1
- [ ] 1k — Qty 4
- [ ] 1.5k — Qty 1
- [ ] 1.8k — Qty 1
- [ ] 2.2k — Qty 19
- [ ] 4.7k — Qty 2
- [ ] 6.8k — Qty 1
- [ ] 10k — Qty 94
- [ ] 22k — Qty 10
- [ ] 33k — Qty 1
- [ ] 47k — Qty 4
- [ ] 68k — Qty 1
- [ ] 100k — Qty 24
- [ ] 220k — Qty 8
- [ ] 1M — Qty 2
- [ ] 1.5M — Qty 1

---

## 8) Resistors — 1%

- [ ] 2.4k — Qty 1
- [ ] 5.6k — Qty 1
- [ ] 24k — Qty 1
- [ ] 200k — Qty 17

---

## 9) Trimmers + pots

### Trimmers
- [ ] 2k (202) trim pot — Qty 1
- [ ] 15k (502) trim pot — Qty 1
- [ ] 50k (503) trim pot — Qty 1
- [ ] 500k (504) trim pot — Qty 1

### Panel pots
- [ ] 50k D (log) pot — Qty 3
- [ ] 50k B (linear) pot — Qty 2
- [ ] 50k B (linear) *dual* pot — Qty 1
- [ ] 1M A (log) *dual* pot — Qty 1

---

## 10) Thermistors

- [ ] 1k PTC thermistor — Qty 2

---

## 11) Capacitors

### Film / polyester (marked like “2A###K” in the original BOM)
- [ ] 0.001uF — Qty 3
- [ ] 0.0068uF — Qty 1
- [ ] 0.01uF — Qty 5
- [ ] 0.018uF — Qty 1
- [ ] 0.033uF — Qty 5
- [ ] 0.047uF — Qty 1
- [ ] 0.068uF — Qty 1
- [ ] 0.1uF — Qty 3
- [ ] 0.22uF — Qty 1

### Ceramic
- [ ] 0.1uF (104) ceramic — Qty 16

### Electrolytic
- [ ] 1uF — Qty 13
- [ ] 2.2uF — Qty 1
- [ ] 10uF — Qty 13
- [ ] 47uF — Qty 4
- [ ] 100uF 10V — Qty 3
- [ ] 100uF 25V — Qty 2
- [ ] 1000uF — Qty 1
- [ ] 2200uF — Qty 2

### Tantalum
- [ ] 1uF (105) tantalum — Qty 2

---

## 12) ICs / semiconductors

### Logic / digital
- [ ] 4066 analog switch — Qty 1
- [ ] 74AC174 (or 74HC174) — Qty 1
- [ ] 74AC126 (or 74HC126) — Qty 1
- [ ] 74AC165 (or 74HC165) — Qty 3
- [ ] 74AC595 (or 74HC595) — Qty 5

### Transistors + analog “voice” parts (the hard stuff)
- [ ] 2SA733P (TO-92 PNP) — Qty 10
- [ ] 2SC536F (TO-92 NPN) — Qty 24  **(rare)**
- [ ] 2SK30 JFET — Qty 2  *(some builds require AY vs AO in specific locations)*
- [ ] 2SC2291 matched pair (5-SIP, common base) — Qty 1 **(rare)**
- [ ] 2SC1583 matched pair (5-SIP, common emitter) — Qty 3 **(rare)**
- [ ] AN6562 dual op-amp (8-DIP) — Qty 2 **(rare)**
- [ ] LA4140 headphone amp (9-SIP) — Qty 1 **(rare)**
- [ ] BA6110 OTA (9-SIP) — Qty 1 **(rare)**
- [ ] BA662A OTA (9-SIP) — Qty 1 *(optional / extremely rare)*

### Power + interface
- [ ] ATmega162 microcontroller — Qty 1
- [ ] 25LC33 (or equivalent 4KB EEPROM) — Qty 1
- [ ] 7805 regulator (TO-220) — Qty 1
- [ ] 7806 regulator (TO-92) — Qty 1
- [ ] LM336Z-5.0 voltage reference (TO-92) — Qty 1
- [ ] 4N37 optoisolator — Qty 1
- [ ] FT232 USB chip — Qty 1
- [ ] 6MHz ceramic resonator — Qty 1
- [ ] 16MHz ceramic resonator — Qty 1

---

## 13) Sockets (recommended)

- [ ] 40-pin DIP socket — Qty 1 (for ATmega162)
- [ ] 8-pin DIP socket — Qty 1 (for EEPROM)

---

## 14) Procurement strategy (fast + low regret)

1) Buy rare parts first (2SC536F, matched pairs, AN6562, LA4140, BA6110).
2) Order passives in “overage-friendly” quantities:
   - 10k: buy 100+
   - 200k (1%): buy 20+
   - 0.1uF ceramic 104: buy 25+
3) Keep a bin-per-value workflow; don’t “free-pour” a 500-part build.
