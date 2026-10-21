// Section water colours. Light tones carry a deep whale and midnight text;
// dark tones carry a pale whale and white text.

export type Tone = 'paper' | 'ice' | 'deep' | 'midnight' | 'aqua';

export const toneColor: Record<Tone, string> = {
  paper: 'var(--color-paper)',
  ice: 'var(--color-ice)',
  deep: 'var(--color-deep)',
  midnight: 'var(--color-midnight)',
  aqua: 'var(--color-aqua)',
};

export const isDarkTone = (tone: Tone) => tone === 'deep' || tone === 'midnight';
