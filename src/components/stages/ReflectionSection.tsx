import React, { useState, useEffect } from 'react';
import { ReflectionAnswers, StudentProfile } from '../../types';
import { 
  Sparkles, 
  HelpCircle, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  MessageSquareQuote
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface ReflectionProps {
  student: StudentProfile;
  onGoToSummary: () => void;
  onSaveReflection?: (reflection: ReflectionAnswers) => void;
}

const STORAGE_KEY = 'informatika_sma_bab2_reflection';

export const ReflectionSection: React.FC<ReflectionProps> = ({
  student,
  onGoToSummary,
  onSaveReflection,
}) => {
  const [reflection, setReflection] = useState<ReflectionAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      mostUnderstood: 'Struktur Queue (FIFO) dan Stack (LIFO) karena visualisasi antrean kasir dan tumpukan piring sangat dekat dengan keseharian.',
      mostConfusing: 'Binary Search dan Nested Loop saat melacak perputaran indeks baris dan kolom secara manual.',
      favoriteGame: 'Game Simulasi Robot Berjalan dan Visualisasi Perbandingan Kartu Bubble Sort yang sangat interaktif.',
      futureApplication: 'Saya ingin menggunakan algoritma Binary Search dan Sorting untuk membuat aplikasi katalog perpustakaan sekolah yang cepat dan rapi.',
    };
  });

  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reflection));
      if (onSaveReflection) onSaveReflection(reflection);
    } catch {
      // safe fallback
    }
  }, [reflection, onSaveReflection]);

  const handleChange = (field: keyof ReflectionAnswers, val: string) => {
    setReflection((prev) => ({ ...prev, [field]: val }));
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 1500);
  };

  const handleFinish = () => {
    soundFX.playSuccess();
    triggerConfetti();
    onGoToSummary();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Evaluasi Diri &amp; Metakognisi
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Refleksi Pembelajaran Bermakna
            </span>
          </div>
          {savedNote && (
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
              Tersimpan otomatis
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Refleksi Pembelajaran Siswa
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Belajar informatika bukan hanya menghafal istilah teknis, melainkan mengenali bagaimana caramu berpikir logis dan menyelesaikan masalah. Luangkan waktu untuk menjawab 4 pertanyaan refleksi di bawah ini.
        </p>
      </div>

      {/* 4 Reflection Questions as required in prompt */}
      <div className="space-y-5">
        {/* Q1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Apa konsep yang paling kamu pahami dari Bab 2 ini?
            </h3>
          </div>
          <textarea
            rows={3}
            value={reflection.mostUnderstood}
            onChange={(e) => handleChange('mostUnderstood', e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            placeholder="Tuliskan pemahamanmu di sini..."
          />
        </div>

        {/* Q2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Apa konsep yang masih membingungkan atau memerlukan latihan tambahan?
            </h3>
          </div>
          <textarea
            rows={3}
            value={reflection.mostConfusing}
            onChange={(e) => handleChange('mostConfusing', e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            placeholder="Tuliskan bagian mana yang perlu diperdalam..."
          />
        </div>

        {/* Q3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Bagian simulasi/permainan mana yang paling membantu kamu belajar?
            </h3>
          </div>
          <textarea
            rows={3}
            value={reflection.favoriteGame}
            onChange={(e) => handleChange('favoriteGame', e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            placeholder="Contoh: Game Robot, Sorting kartu, atau Queue Kasir..."
          />
        </div>

        {/* Q4 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Jika diberi masalah nyata di sekolah atau kehidupan, algoritma apa yang akan kamu gunakan?
            </h3>
          </div>
          <textarea
            rows={3}
            value={reflection.futureApplication}
            onChange={(e) => handleChange('futureApplication', e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            placeholder="Jelaskan algoritma dan alasan pemilihannya..."
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          Refleksi diri membantumu menyempurnakan pemahaman materi.
        </span>

        <button
          onClick={handleFinish}
          className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-200 transition-all animate-pulse"
        >
          <span>LIHAT KARTU HASIL AKHIR (RAPOR)</span>
          <Award className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
