import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { STAGES_LIST } from '../data/curriculumData';
import { 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Code2, 
  Layers, 
  BrainCircuit, 
  CheckCircle2, 
  Flame, 
  Compass, 
  Award
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface WelcomeScreenProps {
  onStart: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [classLevel, setClassLevel] = useState<'X' | 'XII'>(initialProfile?.classLevel || 'X');
  const [schoolName, setSchoolName] = useState(initialProfile?.schoolName || 'SMA Negeri Indonesia');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Silakan masukkan nama lengkap atau panggilanmu terlebih dahulu.');
      soundFX.playError();
      return;
    }
    soundFX.playSuccess();
    onStart({
      name: name.trim(),
      classLevel,
      schoolName: schoolName.trim() || 'SMA',
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50">
      <div className="max-w-4xl mx-auto w-full">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 text-white p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 backdrop-blur text-xs font-semibold tracking-wide text-indigo-100 mb-4 border border-white/20">
                <Code2 className="w-3.5 h-3.5 text-amber-300" />
                MATA PELAJARAN INFORMATIKA SMA
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance">
                ALGORITMA &amp; STRUKTUR DATA
              </h1>

              <p className="text-base sm:text-lg text-indigo-100 max-w-2xl font-medium leading-relaxed">
                “Belajar dengan mencoba, bukan hanya menghafal!”
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-indigo-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 7 Simulasi Interaktif
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Visualisasi Kode Nyata
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Tugas Praktik &amp; Rapor Nilai
                </span>
              </div>
            </div>
          </div>

          {/* Form & Overview Section */}
          <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Registration Form */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Biodata Siswa
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Masukkan namamu untuk personalisasi sertifikat rapor dan skor belajar.
                  </p>
                </div>

                <form onSubmit={handleStart} className="space-y-4">
                  <div>
                    <label htmlFor="student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nama Lengkap Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Contoh: Raden Bagus / Siti Nurhaliza"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium text-sm placeholder:text-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
                      autoFocus
                    />
                    {errorMsg && (
                      <p className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1">
                        {errorMsg}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Tingkat Kelas
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setClassLevel('X')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            classLevel === 'X'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Kelas X
                        </button>
                        <button
                          type="button"
                          onClick={() => setClassLevel('XII')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            classLevel === 'XII'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Kelas XII
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="school-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Asal Sekolah
                      </label>
                      <input
                        id="school-name"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="SMA Negeri..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium text-slate-900 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all cursor-pointer group"
                    >
                      <span>MULAI BELAJAR</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>Kurikulum Merdeka &amp; K13</span>
                <span>Berbasis Aktivitas &amp; Interaktif</span>
              </div>
            </div>

            {/* Right: Stage Preview Grid */}
            <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Alur Pembelajaran
                </span>
                <span className="text-[11px] font-semibold text-indigo-700">
                  7 Tahap Petualangan
                </span>
              </div>

              <div className="space-y-2">
                {STAGES_LIST.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                        {stage.id}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {stage.title}
                        </h3>
                        <p className="text-[11px] text-slate-600">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {stage.category}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Selesaikan setiap tahap dengan benar untuk mengumpulkan poin, mempertahankan <strong>streak</strong>, dan meraih predikat <strong className="text-amber-800">MASTER ALGORITMA</strong>!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
