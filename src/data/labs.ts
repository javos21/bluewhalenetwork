// Proof-of-concept content. Shown only in preview builds (PUBLIC_SHOW_LABS),
// so Nic can see what each block needs from him. Everything here is fictional
// or an example, and must never reach production.

export const examplePartners = [
  { name: 'Northline', mark: 'diamond' },
  { name: 'Coral & Co.', mark: 'wave' },
  { name: 'Meridian', mark: 'circle' },
  { name: 'Harbourside', mark: 'arch' },
  { name: 'Kestrel Foods', mark: 'spark' },
  { name: 'Tidewater', mark: 'bars' },
] as const;

export type StatItem = {
  value: string;
  suffix?: string;
  label: string;
  /** true = a real fact already supported by Nic's brief */
  real?: boolean;
};

export const stats: StatItem[] = [
  { value: '5', label: 'Industries of founder experience', real: true },
  { value: '12', suffix: '+', label: 'Years in commercial roles' },
  { value: '40', suffix: '+', label: 'Opportunities assessed' },
  { value: '25', suffix: '+', label: 'Partnerships brokered' },
];
