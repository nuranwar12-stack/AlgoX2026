import React, { useState, useEffect } from 'react';
import { PracticalTaskAnswers, StudentProfile } from '../../types';
import { 
  FileText, 
  Save, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Award
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface PracticalTasksProps {
  student: StudentProfile;
  onGoToReflection: () => void;
  onSaveAnswers?: (answers: PracticalTaskAnswers) => void;
}

const STORAGE_KEY = 'informatika_sma_bab2_tasks';

export const PracticalTasks: React.FC<PracticalTasksProps> = ({
  student,
  onGoToReflection,
  onSaveAnswers,
}) => {
  const [answers, setAnswers] = useState<PracticalTaskAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      task1: '1. Ambil botol air minum dari tas\n2. Buka tutup botol dengan memutar ke arah kiri\n3. Periksa ketersediaan air di dalam botol\n4. Dekatkan bibir botol ke mulut\n5. Miringkan botol perlahan dan teguk air sebanyak yang dibutuhkan\n6. Kembalikan posisi botol tegak lurus dan lap sisa tetesan air\n7. Tutup rapat kembali botol dengan memutar ke arah kanan',
      task2: 'Jika cuaca pagi hari hujan lebat, maka pergi ke sekolah diantar naik mobil atau memakai jas hujan. Jika tidak hujan, maka berangkat naik sepeda motor atau jalan kaki.',
      task3: 'Mengelilingi lapangan upacara bendera saat jam pelajaran olahraga sebanyak tepat 3 putaran (for putaran = 1 sampai 3).',
      task4: 'Queue (FIFO): Antrean siswa mengambil makanan saat makan siang di kantin sekolah.\nStack (LIFO): Tumpukan nampan makanan di kantin atau tumpukan buku catatan tugas di meja guru piket.',
      task5Problem: 'Sistem Peminjaman Buku di Perpustakaan Sekolah',
      task5Algorithm: '1. Siswa datang mencari buku di rak\n2. Siswa menyerahkan buku dan Kartu Pelajar ke meja pustakawan\n3. Pustakawan scan barcode buku dan barcode kartu siswa\n4. Sistem mencatat tanggal pinjam dan tanggal batas kembali (7 hari)\n5. Siswa menerima buku yang sudah terdaftar',
      task5HasBranching: 'YA. Percabangan if (siswa memiliki denda buku sebelumnya > Rp 0) maka tidak boleh meminjam buku baru sebelum denda dilunasi. Jika denda == 0 maka buku boleh dipinjam.',
      task5HasLooping: 'YA. Perulangan while (masih ada buku yang ingin dipinjam dan jumlah <= 3) untuk scan tiap buku satu per satu.',
      task5NeedsSearchSort: 'YA. Searching dibutuhkan untuk mencari letak buku berdasarkan judul/ISBN. Sorting dibutuhkan untuk menyusun daftar riwayat buku terpopuler berdasarkan jumlah pinjam.',
      task5QueueOrStack: 'QUEUE (Antrean FIFO) sangat cocok digunakan saat jam istirahat ketika banyak siswa mengantre di depan meja pustakawan untuk scan buku.',
    };
  });

  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      if (onSaveAnswers) onSaveAnswers(answers);
    } catch {
      // safe fallback
    }
  }, [answers, onSaveAnswers]);

  const handleChange = (field: keyof PracticalTaskAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setSavedStatus('Menyimpan otomatis...');
    setTimeout(() => setSavedStatus('Tersimpan di perangkat'), 800);
  };

  const handleCopyAll = () => {
    soundFX.playStep();
    const content = `LEMBAR TUGAS PRAKTIK INFORMATIKA SMA
BAB 2: ALGORITMA & STRUKTUR DATA
Nama Siswa : ${student.name}
Kelas      : ${student.classLevel}
Sekolah    : ${student.schoolName}
Tanggal    : ${new Date().toLocaleDateString('id-ID')}
==================================================

TUGAS 1: ALGORITMA KEHIDUPAN SEHARI-HARI (MINIMAL 7 LANGKAH)
${answers.task1}

--------------------------------------------------
TUGAS 2: PERCABANGAN IF-ELSE
${answers.task2}

--------------------------------------------------
TUGAS 3: PERULANGAN (LOOPING)
${answers.task3}

--------------------------------------------------
TUGAS 4: PENGGUNAAN QUEUE & STACK
${answers.task4}

--------------------------------------------------
TUGAS 5 — TANTANGAN PENYELESAIAN MASALAH DI SEKOLAH:
Masalah Terpilih: ${answers.task5Problem}
1. Algoritma:
${answers.task5Algorithm}

2. Apakah Menggunakan Percabangan?
${answers.task5HasBranching}

3. Apakah Menggunakan Perulangan?
${answers.task5HasLooping}

4. Apakah Membutuhkan Searching/Sorting?
${answers.task5NeedsSearchSort}

5. Apakah Cocok Menggunakan Queue atau Stack?
${answers.task5QueueOrStack}

==================================================
Tugas diselesaikan melalui Aplikasi Pembelajaran Interaktif Informatika SMA.`;

    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      soundFX.playSuccess();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadTxt = () => {
    soundFX.playStep();
    const content = `LEMBAR TUGAS PRAKTIK INFORMATIKA SMA\nBAB 2: ALGORITMA & STRUKTUR DATA\nNama: ${student.name}\nKelas: ${student.classLevel}\nSekolah: ${student.schoolName}\n\n` +
      `TUGAS 1:\n${answers.task1}\n\n` +
      `TUGAS 2:\n${answers.task2}\n\n` +
      `TUGAS 3:\n${answers.task3}\n\n` +
      `TUGAS 4:\n${answers.task4}\n\n` +
      `TUGAS 5 (Masalah: ${answers.task5Problem}):\n` +
      `Algoritma: ${answers.task5Algorithm}\n` +
      `Percabangan: ${answers.task5HasBranching}\n` +
      `Perulangan: ${answers.task5HasLooping}\n` +
      `Searching/Sorting: ${answers.task5NeedsSearchSort}\n` +
      `Queue/Stack: ${answers.task5QueueOrStack}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tugas_Informatika_${student.name.replace(/\s+/g, '_')}_Bab2.txt`;
    link.click();
    URL.revokeObjectURL(url);
    soundFX.playSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tugas Mandiri &amp; Portofolio
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Informatika SMA Kelas {student.classLevel}
            </span>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
            {savedStatus || 'Tersimpan di browser'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lembar Tugas Praktik Siswa
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Terapkan konsep algoritma dan struktur data ke dalam kasus nyata kehidupanmu sebagai siswa SMA. Kamu dapat mengetik atau mengedit jawabanmu di bawah ini, lalu menyalin atau mengunduhnya untuk dikumpulkan ke Bapak/Ibu Guru Informatika.
        </p>

        {/* Quick action bar */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleCopyAll}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'BERHASIL DISALIN!' : 'SALIN SEMUA JAWABAN'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>UNDUH FILE .TXT</span>
          </button>
        </div>
      </div>

      {/* Task 1 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-sm">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              TUGAS 1 — Algoritma Kehidupan Sehari-hari (Minimal 7 Langkah)
            </h3>
            <p className="text-xs text-slate-500">
              Tuliskan urutan langkah logis, berurutan, dan terhingga dari aktivitas harianmu.
            </p>
          </div>
        </div>

        <textarea
          rows={5}
          value={answers.task1}
          onChange={(e) => handleChange('task1', e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/50 hover:bg-white transition-colors"
          placeholder="Tulis minimal 7 langkah runtut di sini..."
        />
      </div>

      {/* Task 2 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              TUGAS 2 — Contoh Percabangan If - Else di Kehidupan Siswa
            </h3>
            <p className="text-xs text-slate-500">
              Berikan contoh kondisi yang menentukan pilihan aksi berbeda (Jika kondisi A benar, maka aksi X; jika salah, aksi Y).
            </p>
          </div>
        </div>

        <textarea
          rows={3}
          value={answers.task2}
          onChange={(e) => handleChange('task2', e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/50 hover:bg-white transition-colors"
          placeholder="Contoh: Jika nilai rapor >= 80..."
        />
      </div>

      {/* Task 3 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-sm">
            3
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              TUGAS 3 — Contoh Perulangan (Looping) di Kehidupan Sehari-hari
            </h3>
            <p className="text-xs text-slate-500">
              Tuliskan aktivitas berulang dengan batas berhenti yang jelas (misal: for 5 kali atau while kondisi terpenuhi).
            </p>
          </div>
        </div>

        <textarea
          rows={3}
          value={answers.task3}
          onChange={(e) => handleChange('task3', e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/50 hover:bg-white transition-colors"
          placeholder="Contoh: Menyiram tanaman pot dari pot 1 sampai 10..."
        />
      </div>

      {/* Task 4 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-sm">
            4
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              TUGAS 4 — Contoh Penggunaan Queue (FIFO) &amp; Stack (LIFO)
            </h3>
            <p className="text-xs text-slate-500">
              Sebutkan masing-masing 1 contoh penerapan konkret di sekolah atau lingkungan sekitar.
            </p>
          </div>
        </div>

        <textarea
          rows={3}
          value={answers.task4}
          onChange={(e) => handleChange('task4', e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/50 hover:bg-white transition-colors"
          placeholder="Queue: ... / Stack: ..."
        />
      </div>

      {/* Task 5 — Challenge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
            ★
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              TUGAS 5 — TANTANGAN: Desain Solusi Masalah di Lingkungan Sekolah
            </h3>
            <p className="text-xs text-slate-500">
              Pilih satu masalah sederhana di sekolah (misal: Absensi Siswa, Antrean Kantin, Peminjaman Perpustakaan, atau Pemilihan Ketua OSIS).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nama Masalah di Sekolah:
            </label>
            <input
              type="text"
              value={answers.task5Problem}
              onChange={(e) => handleChange('task5Problem', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs sm:text-sm bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              1. Rancang Algoritmanya:
            </label>
            <textarea
              rows={4}
              value={answers.task5Algorithm}
              onChange={(e) => handleChange('task5Algorithm', e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                2. Apakah Menggunakan Percabangan?
              </label>
              <textarea
                rows={3}
                value={answers.task5HasBranching}
                onChange={(e) => handleChange('task5HasBranching', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Apakah Menggunakan Perulangan?
              </label>
              <textarea
                rows={3}
                value={answers.task5HasLooping}
                onChange={(e) => handleChange('task5HasLooping', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                4. Apakah Membutuhkan Searching / Sorting?
              </label>
              <textarea
                rows={3}
                value={answers.task5NeedsSearchSort}
                onChange={(e) => handleChange('task5NeedsSearchSort', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                5. Apakah Cocok Menggunakan Queue atau Stack?
              </label>
              <textarea
                rows={3}
                value={answers.task5QueueOrStack}
                onChange={(e) => handleChange('task5QueueOrStack', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          Semua tugas otomatis tersimpan di perambanmu.
        </span>

        <button
          onClick={onGoToReflection}
          className="py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-purple-100"
        >
          <span>LANJUT KE REFLEKSI BELAJAR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
