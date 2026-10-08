import React, { useState } from 'react';
import { QuizQuestion, BadgeInfo } from '../../types';
import { FINAL_QUIZ_QUESTIONS, BADGE_TIERS } from '../../data/curriculumData';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { soundFX, triggerConfetti } from '../../utils/audio';

interface Stage7Props {
  onQuizCompleted: (correctCount: number, totalQuestions: number, points: number) => void;
  onGoToTasks: () => void;
  onGoToSummary: () => void;
}

export const Stage7FinalChallenge: React.FC<Stage7Props> = ({
  onQuizCompleted,
  onGoToTasks,
  onGoToSummary,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [answersState, setAnswersState] = useState<{
    [questionId: number]: {
      selectedId: string;
      isCorrect: boolean;
    };
  }>({});

  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = FINAL_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundFX.playStep();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const chosen = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!chosen?.isCorrect;

    if (isCorrect) {
      soundFX.playSuccess();
      setCurrentStreak((prev) => prev + 1);
    } else {
      soundFX.playError();
      setCurrentStreak(0);
    }

    setAnswersState((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedId: selectedOptionId,
        isCorrect,
      },
    }));
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    soundFX.playStep();
    if (currentIdx < FINAL_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished all 10 questions
      setIsFinished(true);
      soundFX.playFanfare();
      triggerConfetti();

      // Calculate final score
      const answeredKeys = Object.keys(answersState);
      const correctTotal = Object.values(answersState).filter((a) => a.isCorrect).length + (currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0);
      const calculatedPoints = Math.round((correctTotal / FINAL_QUIZ_QUESTIONS.length) * 100);

      onQuizCompleted(correctTotal, FINAL_QUIZ_QUESTIONS.length, calculatedPoints);
    }
  };

  const totalAnswered = Object.keys(answersState).length;
  const correctCount = Object.values(answersState).filter((a) => a.isCorrect).length;
  const currentCalculatedScore = Math.round((correctCount / FINAL_QUIZ_QUESTIONS.length) * 100);

  const getBadgeForScore = (s: number): BadgeInfo => {
    if (s >= 90) return BADGE_TIERS[0];
    if (s >= 75) return BADGE_TIERS[1];
    if (s >= 60) return BADGE_TIERS[2];
    return BADGE_TIERS[3];
  };

  const badge = getBadgeForScore(currentCalculatedScore);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              Tahap 7 / 7
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Uji Kompetensi Mandiri
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Streak: {currentStreak}</span>
            </div>
            <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
              Soal {currentIdx + 1} dari {FINAL_QUIZ_QUESTIONS.length}
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Final Challenge: 10 Soal Logika Campuran
        </h1>

        <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
          Uji pemahamanmu secara menyeluruh tentang algoritma, percabangan, perulangan, pencarian, pengurutan, hingga antrean dan tumpukan!
        </p>

        {/* Question Progress Dots */}
        <div className="flex items-center gap-1.5 mt-6 overflow-x-auto pb-1">
          {FINAL_QUIZ_QUESTIONS.map((q, idx) => {
            const ans = answersState[q.id];
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={q.id}
                className={`h-2.5 rounded-full transition-all shrink-0 ${
                  isCurrent
                    ? 'w-8 bg-indigo-600'
                    : ans?.isCorrect
                    ? 'w-5 bg-emerald-500'
                    : ans && !ans.isCorrect
                    ? 'w-5 bg-rose-500'
                    : 'w-5 bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {!isFinished ? (
        /* Active Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Question Metadata */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Topik: {currentQ.topic}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Bobot: 10 Poin
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.title}
            </h2>
            <p className="text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {currentQ.scenario}
            </p>

            {currentQ.codeSnippet && (
              <pre className="mt-3 p-3.5 bg-slate-900 text-indigo-300 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                {currentQ.codeSnippet}
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isSubmitted = isAnswerSubmitted;
              const isCorrectAnswer = opt.isCorrect;

              let style = 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800';
              if (isSubmitted) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-200';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${style}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box when submitted */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                answersState[currentQ.id]?.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {answersState[currentQ.id]?.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold">
                    {answersState[currentQ.id]?.isCorrect ? 'Benar Sekali!' : 'Jawaban Salah! Pembahasan:'}
                  </h4>
                  <p className="mt-1 text-xs opacity-90 leading-normal">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Pilih satu jawaban lalu klik tombol konfirmasi.
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md shadow-indigo-100 transition-all"
              >
                KIRIM JAWABAN
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-200 transition-all animate-pulse"
              >
                <span>{currentIdx < FINAL_QUIZ_QUESTIONS.length - 1 ? 'SOAL BERIKUTNYA' : 'LIHAT HASIL EVALUASI'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-inner">
            {badge.icon}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Predikat Akhir Kuis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {badge.category}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
              {badge.description}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Skor Kuis</span>
              <span className="text-2xl font-black text-indigo-900">{currentCalculatedScore}</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Jawaban Benar</span>
              <span className="text-2xl font-black text-emerald-900">{correctCount} / 10</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Jawaban Salah</span>
              <span className="text-2xl font-black text-rose-900">{10 - correctCount}</span>
            </div>
          </div>

          {/* Direct CTA Buttons as requested */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFX.playStep();
                setCurrentIdx(0);
                setSelectedOptionId(null);
                setIsAnswerSubmitted(false);
                setAnswersState({});
                setIsFinished(false);
              }}
              className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ULANGI KUIS</span>
            </button>

            <button
              onClick={onGoToTasks}
              className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-amber-200"
            >
              <span>KERJAKAN TUGAS PRAKTIK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToSummary}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-200"
            >
              <span>LIHAT RAPOR LENGKAP</span>
              <Award className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
