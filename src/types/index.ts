export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'tasks' | 'reflection' | 'summary';

export interface StudentProfile {
  name: string;
  classLevel: 'X' | 'XII';
  schoolName: string;
}

export interface QuizQuestion {
  id: number;
  topic: string;
  topicCategory: 'algoritma' | 'percabangan' | 'looping' | 'nested_loop' | 'searching' | 'sorting' | 'queue' | 'stack';
  title: string;
  scenario: string;
  codeSnippet?: string;
  type: 'multiple-choice' | 'order-predict' | 'simulation-output';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  hint?: string;
}

export interface PracticalTaskAnswers {
  task1: string; // Algoritma kehidupan sehari-hari (7 langkah)
  task2: string; // Contoh percabangan if-else SMA
  task3: string; // Contoh perulangan kehidupan sehari-hari
  task4: string; // Penggunaan Queue & Stack di kehidupan nyata
  task5Problem: string; // Masalah di sekolah
  task5Algorithm: string;
  task5HasBranching: string;
  task5HasLooping: string;
  task5NeedsSearchSort: string;
  task5QueueOrStack: string;
}

export interface ReflectionAnswers {
  mostUnderstood: string;
  mostConfusing: string;
  favoriteGame: string;
  futureApplication: string;
}

export type BadgeCategory = 'MASTER ALGORITMA' | 'AHLI ALGORITMA' | 'PENJELAJAH ALGORITMA' | 'AYO COBA LAGI';

export interface BadgeInfo {
  category: BadgeCategory;
  minScore: number;
  maxScore: number;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}
