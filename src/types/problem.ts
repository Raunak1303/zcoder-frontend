// src/types/problem.ts
export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  inputTestCase: string;
  expectedOutput: string;
}