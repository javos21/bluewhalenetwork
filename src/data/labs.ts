// Proof-of-concept content. Shown only in preview builds (PUBLIC_SHOW_LABS),
// so Nic can see what each block needs from him. The client logos and
// "TTD $90M+" came from his brochure (Oct 2026) and are real. Everything here is fictional
// or an example, and must never reach production.

export type StatItem = {
  value: string;
  suffix?: string;
  label: string;
  /** true = a real fact already supported by Nic's brief */
  real?: boolean;
};

export const stats: StatItem[] = [
  { value: '5', label: 'Industries of founder experience', real: true },
  { value: '90', suffix: 'M+', label: 'TTD in marketing budgets directed', real: true },
  { value: '40', suffix: '+', label: 'Opportunities assessed' },
  { value: '25', suffix: '+', label: 'Partnerships brokered' },
];
