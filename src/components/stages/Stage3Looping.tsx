import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  BatteryCharging, 
  Battery, 
  Sparkles, 
  HelpCircle,
  Footprints,
  Grid
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage3Props {
  onComplete: (scoreEarned: number) => void;
  onNextStage: () => void;
}

export const Stage3Looping: React.FC<Stage3Props> = ({ onComplete, onNextStage }) => {
  const [activeTab, setActiveTab] = useState<'for' | 'while' | 'do-while' | 'nested'>('for');

  // For Loop State
  const [forIterations, setForIterations] = useState<number>(5);
  const [robotPosition, setRobotPosition] = useState<number>(0);
  const [isRunningFor, setIsRunningFor] = useState<boolean>(false);
  const [forQuizAnswer, setForQuizAnswer] = useState<number | null>(null);
  const [forQuizFeedback, setForQuizFeedback] = useState<string | null>(null);

  // While Loop State
  const [initialEnergy, setInitialEnergy] = useState<number>(4);
  const [currentEnergy, setCurrentEnergy] = useState<number>(4);
  const [whileRobotPos, setWhileRobotPos] = useState<number>(0);
  const [isRunningWhile, setIsRunningWhile] = useState<boolean>(false);
  const [whileLogs, setWhileLogs] = useState<string[]>([]);

  // Do-While State
  const [doWhileEnergy, setDoWhileEnergy] = useState<number>(0); // intentionally 0 to demonstrate 1 execution
  const [doWhileRobotPos, setDoWhileRobotPos] = useState<number>(0);
  const [isDoneDoWhile, setIsDoneDoWhile] = useState<boolean>(false);
  const [doWhileLogs, setDoWhileLogs] = useState<string[]>([]);

  // Nested Loop (Stars Pattern)
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(4);
  const [currentStarIndex, setCurrentStarIndex] = useState<{ r: number; c: number } | null>(null);
  const [isGeneratingPattern, setIsGeneratingPattern] = useState<boolean>(false);

  // Completed trackers
  const [completed, setCompleted] = useState({
    for: false,
    while: false,
    doWhile: false,
    nested: false,
  });

  // Run For Loop Animation
  const runForLoop = () => {
    if (isRunningFor) return;
    setIsRunningFor(true);
    setRobotPosition(0);
    soundFX.playStep();

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRobotPosition(step);
      soundFX.playStep();

      if (step >= forIterations) {
        clearInterval(interval);
        setIsRunningFor(false);
      }
    }, 450);
  };

  // Check For Loop Quiz
  const handleForQuiz = (val: number) => {
    soundFX.playStep();
    setForQuizAnswer(val);
    if (val === 5) {
      soundFX.playSuccess();
      setForQuizFeedback('Tepat sekali! Loop for (i=1; i<=5; i++) mengulang instruksi tepat 5 kali.');
      if (!completed.for) {
        setCompleted((prev) => ({ ...prev, for: true }));
        onComplete(10);
      }
    } else {
      soundFX.playError();
      setForQuizFeedback(`Kurang tepat. Karena rentang penghitung dimulai dari 1 hingga 5 secara inklusif, perintah dieksekusi 5 kali.`);
    }
  };

  // Run While Loop
  const runWhileLoop = () => {
    if (isRunningWhile) return;
    setIsRunningWhile(true);
    setWhileRobotPos(0);
    let energy = initialEnergy;
    setCurrentEnergy(energy);
    const logs: string[] = [];
    logs.push(`Cek Awal: Apakah energi (${energy}) > 0 ?`);

    if (energy <= 0) {
      logs.push(`Kondisi FALSE! Robot sama sekali tidak melangkah.`);
      setWhileLogs(logs);
      setIsRunningWhile(false);
      return;
    }

    let pos = 0;
    const interval = setInterval(() => {
      pos++;
      energy--;
      setWhileRobotPos(pos);
      setCurrentEnergy(energy);
      soundFX.playStep();
      logs.push(`Langkah ke-${pos}: Robot maju. Energi tersisa = ${energy}.`);

      if (energy <= 0) {
        clearInterval(interval);
        logs.push(`Kondisi energi > 0 menjadi FALSE. Loop berhenti.`);
        setWhileLogs([...logs]);
        setIsRunningWhile(false);
        if (!completed.while) {
          soundFX.playSuccess();
          setCompleted((prev) => ({ ...prev, while: true }));
          onComplete(10);
        }
      } else {
        setWhileLogs([...logs]);
      }
    }, 600);
  };

  // Run Do-While
  const runDoWhile = () => {
    const logs: string[] = [];
    soundFX.playStep();
    // Execute body first
    logs.push(`Langkah 1: Robot melakukan aksi melangkah terlebih dahulu!`);
    setDoWhileRobotPos(1);

    setTimeout(() => {
      logs.push(`Cek Kondisi di Bawah: Apakah energi (${doWhileEnergy}) > 0? -> FALSE!`);
      logs.push(`Perulangan berhenti. Hasil: Robot sempat melangkah 1 kali walau energi awal 0.`);
      setDoWhileLogs(logs);
      setIsDoneDoWhile(true);
      soundFX.playSuccess();
      if (!completed.doWhile) {
        setCompleted((prev) => ({ ...prev, doWhile: true }));
        onComplete(10);
      }
    }, 500);
  };

  // Generate Nested Loop Stars
  const generateStars = () => {
    if (isGeneratingPattern) return;
    setIsGeneratingPattern(true);
    soundFX.playStep();
    let r = 1;
    let c = 1;

    const interval = setInterval(() => {
      setCurrentStarIndex({ r, c });
      soundFX.playStep();

      c++;
      if (c > cols) {
        c = 1;
        r++;
      }

      if (r > rows) {
        clearInterval(interval);
        setIsGeneratingPattern(false);
        triggerConfetti();
        soundFX.playSuccess();
        if (!completed.nested) {
          setCompleted((prev) => ({ ...prev, nested: true }));
          onComplete(10);
        }
      }
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 3 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Struktur Kontrol Perulangan (Looping)
            </span>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
            🤖 Game: Bantu Robot Berjalan
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Game Looping (Perulangan)
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Daripada menulis 1.000 baris kode yang sama, kita menggunakan <strong>perulangan (looping)</strong> agar komputer mengeksekusi instruksi berulang kali secara efisien.
        </p>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('for');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'for'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. Loop For</span>
            {completed.for && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('while');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'while'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. Loop While</span>
            {completed.while && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('do-while');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'do-while'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>3. Do - While</span>
            {completed.doWhile && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('nested');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'nested'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>4. Nested Loop</span>
            {completed.nested && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* 1. Loop FOR */}
      {activeTab === 'for' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Perulangan For: Jumlah Langkah Sudah Pasti (Definite)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Contoh instruksi: <code>for (i = 1; i &lt;= {forIterations}; i++) {'{ robot.maju(); }'}</code>
            </p>
          </div>

          {/* Robot Track Animation */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>LINTASAN ROBOT:</span>
              <span className="font-mono text-indigo-400 font-bold">Langkah ke: {robotPosition} dari {forIterations}</span>
            </div>

            {/* Visual Grid Track */}
            <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 bg-slate-950/70 rounded-xl border border-slate-800">
              {Array.from({ length: 8 }).map((_, idx) => {
                const stepNum = idx + 1;
                const isTarget = stepNum <= forIterations;
                const isCurrentRobotHere = robotPosition === stepNum || (robotPosition === 0 && idx === 0);

                return (
                  <div
                    key={idx}
                    className={`w-14 h-16 rounded-xl flex flex-col items-center justify-between p-2 border-2 transition-all shrink-0 ${
                      isCurrentRobotHere
                        ? 'bg-indigo-600/90 border-indigo-400 shadow-lg scale-105 ring-2 ring-indigo-400/50'
                        : isTarget
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-900/40 border-slate-800 opacity-30'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">{stepNum}</span>
                    <div className="text-xl">
                      {isCurrentRobotHere ? '🤖' : isTarget ? '➡️' : '🏁'}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">
                      {isCurrentRobotHere ? 'Posisi' : isTarget ? 'Target' : 'Off'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Slider & Run Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Set Langkah For (n):</span>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={forIterations}
                  disabled={isRunningFor}
                  onChange={(e) => {
                    setForIterations(Number(e.target.value));
                    setRobotPosition(0);
                  }}
                  className="w-32 h-2 bg-slate-700 rounded-lg cursor-pointer accent-indigo-500"
                />
                <span className="font-mono text-indigo-400 font-bold text-sm">{forIterations}x</span>
              </div>

              <button
                onClick={runForLoop}
                disabled={isRunningFor}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningFor ? 'Robot Melangkah...' : 'JALANKAN LOOP FOR'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Question */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-700" />
              Pertanyaan Pemahaman:
            </h3>
            <p className="text-xs text-indigo-900 mt-1">
              “Jika instruksi <code>for (i = 1; i &lt;= 5; i++)</code> dijalankan, berapa total kali robot melakukan gerakan melangkah?”
            </p>

            <div className="grid grid-cols-4 gap-2.5 mt-3">
              {[3, 4, 5, 6].map((ans) => (
                <button
                  key={ans}
                  onClick={() => handleForQuiz(ans)}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    forQuizAnswer === ans
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white hover:bg-indigo-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {ans} Kali
                </button>
              ))}
            </div>

            {forQuizFeedback && (
              <p className="mt-3 text-xs font-semibold text-indigo-900 bg-white/80 p-2.5 rounded-lg border border-indigo-200">
                {forQuizFeedback}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. Loop WHILE */}
      {activeTab === 'while' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Perulangan While: Berjalan Selama Kondisi Bernilai True
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aturan: “Robot berjalan selama <code>energi &gt; 0</code>. Di setiap langkah, energi berkurang 1.”
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>INDIKATOR BATERAI ROBOT:</span>
                  <span className="font-mono text-amber-400 font-bold">{currentEnergy} Unit</span>
                </div>

                {/* Energy Bar */}
                <div className="w-full bg-slate-800 h-6 rounded-xl overflow-hidden p-1 border border-slate-700">
                  <div
                    className={`h-full rounded-lg transition-all duration-300 ${
                      currentEnergy > 2
                        ? 'bg-emerald-500'
                        : currentEnergy > 0
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (currentEnergy / 6) * 100)}%` }}
                  />
                </div>

                <div className="mt-6 text-center">
                  <div className="text-4xl my-2">🤖</div>
                  <p className="text-xs font-mono text-slate-300">
                    Posisi Robot: <span className="text-indigo-400 font-bold">{whileRobotPos} langkah</span>
                  </p>
                </div>
              </div>

              {/* Set Initial Energy & Start */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Atur Energi Awal:</span>
                  <div className="flex gap-1.5">
                    {[0, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setInitialEnergy(num);
                          setCurrentEnergy(num);
                          setWhileRobotPos(0);
                          setWhileLogs([]);
                        }}
                        disabled={isRunningWhile}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          initialEnergy === num
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={runWhileLoop}
                  disabled={isRunningWhile}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningWhile ? 'Menjalankan Loop...' : 'JALANKAN WHILE (ENERGI > 0)'}</span>
                </button>
              </div>
            </div>

            {/* Trace Execution Logs */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Catatan Eksekusi Komputer (Tracing):
                </span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto font-mono text-xs">
                  {whileLogs.length === 0 ? (
                    <p className="text-slate-400 italic">Klik tombol "JALANKAN WHILE" untuk melihat langkah eksekusi.</p>
                  ) : (
                    whileLogs.map((log, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800 text-[11px]">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                💡 <strong>Catatan Kunci:</strong> Pada loop <code>while</code>, kondisi dicek <em>di awal</em>. Jika energi awal adalah <strong>0</strong>, loop tidak akan berjalan sama sekali!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Loop DO-WHILE */}
      {activeTab === 'do-while' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Perulangan Do-While: Eksekusi Minimal 1 Kali!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Beda utama dengan while: Do-while mengeksekusi instruksi <strong>dulu</strong>, baru kemudian mengecek kondisi di bagian bawah.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">EKSPERIMEN: ENERGI AWAL = 0</span>
              <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2 py-1 rounded-md border border-rose-800">
                Kondisi energi &gt; 0 bernilai SALAH sejak awal!
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300">
              <p className="text-slate-500">// Struktur Do-While:</p>
              <p className="font-bold text-amber-300">do {'{'}</p>
              <p className="pl-4 text-emerald-300">robot.maju(); // Dilakukan SEBELUM cek kondisi!</p>
              <p className="font-bold text-amber-300">{'}'} while (energi &gt; 0);</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-300">
                Robot Melangkah: <strong className="text-emerald-400 font-mono text-sm">{doWhileRobotPos} kali</strong>
              </div>

              <button
                onClick={runDoWhile}
                className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>UJI EKSEKUSI DO-WHILE</span>
              </button>
            </div>
          </div>

          {doWhileLogs.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <h4 className="font-bold text-sm">Pembuktian Berhasil:</h4>
              {doWhileLogs.map((log, idx) => (
                <p key={idx}>• {log}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Nested Loop (Pola Bintang) */}
      {activeTab === 'nested' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Nested Loop: Loop di Dalam Loop (Pola Grid Bintang)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Loop luar mengatur <strong>baris (i)</strong>, loop dalam mengatur <strong>kolom (j)</strong>. Total eksekusi = Baris × Kolom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Control Panel */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Jumlah Baris (Loop Luar i):</span>
                  <span className="font-mono text-indigo-700">{rows} baris</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={rows}
                  disabled={isGeneratingPattern}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Jumlah Kolom (Loop Dalam j):</span>
                  <span className="font-mono text-indigo-700">{cols} kolom</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={cols}
                  disabled={isGeneratingPattern}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block">Total Eksekusi Loop:</span>
                <span className="text-base font-extrabold text-indigo-700">
                  {rows} × {cols} = {rows * cols} Bintang
                </span>
              </div>

              <button
                onClick={generateStars}
                disabled={isGeneratingPattern}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Grid className="w-4 h-4" />
                <span>{isGeneratingPattern ? 'Mencetak Bintang...' : 'GENERATE POLA BINTANG'}</span>
              </button>
            </div>

            {/* Pattern Display Screen */}
            <div className="md:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col justify-center items-center min-h-[220px]">
              <div className="space-y-3">
                {Array.from({ length: rows }).map((_, rIdx) => {
                  const r = rIdx + 1;
                  return (
                    <div key={r} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500 w-8">i={r}</span>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: cols }).map((_, cIdx) => {
                          const c = cIdx + 1;
                          const isCurrent = currentStarIndex?.r === r && currentStarIndex?.c === c;
                          return (
                            <div
                              key={c}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                                isCurrent
                                  ? 'bg-amber-400 text-slate-900 scale-125 shadow-lg'
                                  : 'bg-slate-800 text-amber-400 border border-slate-700'
                              }`}
                            >
                              ★
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage Bottom Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-bold text-slate-800">Capaian Tahap 3:</span>
          <span className={completed.for ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>For</span>
          <span>·</span>
          <span className={completed.while ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>While</span>
          <span>·</span>
          <span className={completed.doWhile ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>Do-While</span>
          <span>·</span>
          <span className={completed.nested ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>Nested</span>
        </div>

        <button
          onClick={onNextStage}
          className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>LANJUT KE TAHAP 4 (SEARCHING)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
