import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  Flame,
  RotateCcw,
  UtensilsCrossed,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage1Props {
  onComplete: (scoreEarned: number) => void;
  onNextStage: () => void;
}

interface StepItem {
  id: string;
  text: string;
  order: number; // Correct logical order (1-indexed)
  detail: string;
}

const INITIAL_STEPS: StepItem[] = [
  {
    id: 'step-boil',
    text: 'Didihkan air di dalam panci (sekitar 400 ml) hingga bergolak',
    order: 1,
    detail: 'Air harus mencapai titik didih 100°C agar mi bisa mengembang sempurna.',
  },
  {
    id: 'step-insert-noodle',
    text: 'Masukkan mi instan ke dalam air yang sudah mendidih',
    order: 2,
    detail: 'Mi dimasukkan setelah air panas bergolak, bukan saat air masih dingin.',
  },
  {
    id: 'step-cook',
    text: 'Tunggu dan rebus mi hingga matang selama kurang lebih 3 menit',
    order: 3,
    detail: 'Proses pematangan membutuhkan waktu terukur dan terhingga (finiteness).',
  },
  {
    id: 'step-prep-seasoning',
    text: 'Siapkan bumbu, minyak, dan kecap di atas piring/mangkuk saji',
    order: 4,
    detail: 'Bumbu disiapkan terpisah agar rasa rempah tidak hilang menguap di panci.',
  },
  {
    id: 'step-mix',
    text: 'Tiriskan mi, lalu tuang ke piring dan aduk rata bersama bumbu',
    order: 5,
    detail: 'Hasil akhir (output): Mi instan hangat yang lezat dan siap dinikmati!',
  },
];

export const Stage1Algorithm: React.FC<Stage1Props> = ({ onComplete, onNextStage }) => {
  // Shuffled steps for the student to order
  const [steps, setSteps] = useState<StepItem[]>(() => {
    return [
      INITIAL_STEPS[1], // Masukkan mi (order 2)
      INITIAL_STEPS[0], // Didihkan air (order 1)
      INITIAL_STEPS[4], // Aduk bumbu (order 5)
      INITIAL_STEPS[2], // Tunggu matang (order 3)
      INITIAL_STEPS[3], // Siapkan bumbu (order 4)
    ];
  });

  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'wrong';
    message: string;
    details?: string;
  }>({
    status: 'idle',
    message: '',
  });

  const [attempts, setAttempts] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Move step up
  const moveUp = (index: number) => {
    if (index === 0) return;
    soundFX.playStep();
    const newSteps = [...steps];
    const temp = newSteps[index - 1];
    newSteps[index - 1] = newSteps[index];
    newSteps[index] = temp;
    setSteps(newSteps);
    setFeedback({ status: 'idle', message: '' });
  };

  // Move step down
  const moveDown = (index: number) => {
    if (index === steps.length - 1) return;
    soundFX.playStep();
    const newSteps = [...steps];
    const temp = newSteps[index + 1];
    newSteps[index + 1] = newSteps[index];
    newSteps[index] = temp;
    setSteps(newSteps);
    setFeedback({ status: 'idle', message: '' });
  };

  // Check the sequence
  const handleCheckOrder = () => {
    setAttempts((prev) => prev + 1);
    
    // Check if step orders match exactly 1, 2, 3, 4, 5
    // Note: step 3 and 4 can be somewhat parallel, but boiling MUST be first, noodle second, cooking before mixing.
    const isWaterFirst = steps[0].id === 'step-boil';
    const isNoodleAfterWater = steps.findIndex(s => s.id === 'step-boil') < steps.findIndex(s => s.id === 'step-insert-noodle');
    const isCookAfterNoodle = steps.findIndex(s => s.id === 'step-insert-noodle') < steps.findIndex(s => s.id === 'step-cook');
    const isMixLast = steps[steps.length - 1].id === 'step-mix';

    const isCompletelyCorrect = steps.every((s, idx) => s.order === idx + 1);

    if (isCompletelyCorrect) {
      soundFX.playSuccess();
      triggerConfetti();
      setFeedback({
        status: 'correct',
        message: 'Luar Biasa! Urutan Algoritmamu 100% Tepat dan Logis!',
        details: 'Kamu telah membuktikan bahwa algoritma harus terstruktur secara runtut. Setiap langkah bergantung pada selesainya langkah sebelumnya (prekondisi). Air mendidih → mi dimasukkan → dimasak 3 menit → bumbu disiapkan → diaduk rata.',
      });
      if (!hasCompleted) {
        const score = Math.max(10, 20 - (attempts * 3));
        setHasCompleted(true);
        onComplete(score);
      }
    } else {
      soundFX.playError();
      let errorExplanation = '';
      if (!isWaterFirst) {
        errorExplanation = 'Kesalahan Logika: Air harus dididihkan terlebih dahulu! Jika mi dimasukkan ke panci kosong atau air dingin, mi tidak akan matang dengan benar.';
      } else if (!isNoodleAfterWater) {
        errorExplanation = 'Kesalahan Urutan: Kamu mencoba memasukkan mi sebelum mendidihkan air.';
      } else if (!isCookAfterNoodle) {
        errorExplanation = 'Kesalahan Urutan: Proses memasak 3 menit harus dilakukan setelah mi dimasukkan ke air mendidih.';
      } else if (!isMixLast) {
        errorExplanation = 'Kesalahan Urutan: Menuangkan dan mengaduk bumbu adalah tahap terakhir setelah mi ditiriskan.';
      } else {
        errorExplanation = 'Urutan bumbu atau proses memasak masih sedikit tertukar. Coba perhatikan urutan nomor 3 dan 4.';
      }

      setFeedback({
        status: 'wrong',
        message: 'Urutan Belum Tepat! Mari Perbaiki Logikanya.',
        details: errorExplanation,
      });
    }
  };

  const handleReset = () => {
    soundFX.playStep();
    setSteps([
      INITIAL_STEPS[1],
      INITIAL_STEPS[0],
      INITIAL_STEPS[4],
      INITIAL_STEPS[2],
      INITIAL_STEPS[3],
    ]);
    setFeedback({ status: 'idle', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Stage Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 1 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Konsep Dasar Algoritma
            </span>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
            🎯 Target: Urutkan 5 Langkah Logis
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Apa Sebenarnya Algoritma Itu?
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Secara sederhana, <strong className="text-indigo-700">Algoritma</strong> adalah urutan langkah-langkah logis, terstruktur, dan <span className="underline decoration-indigo-300">terbatas (finiteness)</span> yang disusun secara sistematis untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.
        </p>

        {/* 3 Pillars of Algorithm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase">Logis &amp; Terurut</h4>
              <p className="text-xs text-emerald-800 mt-0.5">Tiap langkah masuk akal dan runtut. Langkah B baru bisa terjadi setelah langkah A selesai.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-950 uppercase">Pasti / Tidak Ambigu</h4>
              <p className="text-xs text-blue-800 mt-0.5">Instruksi harus jelas sehingga siapa pun yang mengeksekusi akan menghasilkan output yang sama.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase">Terbatas (Finiteness)</h4>
              <p className="text-xs text-amber-800 mt-0.5">Harus ada titik akhir (berhenti), tidak boleh berjalan selamanya tanpa akhir.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Game */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Tantangan Nyata: “Membuat Mi Instan yang Sempurna”
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan tombol panah ⬆️ dan ⬇️ untuk menyusun kartu langkah-langkah di bawah ini ke urutan yang paling logis.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Acak Kembali Kartu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Acak Ulang</span>
          </button>
        </div>

        {/* Step Cards List */}
        <div className="space-y-3">
          {steps.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={item.id}
                className="group p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-4">
                  {/* Step Position Indicator */}
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.text}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* Reorder Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={isFirst}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isFirst
                        ? 'opacity-30 cursor-not-allowed bg-slate-200 text-slate-400'
                        : 'bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-300 shadow-xs cursor-pointer active:scale-95'
                    }`}
                    title="Pindahkan ke atas"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={isLast}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isLast
                        ? 'opacity-30 cursor-not-allowed bg-slate-200 text-slate-400'
                        : 'bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-300 shadow-xs cursor-pointer active:scale-95'
                    }`}
                    title="Pindahkan ke bawah"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Section */}
        {feedback.status !== 'idle' && (
          <div
            className={`mt-6 p-5 rounded-2xl border transition-all ${
              feedback.status === 'correct'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {feedback.status === 'correct' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold">{feedback.message}</h4>
                {feedback.details && (
                  <p className="text-xs leading-relaxed opacity-90">
                    {feedback.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Percobaan ke: <strong className="text-slate-800">{attempts}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckOrder}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>PERIKSA URUTAN</span>
            </button>

            {hasCompleted && (
              <button
                onClick={onNextStage}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer flex items-center gap-2 animate-pulse"
              >
                <span>LANJUT KE TAHAP 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
