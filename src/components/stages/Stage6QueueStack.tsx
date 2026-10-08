import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  ArrowRight, 
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Disc
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage6Props {
  onComplete: (scoreEarned: number) => void;
  onNextStage: () => void;
}

const SAMPLE_NAMES = ['Ahmad (A)', 'Budi (B)', 'Cantika (C)', 'Doni (D)', 'Elsa (E)', 'Fajar (F)'];
const PLATE_COLORS = [
  'bg-indigo-500 border-indigo-400',
  'bg-emerald-500 border-emerald-400',
  'bg-amber-500 border-amber-400',
  'bg-rose-500 border-rose-400',
  'bg-purple-500 border-purple-400',
];

export const Stage6QueueStack: React.FC<Stage6Props> = ({ onComplete, onNextStage }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'stack'>('queue');

  // Queue State (FIFO)
  const [queue, setQueue] = useState<string[]>(['Ahmad (A)', 'Budi (B)', 'Cantika (C)']);
  const [queueLog, setQueueLog] = useState<string>('Antrean kasir kantin awal: Ahmad, Budi, Cantika.');

  // Stack State (LIFO)
  const [stack, setStack] = useState<string[]>(['Piring Dasar (A)', 'Piring Tengah (B)', 'Piring Atas (C)']);
  const [stackLog, setStackLog] = useState<string>('Tumpukan piring di meja: A paling bawah, B di tengah, C paling atas.');

  // Mini Challenge Quiz
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  // Queue Operations
  const handleEnqueue = () => {
    if (queue.length >= 6) {
      soundFX.playError();
      setQueueLog('Antrean sudah penuh maksimal 6 orang!');
      return;
    }
    soundFX.playStep();
    const nextName = SAMPLE_NAMES[queue.length % SAMPLE_NAMES.length];
    const newQueue = [...queue, nextName];
    setQueue(newQueue);
    setQueueLog(`[ENQUEUE]: ${nextName} datang dan bergabung di belakang antrean (REAR).`);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      soundFX.playError();
      setQueueLog('Antrean kosong, tidak ada yang bisa dilayani.');
      return;
    }
    soundFX.playSuccess();
    const served = queue[0];
    const newQueue = queue.slice(1);
    setQueue(newQueue);
    setQueueLog(`[DEQUEUE]: ${served} selesai dilayani kasir dan keluar lebih dahulu (FRONT). Sesuai aturan FIFO!`);
  };

  // Stack Operations
  const handlePush = () => {
    if (stack.length >= 6) {
      soundFX.playError();
      setStackLog('Tumpukan sudah terlalu tinggi dan rawan jatuh (Stack Overflow)!');
      return;
    }
    soundFX.playStep();
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const letter = letters[stack.length] || 'X';
    const newPlate = `Piring ${letter}`;
    setStack([...stack, newPlate]);
    setStackLog(`[PUSH]: Menaruh ${newPlate} ke posisi paling atas (TOP) tumpukan.`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      soundFX.playError();
      setStackLog('Tumpukan piring kosong (Stack Underflow)!');
      return;
    }
    soundFX.playSuccess();
    const popped = stack[stack.length - 1];
    setStack(stack.slice(0, stack.length - 1));
    setStackLog(`[POP]: Mengambil ${popped} dari posisi teratas (TOP). Sesuai aturan LIFO!`);
  };

  const handleQuiz = (ans: string) => {
    soundFX.playStep();
    setQuizAnswer(ans);
    if (ans === 'C') {
      soundFX.playSuccess();
      triggerConfetti();
      setQuizFeedback('Tepat Sekali! Karena Stack menerapkan LIFO (Last In First Out), elemen C yang dimasukkan terakhir berada di paling atas (TOP) sehingga dialah yang pertama kali terambil saat operasi POP.');
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete(15);
      }
    } else {
      soundFX.playError();
      setQuizFeedback(`Kurang tepat. Ingat analogi piring: Piring A berada di paling dasar tertindih piring lain. Kamu harus mengambil piring paling atas (C) terlebih dahulu.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 6 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Struktur Data Linear
            </span>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
            🎯 FIFO vs LIFO di Dunia Nyata
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Game Queue (Antrean) &amp; Stack (Tumpukan)
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Struktur data mengatur bagaimana informasi disimpan dan diakses dalam memori komputer. Dua struktur data paling penting adalah <strong>Queue (FIFO)</strong> dan <strong>Stack (LIFO)</strong>.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('queue');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. Queue — Antrean Kasir (FIFO)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('stack');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'stack'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. Stack — Tumpukan Piring (LIFO)</span>
          </button>
        </div>
      </div>

      {/* 1. Queue Section */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Queue: First In First Out (FIFO)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                “Yang pertama datang, dialah yang pertama dilayani dan keluar!”
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEnqueue}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>MASUKKAN (ENQUEUE)</span>
              </button>

              <button
                onClick={handleDequeue}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>KELUARKAN (DEQUEUE)</span>
              </button>
            </div>
          </div>

          {/* Visual Queue Stage */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                💳 Kasir Kantin (FRONT)
              </span>
              <span className="flex items-center gap-1 text-purple-400 font-bold">
                Pintu Masuk (REAR) ➡️
              </span>
            </div>

            {/* People In Queue */}
            <div className="min-h-[140px] bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3 overflow-x-auto">
              {queue.length === 0 ? (
                <div className="w-full text-center py-8 text-slate-500 italic text-xs">
                  Antrean kasir sedang kosong. Tekan "MASUKKAN (ENQUEUE)" untuk menambah antrean!
                </div>
              ) : (
                queue.map((person, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === queue.length - 1;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-between min-w-[120px] transition-all ${
                        isFront
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 scale-105'
                          : isRear
                          ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {isFront ? '🌟 FRONT (Keluar)' : isRear ? 'REAR (Masuk)' : `Urutan #${idx + 1}`}
                      </span>

                      <div className="text-3xl my-2">👤</div>

                      <span className="text-xs font-bold text-center leading-tight truncate w-full">
                        {person}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Queue status log */}
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-purple-300 font-mono">
              &gt; {queueLog}
            </div>
          </div>
        </div>
      )}

      {/* 2. Stack Section */}
      {activeTab === 'stack' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Stack: Last In First Out (LIFO)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                “Yang terakhir dimasukkan, dialah yang pertama diambil dan keluar!”
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePush}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>PUSH (TUMPUK)</span>
              </button>

              <button
                onClick={handlePop}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>POP (AMBIL DARI ATAS)</span>
              </button>
            </div>
          </div>

          {/* Visual Stack Arena (Plates on Table) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
            {/* Visual Plate Tower */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3">
                TUMPUKAN PIRING (STACK TOP TO BOTTOM)
              </span>

              <div className="w-64 min-h-[220px] bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col-reverse items-center justify-start gap-2">
                {stack.length === 0 ? (
                  <div className="text-slate-500 text-xs italic my-auto text-center">
                    Tidak ada piring di atas meja.<br />Tekan tombol "PUSH" untuk menumpuk.
                  </div>
                ) : (
                  stack.map((item, idx) => {
                    const isTop = idx === stack.length - 1;
                    const colorClass = PLATE_COLORS[idx % PLATE_COLORS.length];

                    return (
                      <div
                        key={idx}
                        className={`w-full py-2.5 px-4 rounded-xl border-2 text-center font-bold text-xs shadow-md transition-all ${colorClass} ${
                          isTop ? 'ring-4 ring-white/30 scale-105 animate-pulse text-white' : 'text-white/90'
                        }`}
                      >
                        {item} {isTop && '← (TOP)'}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Table Surface */}
              <div className="w-72 h-3 bg-amber-800 rounded-full mt-2 shadow-inner" />
              <span className="text-[10px] text-slate-500 mt-1 font-mono">Permukaan Meja Bersih</span>
            </div>

            {/* Explanation & Logs */}
            <div className="w-full md:w-1/2 space-y-4">
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-xs text-indigo-300 font-mono">
                &gt; {stackLog}
              </div>

              <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white text-sm">Contoh Penggunaan Stack di Komputer:</h4>
                <p>• <strong>Undo (Ctrl+Z):</strong> Menarik aksi terakhir yang baru saja kamu ketik.</p>
                <p>• <strong>Browser Back:</strong> Menutup halaman terakhir yang baru kamu buka.</p>
                <p>• <strong>Call Stack Fungsi:</strong> Pemanggilan subprogram dalam memori CPU.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Challenge Box */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-4">
        <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          Tantangan Soal: “Jika A, B, C dimasukkan ke Stack, siapa yang keluar pertama saat POP?”
        </h3>
        <p className="text-xs text-amber-800">
          Urutan Push: Piring A ditaruh pertama, Piring B kedua, dan Piring C ditaruh terakhir di paling atas.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {['A', 'B', 'C'].map((opt) => (
            <button
              key={opt}
              onClick={() => handleQuiz(opt)}
              className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                quizAnswer === opt
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-900'
              }`}
            >
              Piring {opt}
            </button>
          ))}
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
          Status: <strong className="text-slate-900">Queue (FIFO) &amp; Stack (LIFO) Selesai Dipelajari</strong>
        </div>

        <button
          onClick={onNextStage}
          className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>MASUK KE TAHAP 7 (TANTANGAN AKHIR)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
