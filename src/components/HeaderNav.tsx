import React from 'react';
import { StageId, StudentProfile } from '../types';
import { STAGES_LIST } from '../data/curriculumData';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  GraduationCap, 
  ChevronRight, 
  FileText, 
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderNavProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  student: StudentProfile;
  score: number;
  streak: number;
  completedStages: number[];
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStage,
  onSelectStage,
  student,
  score,
  streak,
  completedStages,
}) => {
  const isNumericStage = typeof currentStage === 'number';
  const stageNumber = isNumericStage ? (currentStage as number) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectStage(1)}
              className="flex items-center gap-2 text-left group"
              title="Kembali ke Modul Awal"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Informatika SMA</span>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Algoritma &amp; Struktur Data</h1>
              </div>
            </button>

            {/* Stage indicator pill */}
            <div className="hidden md:flex items-center text-xs text-slate-600 border-l border-slate-200 pl-3 ml-1">
              {isNumericStage ? (
                <span className="font-medium text-slate-800">
                  Tahap <span className="font-bold text-indigo-700">{stageNumber}</span> dari 7
                </span>
              ) : currentStage === 'tasks' ? (
                <span className="font-medium text-amber-700">Tugas Praktik Siswa</span>
              ) : currentStage === 'reflection' ? (
                <span className="font-medium text-purple-700">Refleksi Belajar</span>
              ) : (
                <span className="font-medium text-emerald-700">Rapor &amp; Hasil Akhir</span>
              )}
            </div>
          </div>

          {/* Center Stage Quick Switcher (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            {STAGES_LIST.map((st) => {
              const isActive = currentStage === st.id;
              const isCompleted = completedStages.includes(st.id);
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectStage(st.id as StageId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : isCompleted
                      ? 'text-emerald-700 hover:text-emerald-900 hover:bg-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`${st.title}: ${st.subtitle}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {st.id}
                  </span>
                  <span className="hidden xl:inline">{st.title.replace('Game ', '')}</span>
                </button>
              );
            })}
            
            <div className="w-[1px] h-4 bg-slate-300 mx-1" />

            <button
              onClick={() => onSelectStage('tasks')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentStage === 'tasks'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tugas</span>
            </button>

            <button
              onClick={() => onSelectStage('summary')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentStage === 'summary'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rapor</span>
            </button>
          </nav>

          {/* Right Metrics: Student Name, Streak, Score */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div 
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                streak > 1 
                  ? 'bg-amber-50 border-amber-300 text-amber-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title={`Streak Jawaban Benar Berturut-turut: ${streak}`}
            >
              <Flame className={`w-4 h-4 ${streak > 1 ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
              <span className="tabular-nums">{streak}</span>
            </div>

            {/* Score */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-extrabold text-indigo-900"
              title="Total Skor Pembelajaran Kamu"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="tabular-nums text-sm">{score}</span>
              <span className="text-[10px] text-indigo-600 uppercase font-medium">Poin</span>
            </div>

            {/* Student profile info */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {student.name.charAt(0) || 'S'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 truncate max-w-[110px] leading-tight">
                  {student.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  Kelas {student.classLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{
              width: `${
                isNumericStage
                  ? Math.min(100, Math.round(((stageNumber || 1) / 7) * 80 + (completedStages.length > 0 ? 10 : 0)))
                  : currentStage === 'tasks'
                  ? 88
                  : currentStage === 'reflection'
                  ? 94
                  : 100
              }%`,
            }}
          />
        </div>
      </div>
    </header>
  );
};
