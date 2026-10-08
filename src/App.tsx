import React, { useState, useEffect } from 'react';
import { StageId, StudentProfile } from './types';
import { HeaderNav } from './components/HeaderNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Stage1Algorithm } from './components/stages/Stage1Algorithm';
import { Stage2Branching } from './components/stages/Stage2Branching';
import { Stage3Looping } from './components/stages/Stage3Looping';
import { Stage4Searching } from './components/stages/Stage4Searching';
import { Stage5Sorting } from './components/stages/Stage5Sorting';
import { Stage6QueueStack } from './components/stages/Stage6QueueStack';
import { Stage7FinalChallenge } from './components/stages/Stage7FinalChallenge';
import { PracticalTasks } from './components/stages/PracticalTasks';
import { ReflectionSection } from './components/stages/ReflectionSection';
import { FinalSummaryCard } from './components/stages/FinalSummaryCard';

const STUDENT_PROFILE_KEY = 'informatika_sma_student_profile';
const APP_PROGRESS_KEY = 'informatika_sma_app_progress';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STUDENT_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // safe fallback
    }
    return {
      name: '',
      classLevel: 'X',
      schoolName: 'SMA Negeri Indonesia',
    };
  });

  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STUDENT_PROFILE_KEY);
      return !!saved && JSON.parse(saved).name.length > 0;
    } catch {
      return false;
    }
  });

  const [currentStage, setCurrentStage] = useState<StageId>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number }>({ correct: 0, total: 10 });

  // Load progress
  useEffect(() => {
    try {
      const savedProg = localStorage.getItem(APP_PROGRESS_KEY);
      if (savedProg) {
        const parsed = JSON.parse(savedProg);
        if (parsed.score) setScore(parsed.score);
        if (parsed.streak) setStreak(parsed.streak);
        if (parsed.completedStages) setCompletedStages(parsed.completedStages);
        if (parsed.quizResult) setQuizResult(parsed.quizResult);
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Save progress
  const saveProgress = (newScore: number, newStreak: number, newCompleted: number[], qRes = quizResult) => {
    try {
      localStorage.setItem(
        APP_PROGRESS_KEY,
        JSON.stringify({
          score: newScore,
          streak: newStreak,
          completedStages: newCompleted,
          quizResult: qRes,
        })
      );
    } catch {
      // safe fallback
    }
  };

  const handleStartApp = (profile: StudentProfile) => {
    setStudent(profile);
    setHasStarted(true);
    setCurrentStage(1);
    try {
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // safe fallback
    }
  };

  // Add points when completing stages/activities
  const addScore = (stageNum: number, pointsEarned: number) => {
    const updatedCompleted = completedStages.includes(stageNum)
      ? completedStages
      : [...completedStages, stageNum];
    const newScore = Math.min(100, score + pointsEarned);
    const newStreak = streak + 1;

    setScore(newScore);
    setStreak(newStreak);
    setCompletedStages(updatedCompleted);
    saveProgress(newScore, newStreak, updatedCompleted);
  };

  const handleQuizCompleted = (correctCount: number, totalQuestions: number, points: number) => {
    const updatedCompleted = completedStages.includes(7) ? completedStages : [...completedStages, 7];
    const newScore = Math.max(score, points);
    const newStreak = correctCount >= 7 ? streak + 2 : streak;
    const newQuizResult = { correct: correctCount, total: totalQuestions };

    setScore(newScore);
    setStreak(newStreak);
    setCompletedStages(updatedCompleted);
    setQuizResult(newQuizResult);
    saveProgress(newScore, newStreak, updatedCompleted, newQuizResult);
  };

  // Switch Stage
  const handleSelectStage = (stage: StageId) => {
    setCurrentStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStage = (next: StageId) => {
    handleSelectStage(next);
  };

  const handleRestartMaterial = () => {
    setCurrentStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAgain = () => {
    setScore(0);
    setStreak(0);
    setCompletedStages([]);
    saveProgress(0, 0, []);
    setCurrentStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <WelcomeScreen onStart={handleStartApp} initialProfile={student} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header Nav with Progress & Score */}
      <HeaderNav
        currentStage={currentStage}
        onSelectStage={handleSelectStage}
        student={student}
        score={score}
        streak={streak}
        completedStages={completedStages}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentStage === 1 && (
          <Stage1Algorithm
            onComplete={(points) => addScore(1, points)}
            onNextStage={() => handleNextStage(2)}
          />
        )}

        {currentStage === 2 && (
          <Stage2Branching
            onComplete={(points) => addScore(2, points)}
            onNextStage={() => handleNextStage(3)}
          />
        )}

        {currentStage === 3 && (
          <Stage3Looping
            onComplete={(points) => addScore(3, points)}
            onNextStage={() => handleNextStage(4)}
          />
        )}

        {currentStage === 4 && (
          <Stage4Searching
            onComplete={(points) => addScore(4, points)}
            onNextStage={() => handleNextStage(5)}
          />
        )}

        {currentStage === 5 && (
          <Stage5Sorting
            onComplete={(points) => addScore(5, points)}
            onNextStage={() => handleNextStage(6)}
          />
        )}

        {currentStage === 6 && (
          <Stage6QueueStack
            onComplete={(points) => addScore(6, points)}
            onNextStage={() => handleNextStage(7)}
          />
        )}

        {currentStage === 7 && (
          <Stage7FinalChallenge
            onQuizCompleted={handleQuizCompleted}
            onGoToTasks={() => handleNextStage('tasks')}
            onGoToSummary={() => handleNextStage('summary')}
          />
        )}

        {currentStage === 'tasks' && (
          <PracticalTasks
            student={student}
            onGoToReflection={() => handleNextStage('reflection')}
          />
        )}

        {currentStage === 'reflection' && (
          <ReflectionSection
            student={student}
            onGoToSummary={() => handleNextStage('summary')}
          />
        )}

        {currentStage === 'summary' && (
          <FinalSummaryCard
            student={student}
            totalScore={score}
            correctAnswersCount={quizResult.correct}
            totalQuestionsCount={quizResult.total}
            completedStages={completedStages}
            onRepeatMaterial={handleRestartMaterial}
            onPlayAgain={handlePlayAgain}
            onGoToTasks={() => handleNextStage('tasks')}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Mata Pelajaran Informatika SMA Kelas X / XII — Bab 2 Algoritma &amp; Struktur Data
          </span>
          <span className="text-slate-400">
            “Belajar dengan mencoba, bukan hanya menghafal!”
          </span>
        </div>
      </footer>
    </div>
  );
}
