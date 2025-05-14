
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation utility function for staggered animations
export function staggeredDelay(index: number, baseDelay = 100): string {
  return `${index * baseDelay}ms`;
}

// Media recommendation types
export type MediaRecommendation = {
  title: string;
  author?: string;
  description: string;
  imageUrl?: string;
  link?: string;
  type: 'book' | 'video' | 'game';
  tags: string[];
  emotion: string[];
}
