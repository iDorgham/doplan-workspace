import { green, yellow, red, cyan, dim } from 'colorette';

export function success(message: string): void {
  console.log(green(`✓ ${message}`));
}

export function warn(message: string): void {
  console.warn(yellow(`⚠ ${message}`));
}

export function error(message: string): void {
  console.error(red(`✗ ${message}`));
}

export function info(message: string): void {
  console.log(cyan(`ℹ ${message}`));
}

export function dimText(text: string): string {
  return dim(text);
}

export function formatProgressBar(progress: number, length: number = 40): string {
  const filled = Math.round((progress / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
