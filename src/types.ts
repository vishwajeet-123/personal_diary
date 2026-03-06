export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DiaryEntry {
  _id: string;
  userId: string;
  date: string;
  content: string;
  tag: 'Special Moment' | 'Important Information' | 'Bad News';
  createdAt: string;
  updatedAt: string;
}

export type TagType = 'Special Moment' | 'Important Information' | 'Bad News';
