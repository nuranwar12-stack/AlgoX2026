import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Zap, 
  Layers,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage4Props {
  onComplete: (scoreEarned: number) => void;
  onNextStage: () => void;
}

export const Stage4Searching: React.FC<Stage4Props> = ({ onComplete, onNextStage }) => {
  const [mode, setMode] = useState<'linear' | 'binary'>('linear');

  // Datasets as requested in prompt:
  // Linear data (unsorted): [12, 7, 25, 3, 18, 9, 30]
  const unsortedData = [12, 7, 25, 3, 18, 9, 30];
  // Binary data (sorted): [3, 7, 9, 12, 18, 25, 30]
  const sortedData = [3, 7, 9, 12, 18, 25, 30];

  const [targetNumber, setTargetNumber] = useState<number>(18);

  // Linear state
  const [linearCurrentIndex, setLinearCurrentIndex] = useState<number | null>(null);
  const [linearStepsCount, setLinearStepsCount] = useState<number>(0);
  const [isSearchingLinear, setIsSearchingLinear] = useState<boolean>(false);
  const [linearResult, setLinearResult] = useState<string | null>(null);

  // Binary state
  const [binaryLow, setBinaryLow] = useState<number | null>(null);
  const [binaryHigh, setBinaryHigh] = useState<number | null>(null);
  const [binaryMid, setBinaryMid] = useState<number | null>(null);
  const [binaryStepsCount, setBinaryStepsCount] = useState<number>(0);
  const [isSearchingBinary, setIsSearchingBinary] = useState<boolean>(false);
  const [binaryResult, setBinaryResult] = useState<string | null>(null);
  const [binaryLogs, setBinaryLogs] = useState<string[]>([]);

  // Challenge quiz
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  // Linear search simulation
  const startLinearSearch = () => {
    if (isSearchingLinear) return;
    setIsSearchingLinear(true);
    setLinearResult(null);
    setLinearStepsCount(0);
    setLinearCurrentIndex(null);
    soundFX.playStep();

    let idx = 0;
    const interval = setInterval(() => {
      setLinearCurrentIndex(idx);
      setLinearStepsCount(idx + 1);
      soundFX.playStep();

      if (unsortedData[idx] === targetNumber) {
        clearInterval(interval);
        setIsSearchingLinear(false);
        soundFX.playSuccess();
        setLinearResult(`DITEMUKAN di indeks ke-${idx}! Total pemeriksaan: ${idx + 1} langkah.`);
      } else if (idx >= unsortedData.length - 1) {
        clearInterval(interval);
        setIsSearchingLinear(false);
        soundFX.playError();
        setLinearResult(`Data ${targetNumber} TIDAK DITEMUKAN setelah memeriksa semua ${unsortedData.length} elemen.`);
      } else {
        idx++;
      }
    }, 550);
  };

  // Binary search simulation
  const startBinarySearch = () => {
    if (isSearchingBinary) return;
    setIsSearchingBinary(true);
    setBinaryResult(null);
    setBinaryStepsCount(0);
    setBinaryLogs([]);
    soundFX.playStep();

    let low = 0;
    let high = sortedData.length - 1;
    let steps = 0;
    const logs: string[] = [];

    const stepInterval = () => {
      if (low > high) {
        setIsSearchingBinary(false);
        soundFX.playError();
        setBinaryResult(`Data ${targetNumber} tidak ditemukan.`);
        return;
      }

      steps++;
      setBinaryStepsCount(steps);
      const mid = Math.floor((low + high) / 2);
      setBinaryLow(low);
      setBinaryHigh(high);
      setBinaryMid(mid);
      soundFX.playStep();

      const midVal = sortedData[mid];
      logs.push(`Langkah ${steps}: Low=${low}, High=${high} → Elemen Tengah [indeks ${mid}] = ${midVal}`);
      setBinaryLogs([...logs]);

      if (midVal === targetNumber) {
        setIsSearchingBinary(false);
        soundFX.playSuccess();
        setBinaryResult(`DITEMUKAN! Angka ${targetNumber} di indeks ke-${mid} hanya dalam ${steps} langkah pembagian!`);
      } else if (midVal < targetNumber) {
        logs.push(`Karena ${midVal} < ${targetNumber}, buang area kiri! Persempit ke area kanan.`);
        setBinaryLogs([...logs]);
        low = mid + 1;
        setTimeout(stepInterval, 850);
      } else {
        logs.push(`Karena ${midVal} > ${targetNumber}, buang area kanan! Persempit ke area kiri.`);
        setBinaryLogs([...logs]);
        high = mid - 1;
        setTimeout(stepInterval, 850);
      }
    };

    setTimeout(stepInterval, 400);
  };

  const handleQuiz = (choice: 'binary' | 'linear') => {
    soundFX.playStep();
    setQuizAnswer(choice);
    if (choice === 'binary') {
      soundFX.playSuccess();
      triggerConfetti();
      setQuizFeedback('Tepat Sekali! Untuk data yang sudah terurut, Binary Search jauh lebih cepat karena memangkas separuh data di setiap perbandingan (kompleksitas O(log n) vs Linear O(n)).');
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete(15);
      }
    } else {
      soundFX.playError();
      setQuizFeedback('Belum Tepat. Linear Search harus memeriksa satu demi satu data dari depan ke belakang sehingga membutuhkan waktu lebih lama.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 4 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Algoritma Pencarian (Searching)
            </span>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
            🎯 Bandingkan Linear vs Binary Search
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Game “Temukan Angkanya!”
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Mencari data adalah salah satu tugas paling sering dilakukan komputer. Kita akan melihat bagaimana cara kerja <strong>Linear Search (satu per satu)</strong> dibandingkan dengan <strong>Binary Search (bagi dua / divide &amp; conquer)</strong>.
        </p>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              soundFX.playStep();
              setMode('linear');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'linear'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. Mode Linear Search (Data Acak)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setMode('binary');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'binary'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. Mode Binary Search (Data Terurut)</span>
          </button>
        </div>
      </div>

      {/* Target Number Picker */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Pilih Target Angka yang Ingin Dicari:
          </span>
          <p className="text-xs text-slate-500">
            Pilih salah satu angka untuk diuji kecepatannya.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[3, 7, 18, 25, 30].map((num) => (
            <button
              key={num}
              onClick={() => {
                soundFX.playStep();
                setTargetNumber(num);
                setLinearResult(null);
                setBinaryResult(null);
              }}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                targetNumber === num
                  ? 'bg-indigo-600 text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Mode Linear Search */}
      {mode === 'linear' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Linear Search: Memeriksa dari Awal Hingga Akhir
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Data tidak perlu terurut: [12, 7, 25, 3, 18, 9, 30]. Komputer mengecek satu per satu elemen.
              </p>
            </div>

            <button
              onClick={startLinearSearch}
              disabled={isSearchingLinear}
              className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSearchingLinear ? 'Mencari...' : `CARI ANGKA ${targetNumber}`}</span>
            </button>
          </div>

          {/* Cards Display */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>ARRAY DATA:</span>
              <span className="font-mono text-amber-400 font-bold">Langkah Pemeriksaan: {linearStepsCount}</span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-4">
              {unsortedData.map((val, idx) => {
                const isCurrent = linearCurrentIndex === idx;
                const isFound = isCurrent && val === targetNumber;
                const isPassed = linearCurrentIndex !== null && idx < linearCurrentIndex;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">Idx {idx}</span>
                    <div
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-extrabold border-2 transition-all ${
                        isFound
                          ? 'bg-emerald-500 border-emerald-300 text-white shadow-lg scale-110 ring-4 ring-emerald-400/50'
                          : isCurrent
                          ? 'bg-amber-500 border-amber-300 text-white shadow-lg scale-110 animate-pulse'
                          : isPassed
                          ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-60'
                          : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      {val}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">
                      {isFound ? '✅ Ketemu' : isCurrent ? '🔍 Dicek' : isPassed ? '❌ Bukan' : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            {linearResult && (
              <div className="mt-4 p-3 bg-slate-800 rounded-xl border border-slate-700 text-center font-bold text-xs text-amber-300">
                {linearResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Mode Binary Search */}
      {mode === 'binary' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Binary Search: Syarat Mutlak Data Harus TERURUT
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Data terurut: [3, 7, 9, 12, 18, 25, 30]. Di setiap langkah, ruang pencarian dipotong 50%!
              </p>
            </div>

            <button
              onClick={startBinarySearch}
              disabled={isSearchingBinary}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSearchingBinary ? 'Membagi Area...' : `CARI ANGKA ${targetNumber}`}</span>
            </button>
          </div>

          {/* Cards Display with Low, Mid, High pointers */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>ARRAY TERURUT (SORTED):</span>
              <span className="font-mono text-indigo-400 font-bold">Langkah Pembagian: {binaryStepsCount}</span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-4">
              {sortedData.map((val, idx) => {
                const isMid = binaryMid === idx;
                const isLow = binaryLow === idx;
                const isHigh = binaryHigh === idx;
                const isExcluded = binaryLow !== null && binaryHigh !== null && (idx < binaryLow || idx > binaryHigh);
                const isFound = isMid && val === targetNumber;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="flex gap-1 text-[9px] font-bold">
                      {isLow && <span className="text-emerald-400 bg-emerald-950 px-1 rounded">L</span>}
                      {isMid && <span className="text-amber-400 bg-amber-950 px-1 rounded">MID</span>}
                      {isHigh && <span className="text-rose-400 bg-rose-950 px-1 rounded">H</span>}
                    </div>

                    <div
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-extrabold border-2 transition-all ${
                        isFound
                          ? 'bg-emerald-500 border-emerald-300 text-white shadow-lg scale-110 ring-4 ring-emerald-400/50'
                          : isMid
                          ? 'bg-amber-500 border-amber-300 text-white shadow-lg scale-110'
                          : isExcluded
                          ? 'bg-slate-950 border-slate-900 text-slate-600 line-through opacity-30'
                          : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      {val}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Idx {idx}</span>
                  </div>
                );
              })}
            </div>

            {/* Binary search logs */}
            {binaryLogs.length > 0 && (
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                {binaryLogs.map((log, idx) => (
                  <p key={idx} className="text-slate-300">{log}</p>
                ))}
              </div>
            )}

            {binaryResult && (
              <div className="mt-4 p-3 bg-emerald-950/80 rounded-xl border border-emerald-700 text-center font-bold text-xs text-emerald-300">
                {binaryResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparative Challenge */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-4">
        <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          Tantangan Efisiensi: “Mana yang Lebih Cepat untuk Data Terurut?”
        </h3>
        <p className="text-xs text-amber-800">
          Bayangkan kamu mencari 1 nama siswa di dalam buku direktori sekolah yang berisi 1.000 nama siswa tersusun rapi dari A sampai Z.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleQuiz('binary')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              quizAnswer === 'binary'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-900'
            }`}
          >
            <span className="text-xs font-bold block opacity-80 uppercase">Pilihan A:</span>
            <h4 className="text-sm font-extrabold mt-0.5">Binary Search (Bagi Dua Area)</h4>
            <p className="text-xs mt-1 opacity-90">Hanya membutuhkan sekitar ~10 kali langkah perbandingan!</p>
          </button>

          <button
            onClick={() => handleQuiz('linear')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              quizAnswer === 'linear'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white hover:bg-rose-50 border-slate-300 text-slate-900'
            }`}
          >
            <span className="text-xs font-bold block opacity-80 uppercase">Pilihan B:</span>
            <h4 className="text-sm font-extrabold mt-0.5">Linear Search (Satu per Satu)</h4>
            <p className="text-xs mt-1 opacity-90">Bisa membutuhkan hingga 1.000 kali pemeriksaan berurutan.</p>
          </button>
        </div>

        {quizFeedback && (
          <div className="mt-3 p-3.5 bg-white rounded-xl border border-amber-300 text-xs text-amber-950 font-medium">
            {quizFeedback}
          </div>
        )}
      </div>

      {/* Stage Bottom Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          Status: <strong className="text-slate-900">Linear vs Binary Selesai Dipelajari</strong>
        </div>

        <button
          onClick={onNextStage}
          className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>LANJUT KE TAHAP 5 (SORTING)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
