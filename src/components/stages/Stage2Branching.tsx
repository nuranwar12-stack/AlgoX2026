import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Play, 
  RotateCcw,
  Sliders,
  Utensils,
  Award
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage2Props {
  onComplete: (scoreEarned: number) => void;
  onNextStage: () => void;
}

export const Stage2Branching: React.FC<Stage2Props> = ({ onComplete, onNextStage }) => {
  // Tabs: 'if-else' | 'switch-case' | 'nested-if'
  const [activeTab, setActiveTab] = useState<'if-else' | 'switch-case' | 'nested-if'>('if-else');

  // If-Else Interactive State
  const [testScore, setTestScore] = useState<number>(82);
  const [ifElseQuizAnswer, setIfElseQuizAnswer] = useState<string | null>(null);
  const [ifElseFeedback, setIfElseFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Switch-Case State
  const [selectedMenu, setSelectedMenu] = useState<number>(2);

  // Nested-If State
  const [attendance, setAttendance] = useState<number>(85); // 0-100%
  const [examGrade, setExamGrade] = useState<number>(88); // 0-100

  // Tracking completion
  const [completedSubtasks, setCompletedSubtasks] = useState<{
    ifElse: boolean;
    switchCase: boolean;
    nestedIf: boolean;
  }>({
    ifElse: false,
    switchCase: false,
    nestedIf: false,
  });

  const checkIfElseQuiz = (choice: 'lulus' | 'belum_lulus') => {
    soundFX.playStep();
    setIfElseQuizAnswer(choice);
    // Skenario: Nilai = 82. Syarat Lulus >= 75.
    if (choice === 'lulus') {
      soundFX.playSuccess();
      setIfElseFeedback({
        isCorrect: true,
        text: 'Tepat Sekali! Karena 82 >= 75 bernilai BENAR (TRUE), alur program langsung masuk ke blok Aksi A: "LULUS". Jalur "BELUM LULUS" diabaikan sepenuhnya.',
      });
      if (!completedSubtasks.ifElse) {
        setCompletedSubtasks((prev) => ({ ...prev, ifElse: true }));
        onComplete(10);
      }
    } else {
      soundFX.playError();
      setIfElseFeedback({
        isCorrect: false,
        text: 'Kurang Tepat. Nilai 82 lebih besar atau sama dengan 75. Kondisi bernilai TRUE, sehingga tidak masuk ke blok ELSE.',
      });
    }
  };

  const handleSwitchSelect = (menuNum: number) => {
    soundFX.playStep();
    setSelectedMenu(menuNum);
    if (!completedSubtasks.switchCase) {
      soundFX.playSuccess();
      setCompletedSubtasks((prev) => ({ ...prev, switchCase: true }));
      onComplete(10);
    }
  };

  const isAllComplete = completedSubtasks.ifElse && completedSubtasks.switchCase && completedSubtasks.nestedIf;

  // Nested IF calculation
  const getNestedResult = () => {
    if (attendance < 75) {
      return {
        status: 'TIDAK BERHAK LULUS',
        predikat: 'Kehadiran Kurang dari 75% (Wajib Ujian Ulang / SP)',
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        stage1: 'TIDAK MEMENUHI SYARAT KEHADIRAN',
        stage2: 'Nilai Ujian Tidak Diproses',
      };
    } else {
      if (examGrade >= 85) {
        return {
          status: 'LULUS DENGAN PREDIKAT A',
          predikat: 'Sangat Memuaskan (Cumlaude)',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          stage1: 'Kehadiran Memenuhi Syarat (>= 75%)',
          stage2: 'Nilai Ujian >= 85 (Grade A)',
        };
      } else if (examGrade >= 75) {
        return {
          status: 'LULUS DENGAN PREDIKAT B',
          predikat: 'Baik / Kompeten',
          color: 'text-blue-700 bg-blue-50 border-blue-200',
          stage1: 'Kehadiran Memenuhi Syarat (>= 75%)',
          stage2: 'Nilai Ujian 75 - 84 (Grade B)',
        };
      } else {
        return {
          status: 'BELUM LULUS (REMEDIAL)',
          predikat: 'Perlu Pengayaan Materi Ujian',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          stage1: 'Kehadiran Memenuhi Syarat (>= 75%)',
          stage2: 'Nilai Ujian < 75 (Perlu Remedial)',
        };
      }
    }
  };

  const nestedResult = getNestedResult();

  const handleExploreNested = () => {
    if (!completedSubtasks.nestedIf) {
      soundFX.playSuccess();
      triggerConfetti();
      setCompletedSubtasks((prev) => ({ ...prev, nestedIf: true }));
      onComplete(10);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 2 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Struktur Kontrol Percabangan
            </span>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
            🎯 Pelajari 3 Jenis Pengambilan Keputusan
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Game Mengambil Keputusan (Percabangan)
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Dalam pemrograman, komputer tidak selalu berjalan lurus. Komputer harus mampu <strong>memilih jalur aksi yang tepat</strong> berdasarkan kondisi benar (true) atau salah (false).
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('if-else');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'if-else'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. If - Else</span>
            {completedSubtasks.ifElse && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('switch-case');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'switch-case'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. Switch - Case</span>
            {completedSubtasks.switchCase && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              soundFX.playStep();
              setActiveTab('nested-if');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'nested-if'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>3. Nested If (Bertingkat)</span>
            {completedSubtasks.nestedIf && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Tab 1: If-Else */}
      {activeTab === 'if-else' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Simulasi 1: Percabangan Dua Arah (If - Else)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aturan Logika: “Jika nilai siswa &gt;= 75, maka <strong>LULUS</strong>. Jika kurang dari 75, maka <strong>BELUM LULUS</strong>.”
            </p>
          </div>

          {/* Interactive Flowchart Diagram */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              Visualisasi Diagram Alir (Flowchart)
            </span>

            {/* Condition Diamond */}
            <div className="p-4 rounded-2xl bg-indigo-700/80 border-2 border-indigo-400 text-center font-bold text-sm shadow-lg max-w-xs">
              <span className="text-xs text-indigo-200 block mb-0.5">KONDISI PERIKSA:</span>
              Nilai Siswa ({testScore}) &gt;= 75 ?
            </div>

            {/* Branch Lines */}
            <div className="w-full max-w-md grid grid-cols-2 gap-8 my-4 text-center">
              {/* True Branch */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  BENAR (TRUE) ↓
                </span>
                <div
                  className={`mt-2 p-3 w-full rounded-xl border-2 transition-all ${
                    testScore >= 75
                      ? 'bg-emerald-600/90 border-emerald-300 text-white shadow-lg ring-4 ring-emerald-500/30 scale-105'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 opacity-40'
                  }`}
                >
                  <p className="text-xs uppercase font-extrabold">Aksi A</p>
                  <p className="text-sm font-bold">LULUS 🎉</p>
                </div>
              </div>

              {/* False Branch */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-rose-400 uppercase">
                  SALAH (FALSE) ↓
                </span>
                <div
                  className={`mt-2 p-3 w-full rounded-xl border-2 transition-all ${
                    testScore < 75
                      ? 'bg-rose-600/90 border-rose-300 text-white shadow-lg ring-4 ring-rose-500/30 scale-105'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 opacity-40'
                  }`}
                >
                  <p className="text-xs uppercase font-extrabold">Aksi B</p>
                  <p className="text-sm font-bold">BELUM LULUS ⚠️</p>
                </div>
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="w-full max-w-sm mt-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-300 font-bold mb-2">
                <span>Uji Nilai:</span>
                <span className="text-indigo-400 font-mono text-sm">{testScore}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={testScore}
                onChange={(e) => setTestScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0</span>
                <span>KKM (75)</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Prompt Challenge Box */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Tantangan: “Nilai Ujian = 82. Jalur mana yang dipilih komputer?”
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Pilih salah satu tombol di bawah untuk membuktikan pemahamanmu:
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => checkIfElseQuiz('lulus')}
                className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  ifElseQuizAnswer === 'lulus'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Jalur 1: LULUS</span>
              </button>

              <button
                onClick={() => checkIfElseQuiz('belum_lulus')}
                className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  ifElseQuizAnswer === 'belum_lulus'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white hover:bg-rose-50 text-slate-800 border-slate-300'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Jalur 2: BELUM LULUS</span>
              </button>
            </div>

            {ifElseFeedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ${
                  ifElseFeedback.isCorrect
                    ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                    : 'bg-rose-100/70 border-rose-300 text-rose-950'
                }`}
              >
                <strong>{ifElseFeedback.isCorrect ? '✅ Jawaban Benar! ' : '❌ Belum Benar! '}</strong>
                {ifElseFeedback.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Switch-Case */}
      {activeTab === 'switch-case' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Simulasi 2: Pemilihan Banyak Jalur (Switch - Case)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Switch-case memeriksa kecocokan sebuah nilai konstan secara langsung tanpa mengecek kondisi berkali-kali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Menu Selection */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Pilih Nomor Menu Kantin:
              </span>

              {[
                { id: 1, name: 'Nasi Goreng Spesial', price: 'Rp 12.000', icon: '🍳' },
                { id: 2, name: 'Mie Ayam Pangsit', price: 'Rp 10.000', icon: '🍜' },
                { id: 3, name: 'Bakso Sapi Urat', price: 'Rp 13.000', icon: '🥣' },
                { id: 4, name: 'Menu Rahasia (Di luar daftar)', price: 'Rp 0', icon: '❓' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSwitchSelect(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedMenu === item.id
                      ? 'bg-indigo-50 border-indigo-500 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">
                        Case {item.id}:
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                    {item.price}
                  </span>
                </button>
              ))}
            </div>

            {/* Switch Case Code Visualizer */}
            <div className="md:col-span-7 bg-slate-900 rounded-2xl p-5 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
                  <span>EKSEKUSI SWITCH-CASE</span>
                  <span className="text-amber-400">pilihan = {selectedMenu}</span>
                </div>

                <div className="space-y-1.5 leading-relaxed">
                  <p className="text-indigo-400 font-bold">switch (pilihan) {'{'}</p>
                  
                  <div className={`p-2 rounded-lg transition-colors ${selectedMenu === 1 ? 'bg-indigo-600/40 text-emerald-300 border border-emerald-500/40 font-bold' : 'opacity-40 text-slate-400'}`}>
                    <p>  case 1:</p>
                    <p>    pesan = "Nasi Goreng Spesial disiapkan!";</p>
                    <p>    break;</p>
                  </div>

                  <div className={`p-2 rounded-lg transition-colors ${selectedMenu === 2 ? 'bg-indigo-600/40 text-emerald-300 border border-emerald-500/40 font-bold' : 'opacity-40 text-slate-400'}`}>
                    <p>  case 2:</p>
                    <p>    pesan = "Mie Ayam Pangsit disiapkan!";</p>
                    <p>    break;</p>
                  </div>

                  <div className={`p-2 rounded-lg transition-colors ${selectedMenu === 3 ? 'bg-indigo-600/40 text-emerald-300 border border-emerald-500/40 font-bold' : 'opacity-40 text-slate-400'}`}>
                    <p>  case 3:</p>
                    <p>    pesan = "Bakso Sapi Urat disiapkan!";</p>
                    <p>    break;</p>
                  </div>

                  <div className={`p-2 rounded-lg transition-colors ${selectedMenu === 4 ? 'bg-indigo-600/40 text-amber-300 border border-amber-500/40 font-bold' : 'opacity-40 text-slate-400'}`}>
                    <p>  default:</p>
                    <p>    pesan = "Menu nomor tersebut tidak tersedia di kantin.";</p>
                  </div>

                  <p className="text-indigo-400 font-bold">{'}'}</p>
                </div>
              </div>

              {/* Output Result */}
              <div className="mt-4 p-3 bg-slate-800 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Keluaran Layar (Terminal Output):
                </span>
                <p className="text-emerald-400 font-bold text-sm">
                  &gt; {selectedMenu === 1 && 'Memproses: Nasi Goreng Spesial disiapkan! (Rp 12.000)'}
                  {selectedMenu === 2 && 'Memproses: Mie Ayam Pangsit disiapkan! (Rp 10.000)'}
                  {selectedMenu === 3 && 'Memproses: Bakso Sapi Urat disiapkan! (Rp 13.000)'}
                  {selectedMenu === 4 && 'Peringatan: Menu nomor tersebut tidak tersedia di kantin.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nested If */}
      {activeTab === 'nested-if' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Simulasi 3: Keputusan Bertingkat (Nested If)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Percabangan bersarang adalah struktur <code>if</code> di dalam <code>if</code> lain. Tingkat kedua baru dievaluasi jika tingkat pertama terpenuhi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sliders Input */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>1. Tingkat Kehadiran Siswa (%):</span>
                  <span className="text-indigo-700 font-mono text-sm">{attendance}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={attendance}
                  onChange={(e) => {
                    setAttendance(Number(e.target.value));
                    handleExploreNested();
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
                <span className="text-[10px] text-slate-500">Syarat minimal hadir: 75%</span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>2. Nilai Ujian Akhir (0-100):</span>
                  <span className="text-indigo-700 font-mono text-sm">{examGrade}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={examGrade}
                  onChange={(e) => {
                    setExamGrade(Number(e.target.value));
                    handleExploreNested();
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
                <span className="text-[10px] text-slate-500">≥85 Predikat A, ≥75 Predikat B, &lt;75 Remedial</span>
              </div>
            </div>

            {/* Decision Hierarchy Result */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${nestedResult.color}`}>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold block mb-2 opacity-80">
                  Hasil Evaluasi Bertingkat:
                </span>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {nestedResult.status}
                </h3>
                <p className="text-xs mt-1 font-semibold opacity-90">
                  {nestedResult.predikat}
                </p>

                <div className="mt-4 space-y-2 text-xs border-t border-current/20 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Tahap 1 (Kehadiran):</span>
                    <span>{nestedResult.stage1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Tahap 2 (Nilai):</span>
                    <span>{nestedResult.stage2}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-current/15 text-[11px] font-medium opacity-75">
                💡 Coba geser kehadiran di bawah 75%, maka komputer tidak akan memproses nilai ujian!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage Bottom Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-bold text-slate-800">Capaian Tahap 2:</span>
          <span className={completedSubtasks.ifElse ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>If-Else</span>
          <span>·</span>
          <span className={completedSubtasks.switchCase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>Switch-Case</span>
          <span>·</span>
          <span className={completedSubtasks.nestedIf ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>Nested If</span>
        </div>

        <button
          onClick={onNextStage}
          className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>LANJUT KE TAHAP 3 (LOOPING)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
