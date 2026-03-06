import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TAG_COLORS = {
  'Special Moment': 'bg-pink-100 text-pink-700 border-pink-200',
  'Important Information': 'bg-blue-100 text-blue-700 border-blue-200',
  'Bad News': 'bg-gray-100 text-gray-700 border-gray-200',
};

export const TAG_GRADIENTS = {
  'Special Moment': 'from-pink-500 to-rose-500',
  'Important Information': 'from-blue-500 to-indigo-500',
  'Bad News': 'from-slate-500 to-gray-700',
};
