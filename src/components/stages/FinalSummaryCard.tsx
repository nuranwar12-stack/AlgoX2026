import React from 'react';
import { StudentProfile, BadgeInfo, BadgeCategory } from '../../types';
import { BADGE_TIERS } from '../../data/curriculumData';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileText, 
  Printer, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  GraduationCap
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

interface FinalSummaryProps {
  student: StudentProfile;
  totalScore: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  completedStages: number[];
  onRepeatMaterial: () => void;
  onPlayAgain: () => void;
  onGoToTasks: () => void;
}

export const FinalSummaryCard: React.FC<FinalSummaryProps> = ({
  student,
  totalScore,
  correctAnswersCount,
  totalQuestionsCount,
  completedStages,
  onRepeatMaterial,
  onPlayAgain,
  onGoToTasks,
}) => {
  const incorrectCount = Math.max(0, totalQuestionsCount - correctAnswersCount);

  // Determine Badge tier based on score
  const getBadge = (score: number): BadgeInfo => {
    if (score >= 90) return BADGE_TIERS[0];
    if (score >= 75) return BADGE_TIERS[1];
    if (score >= 60) return BADGE_TIERS[2];
    return BADGE_TIERS[3];
  };

  const badge = getBadge(totalScore);

  // Mastered topics vs topics needing review based on score
  const masteredTopics = [
    'Konsep Dasar Algoritma & Urutan Logis Finiteness',
    'Percabangan Keputusan If-Else & Switch-Case',
    'Perulangan For, While, & Do-While (Robot Movement)',
    'Queue Antrean (FIFO) & Stack Tumpukan (LIFO)',
  ];

  const reviewTopics = totalScore < 90 ? [
    'Nested Loop (Analisis perulangan dalam matriks/grid)',
    'Efisiensi Binary Search vs Linear Search pada skala besar',
    'Perbandingan Mekanisme Bubble Sort vs Selection & Insertion Sort',
  ] : [
    'Kompleksitas Waktu Notasi Big-O (Materi Lanjutan Olimpiade Sains Informatika)',
  ];

  const handlePrint = () => {
    soundFX.playStep();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Printable Report Card Certificate */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 relative overflow-hidden text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-xs font-semibold tracking-widest uppercase text-amber-300 mb-3 border border-white/15">
            <GraduationCap className="w-4 h-4" />
            RAPOR HASIL BELAJAR INFORMATIKA SMA
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            KARTU CAPAIAN KOMPETENSI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            BAB 2: ALGORITMA &amp; STRUKTUR DATA — KELAS {student.classLevel}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-2xl backdrop-blur border border-white/20">
            <span className="text-xs text-slate-300">Nama Siswa:</span>
            <span className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
              {student.name || 'Siswa Berprestasi'}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-300">{student.schoolName}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-8 sm:p-10 space-y-8">
          {/* Badge & Big Score Hero */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Badge Display */}
            <div className={`md:col-span-7 p-6 rounded-3xl border flex items-center gap-5 ${badge.bgColor}`}>
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-md shrink-0">
                {badge.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Badge Penghargaan Siswa
                </span>
                <h3 className={`text-xl sm:text-2xl font-black ${badge.color}`}>
                  {badge.category}
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>

            {/* Right: Scores Overview */}
            <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Nilai Akhir</span>
                <span className="text-3xl font-black text-indigo-700">{totalScore}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Skor / 100</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Benar</span>
                <span className="text-3xl font-black text-emerald-800">{correctAnswersCount}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Soal</span>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Salah</span>
                <span className="text-3xl font-black text-rose-800">{incorrectCount}</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">Soal</span>
              </div>
            </div>
          </div>

          {/* Materi yang Dikuasai vs Perlu Dipelajari Lagi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* Dikuasai */}
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4>Materi yang Telah Dikuasai:</h4>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                {masteredTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perlu Dipelajari Lagi */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
                <h4>Materi yang Perlu Diperdalam:</h4>
              </div>
              <ul className="space-y-2 text-xs text-amber-950">
                {reviewTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">→</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation Stamp */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>Status Kelulusan: <strong className="text-emerald-700">KOMPETEN &amp; TUNTAS</strong></span>
            <span>Tanggal Verifikasi: <strong>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong></span>
            <span>7 Tahap Simulasi: <strong>100% Selesai</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons as explicitly requested in prompt:
          “ULANGI MATERI”, “MAIN LAGI”, “KERJAKAN TUGAS” */}
      <div className="no-print bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handlePrint}
          className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>CETAK / SIMPAN PDF RAPOR</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundFX.playStep();
              onRepeatMaterial();
            }}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ULANGI MATERI</span>
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              onPlayAgain();
            }}
            className="py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              onGoToTasks();
            }}
            className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-amber-200"
          >
            <FileText className="w-4 h-4" />
            <span>KERJAKAN TUGAS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
