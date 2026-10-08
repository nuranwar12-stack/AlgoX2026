import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpDown, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Sparkles,
  Layers
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage5Props {
  onComplete: (scoreEarned: number) => void;
  onNextStage: () => void;
}

type AlgorithmType = 'bubble' | 'selection' | 'insertion';

interface SortStep {
  array: number[];
  comparingIndices: number[];
  swapped: boolean;
  sortedUpTo?: number; // elements guaranteed sorted
  explanation: string;
}

const INITIAL_ARRAY = [5, 2, 8, 1, 4];

export const Stage5Sorting: React.FC<Stage5Props> = ({ onComplete, onNextStage }) => {
  const [algo, setAlgo] = useState<AlgorithmType>('bubble');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [swapsCount, setSwapsCount] = useState<number>(0);

  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-generate steps for the current algorithm
  const generateSteps = (algorithm: AlgorithmType): { steps: SortStep[]; totalComp: number; totalSwap: number } => {
    const steps: SortStep[] = [];
    const arr = [...INITIAL_ARRAY];
    let comps = 0;
    let swaps = 0;

    // Initial state
    steps.push({
      array: [...arr],
      comparingIndices: [],
      swapped: false,
      explanation: `Kondisi awal data acak: [${arr.join(', ')}]. Siap diurutkan secara menaik (Ascending).`,
    });

    if (algorithm === 'bubble') {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comps++;
          const willSwap = arr[j] > arr[j + 1];
          if (willSwap) {
            swaps++;
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            steps.push({
              array: [...arr],
              comparingIndices: [j, j + 1],
              swapped: true,
              sortedUpTo: n - i,
              explanation: `Bandingkan ${arr[j + 1]} & ${arr[j]}: Karena ${arr[j + 1]} > ${arr[j]}, keduanya DITUKAR (swap).`,
            });
          } else {
            steps.push({
              array: [...arr],
              comparingIndices: [j, j + 1],
              swapped: false,
              sortedUpTo: n - i,
              explanation: `Bandingkan ${arr[j]} & ${arr[j + 1]}: Urutan sudah benar (${arr[j]} <= ${arr[j + 1]}), TIDAK ditukar.`,
            });
          }
        }
      }
    } else if (algorithm === 'selection') {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comps++;
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
          steps.push({
            array: [...arr],
            comparingIndices: [minIdx, j],
            swapped: false,
            sortedUpTo: i,
            explanation: `Mencari elemen terkecil di sisa array: Nilai minimum sementara saat ini adalah ${arr[minIdx]}.`,
          });
        }
        if (minIdx !== i) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          steps.push({
            array: [...arr],
            comparingIndices: [i, minIdx],
            swapped: true,
            sortedUpTo: i + 1,
            explanation: `Tukar nilai terkecil (${arr[i]}) ke posisi depan yang belum terurut (indeks ${i}).`,
          });
        }
      }
    } else if (algorithm === 'insertion') {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        steps.push({
          array: [...arr],
          comparingIndices: [i, j],
          swapped: false,
          sortedUpTo: i,
          explanation: `Ambil kartu ${key} (seperti kartu di tangan) untuk disisipkan ke bagian kiri yang sudah rapi.`,
        });

        while (j >= 0 && arr[j] > key) {
          comps++;
          swaps++;
          arr[j + 1] = arr[j];
          steps.push({
            array: [...arr],
            comparingIndices: [j, j + 1],
            swapped: true,
            sortedUpTo: i,
            explanation: `Geser ${arr[j]} ke kanan karena lebih besar dari kartu ${key}.`,
          });
          j--;
        }
        if (j >= 0) comps++;
        arr[j + 1] = key;
        steps.push({
          array: [...arr],
          comparingIndices: [j + 1, j + 1],
          swapped: false,
          sortedUpTo: i + 1,
          explanation: `Selipkan kartu ${key} pada slot kosong indeks ke-${j + 1}.`,
        });
      }
    }

    // Final completed step
    steps.push({
      array: [...arr],
      comparingIndices: [],
      swapped: false,
      sortedUpTo: arr.length,
      explanation: `🎉 SELESAI! Data berhasil diurutkan sempurna: [${arr.join(', ')}].`,
    });

    return { steps, totalComp: comps, totalSwap: swaps };
  };

  const [activeSteps, setActiveSteps] = useState<SortStep[]>(() => generateSteps('bubble').steps);

  // Switch algorithm
  const handleSelectAlgo = (selected: AlgorithmType) => {
    soundFX.playStep();
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setAlgo(selected);
    const { steps } = generateSteps(selected);
    setActiveSteps(steps);
    setCurrentStepIndex(0);
    setComparisonsCount(0);
    setSwapsCount(0);
  };

  // Next step
  const handleStepForward = () => {
    if (currentStepIndex >= activeSteps.length - 1) return;
    soundFX.playStep();
    const nextIdx = currentStepIndex + 1;
    setCurrentStepIndex(nextIdx);

    const step = activeSteps[nextIdx];
    if (step.comparingIndices.length > 0) {
      setComparisonsCount((prev) => prev + 1);
    }
    if (step.swapped) {
      setSwapsCount((prev) => prev + 1);
    }

    if (nextIdx === activeSteps.length - 1) {
      soundFX.playSuccess();
      triggerConfetti();
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete(15);
      }
    }
  };

  // Reset
  const handleReset = () => {
    soundFX.playStep();
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentStepIndex(0);
    setComparisonsCount(0);
    setSwapsCount(0);
  };

  // Play / Pause auto run
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= activeSteps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            soundFX.playSuccess();
            triggerConfetti();
            if (!hasCompleted) {
              setHasCompleted(true);
              onComplete(15);
            }
            return prev;
          }
          const next = prev + 1;
          const step = activeSteps[next];
          if (step.comparingIndices.length > 0) {
            setComparisonsCount((c) => c + 1);
          }
          if (step.swapped) {
            setSwapsCount((s) => s + 1);
          }
          soundFX.playStep();
          return next;
        });
      }, 700);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeSteps, hasCompleted]);

  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];
  const isFinished = currentStepIndex === activeSteps.length - 1;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 5 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Algoritma Pengurutan (Sorting)
            </span>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
            🎯 Data: [5, 2, 8, 1, 4]
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Game Sorting: Mengurutkan Kartu Angka
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Pengurutan adalah proses menata sekumpulan data ke dalam susunan tertentu (misalnya dari terkecil ke terbesar). Di sini kamu dapat mencoba <strong>Bubble Sort</strong>, <strong>Selection Sort</strong>, dan <strong>Insertion Sort</strong> langkah demi langkah.
        </p>

        {/* Algorithm Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => handleSelectAlgo('bubble')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              algo === 'bubble'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Bubble Sort
          </button>

          <button
            onClick={() => handleSelectAlgo('selection')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              algo === 'selection'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Selection Sort
          </button>

          <button
            onClick={() => handleSelectAlgo('insertion')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              algo === 'insertion'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Insertion Sort
          </button>
        </div>
      </div>

      {/* Interactive Sorting Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Metric Counters & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[10px] font-sans font-bold uppercase">Perbandingan:</span>
              <span className="text-sm font-extrabold text-slate-800">{comparisonsCount} kali</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[10px] font-sans font-bold uppercase">Pertukaran (Swap):</span>
              <span className="text-sm font-extrabold text-rose-700">{swapsCount} kali</span>
            </div>
          </div>

          {/* Action Buttons as requested */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStepForward}
              disabled={isFinished || isPlaying}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Periksa satu perbandingan selanjutnya"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>LANGKAH BERIKUTNYA</span>
            </button>

            <button
              onClick={togglePlay}
              disabled={isFinished}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'JEDA' : 'JALANKAN OTOMATIS'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Visual Cards Arena */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col items-center justify-center min-h-[220px]">
          <div className="flex items-end justify-center gap-3 sm:gap-4 flex-wrap">
            {currentStep.array.map((num, idx) => {
              const isComparing = currentStep.comparingIndices.includes(idx);
              const isSwapped = isComparing && currentStep.swapped;
              // height proportion
              const heightPx = 50 + num * 12;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  {/* Indicator badge */}
                  <div className="h-5 text-[10px] font-bold text-center">
                    {isSwapped ? (
                      <span className="text-rose-400 animate-bounce">TUKAR</span>
                    ) : isComparing ? (
                      <span className="text-amber-400">BANDING</span>
                    ) : null}
                  </div>

                  {/* Card Bar */}
                  <div
                    style={{ height: `${heightPx}px` }}
                    className={`w-14 sm:w-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black border-2 transition-all duration-300 shadow-md ${
                      isSwapped
                        ? 'bg-rose-500 border-rose-300 text-white scale-110 shadow-rose-500/50'
                        : isComparing
                        ? 'bg-amber-500 border-amber-300 text-white scale-105 shadow-amber-500/50'
                        : isFinished
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    {num}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    Posisi {idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation Callout */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            {currentStepIndex + 1}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Analisis Langkah:
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-800 mt-0.5 leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>
        </div>

        {/* Concept Card Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className={`p-3.5 rounded-2xl border ${algo === 'bubble' ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <h4 className="font-bold text-slate-900 mb-1">🫧 Bubble Sort</h4>
            <p>Membandingkan 2 tetangga bersebelahan. Elemen terbesar mengapung ke kanan seperti gelembung.</p>
          </div>

          <div className={`p-3.5 rounded-2xl border ${algo === 'selection' ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <h4 className="font-bold text-slate-900 mb-1">🎯 Selection Sort</h4>
            <p>Mencari elemen terkecil di seluruh sisa data, lalu memindahkannya langsung ke depan.</p>
          </div>

          <div className={`p-3.5 rounded-2xl border ${algo === 'insertion' ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <h4 className="font-bold text-slate-900 mb-1">🃏 Insertion Sort</h4>
            <p>Mirip mengurutkan kartu remi di tangan: kartu baru diselipkan di posisi terurut yang pas.</p>
          </div>
        </div>
      </div>

      {/* Stage Bottom Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          Progres: <strong className="text-slate-900">{isFinished ? 'Sorting Tuntas Dipraktikkan!' : 'Tekan Langkah atau Jalankan Otomatis'}</strong>
        </div>

        <button
          onClick={onNextStage}
          className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>LANJUT KE TAHAP 6 (QUEUE &amp; STACK)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
