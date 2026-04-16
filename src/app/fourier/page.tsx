"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Preset = "custom" | "square" | "sawtooth" | "triangle" | "expression";

const DESCRIPTIONS = {
  fx: "f(x): guest arrivals over time, modeled as a periodic wave.",
  L: "L: the half-period of the arrival schedule (one full cycle spans 2L).",
  n: "n: the harmonic index (1, 2, 3, …) — also the guest index in sequential order.",
  a0: "a₀: the baseline attendance — the DC offset, or average value of f(x) over one period.",
  an: "aₙ: cosine coefficients — amplitude of the cosine harmonic at frequency n.",
  bn: "bₙ: sine coefficients — amplitude of the sine harmonic at frequency n.",
};

function presetCoefficients(preset: Preset, N: number): { a0: number; a: number[]; b: number[] } {
  const a = Array(N + 1).fill(0);
  const b = Array(N + 1).fill(0);
  const a0 = 0;
  if (preset === "square") {
    for (let n = 1; n <= N; n++) if (n % 2 === 1) b[n] = 4 / (Math.PI * n);
  } else if (preset === "sawtooth") {
    for (let n = 1; n <= N; n++) b[n] = (2 / (Math.PI * n)) * (n % 2 === 1 ? 1 : -1);
  } else if (preset === "triangle") {
    for (let n = 1; n <= N; n++) {
      if (n % 2 === 1) {
        const sign = ((n - 1) / 2) % 2 === 0 ? 1 : -1;
        a[n] = (8 / (Math.PI * Math.PI * n * n)) * sign;
      }
    }
  }
  return { a0, a, b };
}

function compileExpression(expr: string): ((x: number) => number) | null {
  if (!/^[\s\d+\-*/%().,xMathabsincoestqrlgpPIE^]*$/i.test(expr)) return null;
  try {
    const safe = expr.replace(/\^/g, "**");
    const fn = new Function("x", `"use strict"; const {sin,cos,tan,abs,exp,log,sqrt,pow,PI,E,sign,floor,ceil,round} = Math; return (${safe});`);
    const v = fn(0);
    if (typeof v !== "number" || Number.isNaN(v)) return null;
    return fn as (x: number) => number;
  } catch {
    return null;
  }
}

function numericalCoefficients(
  f: (x: number) => number,
  L: number,
  N: number,
  samples = 2000
): { a0: number; a: number[]; b: number[] } {
  const a = Array(N + 1).fill(0);
  const b = Array(N + 1).fill(0);
  const dx = (2 * L) / samples;

  let a0Sum = 0;
  for (let i = 0; i <= samples; i++) {
    const x = -L + i * dx;
    const w = i === 0 || i === samples ? 0.5 : 1;
    try {
      const y = f(x);
      if (Number.isFinite(y)) a0Sum += w * y;
    } catch {}
  }
  const a0 = (a0Sum * dx * 2) / (2 * L);

  for (let n = 1; n <= N; n++) {
    let ca = 0;
    let cb = 0;
    for (let i = 0; i <= samples; i++) {
      const x = -L + i * dx;
      const w = i === 0 || i === samples ? 0.5 : 1;
      try {
        const y = f(x);
        if (Number.isFinite(y)) {
          const theta = (n * Math.PI * x) / L;
          ca += w * y * Math.cos(theta);
          cb += w * y * Math.sin(theta);
        }
      } catch {}
    }
    a[n] = (ca * dx) / L;
    b[n] = (cb * dx) / L;
  }
  return { a0, a, b };
}

export default function FourierPage() {
  const [L, setL] = useState(Math.PI);
  const [N, setN] = useState(7);
  const [preset, setPreset] = useState<Preset>("square");
  const [a0, setA0] = useState(0);
  const [customA, setCustomA] = useState<number[]>(Array(21).fill(0));
  const [customB, setCustomB] = useState<number[]>(Array(21).fill(0));
  const [expression, setExpression] = useState("x");
  const [animate, setAnimate] = useState(true);
  const [showHarmonics, setShowHarmonics] = useState(true);
  const [animN, setAnimN] = useState(1);

  const compiledFn = useMemo(() => compileExpression(expression), [expression]);
  const exprValid = preset !== "expression" || compiledFn !== null;

  const { a0Used, aUsed, bUsed, targetFn } = useMemo(() => {
    if (preset === "custom") {
      return { a0Used: a0, aUsed: customA, bUsed: customB, targetFn: null as ((x: number) => number) | null };
    }
    if (preset === "expression" && compiledFn) {
      const c = numericalCoefficients(compiledFn, L, N);
      return { a0Used: c.a0, aUsed: c.a, bUsed: c.b, targetFn: compiledFn };
    }
    const c = presetCoefficients(preset, N);
    return { a0Used: c.a0, aUsed: c.a, bUsed: c.b, targetFn: null };
  }, [preset, N, a0, customA, customB, L, compiledFn]);

  useEffect(() => {
    if (!animate) {
      setAnimN(N);
      return;
    }
    setAnimN(1);
    let current = 1;
    const id = window.setInterval(() => {
      current = current >= N ? 1 : current + 1;
      setAnimN(current);
    }, 450);
    return () => window.clearInterval(id);
  }, [animate, N, preset]);

  const effectiveN = animate ? animN : N;

  const samples = 600;
  const { sumPoints, harmonicPaths, targetPoints } = useMemo(() => {
    const sum: Array<[number, number]> = [];
    const harmonics: Array<Array<[number, number]>> = Array.from({ length: N }, () => []);
    const target: Array<[number, number]> = [];
    const xMin = -2 * L;
    const xMax = 2 * L;
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      let y = a0Used / 2;
      for (let n = 1; n <= effectiveN; n++) {
        const an = aUsed[n] ?? 0;
        const bn = bUsed[n] ?? 0;
        const theta = (n * Math.PI * x) / L;
        const term = an * Math.cos(theta) + bn * Math.sin(theta);
        y += term;
        harmonics[n - 1].push([x, term]);
      }
      sum.push([x, y]);
      if (targetFn) {
        try {
          const tv = targetFn(x);
          if (Number.isFinite(tv)) target.push([x, tv]);
        } catch {}
      }
    }
    return { sumPoints: sum, harmonicPaths: harmonics.slice(0, effectiveN), targetPoints: target };
  }, [L, effectiveN, N, a0Used, aUsed, bUsed, targetFn]);

  const width = 820;
  const height = 380;
  const pad = 40;
  const xMin = -2 * L;
  const xMax = 2 * L;
  const allY = [...sumPoints.map((p) => p[1]), ...targetPoints.map((p) => p[1])];
  const yMax = Math.max(1.5, ...allY.map((v) => Math.abs(v))) * 1.15;

  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
  const sy = (y: number) => height / 2 - (y / yMax) * (height / 2 - pad);
  const toPath = (pts: Array<[number, number]>) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`).join(" ");

  const sumPath = toPath(sumPoints);
  const targetPath = targetFn ? toPath(targetPoints) : "";

  const harmonicColors = [
    "#f97316", "#eab308", "#84cc16", "#10b981", "#06b6d4",
    "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6",
  ];

  const updateCustom = (arr: number[], setter: (v: number[]) => void, idx: number, val: number) => {
    const next = [...arr];
    next[idx] = val;
    setter(next);
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Ryland&apos;s Harmonic Playground</h1>
          <p className="text-neutral-600 mt-2 max-w-3xl">
            A Fourier series visualizer. The partial sum{" "}
            <code className="bg-neutral-200 px-1 rounded">f(x) ≈ a₀/2 + Σₙ₌₁ᴺ [aₙ cos(nπx/L) + bₙ sin(nπx/L)]</code>{" "}
            approximates a periodic function. Use the presets, enter your own f(x), or type coefficients directly.
          </p>
          <dl className="mt-4 grid md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-neutral-700">
            {Object.values(DESCRIPTIONS).map((d) => (
              <dd key={d}>• {d}</dd>
            ))}
          </dl>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <svg width={width} height={height} className="w-full h-auto">
            <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke="#d4d4d4" />
            <line x1={sx(0)} y1={pad} x2={sx(0)} y2={height - pad} stroke="#d4d4d4" />
            <line x1={sx(-L)} y1={pad} x2={sx(-L)} y2={height - pad} stroke="#e5e5e5" strokeDasharray="4 4" />
            <line x1={sx(L)} y1={pad} x2={sx(L)} y2={height - pad} stroke="#e5e5e5" strokeDasharray="4 4" />

            {targetFn && <path d={targetPath} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" />}

            {showHarmonics &&
              harmonicPaths.map((pts, i) => (
                <path
                  key={i}
                  d={toPath(pts)}
                  fill="none"
                  stroke={harmonicColors[i % harmonicColors.length]}
                  strokeWidth={1.2}
                  opacity={0.55}
                />
              ))}

            <path d={sumPath} fill="none" stroke="#2563eb" strokeWidth={2.5} />

            <text x={sx(L) + 4} y={height / 2 - 6} fontSize="12" fill="#737373">L</text>
            <text x={sx(-L) + 4} y={height / 2 - 6} fontSize="12" fill="#737373">-L</text>
            <text x={width - pad - 140} y={pad + 4} fontSize="12" fill="#2563eb">
              ─ partial sum (N = {effectiveN})
            </text>
            {targetFn && (
              <text x={width - pad - 140} y={pad + 20} fontSize="12" fill="#64748b">
                ┄ target f(x)
              </text>
            )}
          </svg>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 space-y-4">
            <h2 className="font-semibold">Parameters</h2>

            <label className="block">
              <span className="text-sm text-neutral-700">Source</span>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value as Preset)}
                className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2"
              >
                <option value="square">Square wave (preset)</option>
                <option value="sawtooth">Sawtooth (preset)</option>
                <option value="triangle">Triangle (preset)</option>
                <option value="expression">Custom f(x) expression</option>
                <option value="custom">Manual coefficients</option>
              </select>
            </label>

            {preset === "expression" && (
              <label className="block">
                <span className="text-sm text-neutral-700">f(x) =</span>
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="e.g. x, sin(x) + 0.5*cos(2*x), abs(x), x*x"
                  className={`mt-1 w-full border rounded-md px-3 py-2 font-mono text-sm ${
                    exprValid ? "border-neutral-300" : "border-red-400 bg-red-50"
                  }`}
                />
                <span className="text-xs text-neutral-500 mt-1 block">
                  Allowed: x, +, -, *, /, ^, sin, cos, tan, abs, exp, log, sqrt, PI, E
                </span>
              </label>
            )}

            <label className="block">
              <span className="text-sm text-neutral-700">L (half-period): {L.toFixed(3)}</span>
              <input
                type="range"
                min={0.5}
                max={2 * Math.PI}
                step={0.01}
                value={L}
                onChange={(e) => setL(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block">
              <span className="text-sm text-neutral-700">N (number of harmonics): {N}</span>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={N}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full"
              />
            </label>

            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
                Animate build-up
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showHarmonics} onChange={(e) => setShowHarmonics(e.target.checked)} />
                Show individual harmonics
              </label>
            </div>

            {preset === "custom" && (
              <label className="block">
                <span className="text-sm text-neutral-700">a₀</span>
                <input
                  type="number"
                  step={0.1}
                  value={a0}
                  onChange={(e) => setA0(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2"
                />
              </label>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="font-semibold mb-4">
              {preset === "custom" ? "Custom coefficients" : "Computed coefficients"}
            </h2>
            <div className="max-h-[340px] overflow-y-auto pr-2">
              <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-2 items-center text-sm">
                <div className="font-medium">n</div>
                <div className="font-medium">aₙ</div>
                <div className="font-medium">bₙ</div>
                {Array.from({ length: N }, (_, i) => i + 1).map((n) => (
                  <CoefRow
                    key={n}
                    n={n}
                    an={aUsed[n] ?? 0}
                    bn={bUsed[n] ?? 0}
                    color={harmonicColors[(n - 1) % harmonicColors.length]}
                    editable={preset === "custom"}
                    onChangeA={(v) => updateCustom(customA, setCustomA, n, v)}
                    onChangeB={(v) => updateCustom(customB, setCustomB, n, v)}
                  />
                ))}
              </div>
            </div>
            {preset === "expression" && !exprValid && (
              <p className="text-xs text-red-600 mt-3">Invalid or disallowed expression — using empty coefficients.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CoefRow({
  n,
  an,
  bn,
  color,
  editable,
  onChangeA,
  onChangeB,
}: {
  n: number;
  an: number;
  bn: number;
  color: string;
  editable: boolean;
  onChangeA: (v: number) => void;
  onChangeB: (v: number) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-neutral-600">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
        {n}
      </div>
      {editable ? (
        <input
          type="number"
          step={0.1}
          value={an}
          onChange={(e) => onChangeA(parseFloat(e.target.value) || 0)}
          className="border border-neutral-300 rounded px-2 py-1"
        />
      ) : (
        <div className="font-mono text-neutral-700">{an.toFixed(3)}</div>
      )}
      {editable ? (
        <input
          type="number"
          step={0.1}
          value={bn}
          onChange={(e) => onChangeB(parseFloat(e.target.value) || 0)}
          className="border border-neutral-300 rounded px-2 py-1"
        />
      ) : (
        <div className="font-mono text-neutral-700">{bn.toFixed(3)}</div>
      )}
    </>
  );
}
