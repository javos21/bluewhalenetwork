// Selected clients & collaborations, from the logo page of Nic's service
// brochure (Oct 2026). Nic approved their use on 21 Oct 2026, in the
// Clients section only. Never place these beside the anonymised case studies.
//
// The SVGs in public/logos/clients were traced to one colour from the small
// raster logos in the brochure. They are interim: replace each with the
// brand's official vector file when available (keep the filename).
// `w`/`h` are each file's viewBox, used to balance optical size.

export type Client = { name: string; file: string; w: number; h: number };

export const clients: Client[] = [
  { name: 'TSTT', file: 'tstt', w: 970, h: 640 },
  { name: 'bmobile', file: 'bmobile', w: 975, h: 325 },
  { name: 'Digicel', file: 'digicel', w: 1005, h: 315 },
  { name: 'Lucozade', file: 'lucozade', w: 1342, h: 385 },
  { name: 'The House of Angostura', file: 'angostura', w: 1377, h: 506 },
  { name: 'Carib Brewery', file: 'carib', w: 1005, h: 650 },
  { name: 'Powergen', file: 'powergen', w: 521, h: 696 },
  { name: 'bp Trinidad and Tobago', file: 'bp-tt', w: 784, h: 601 },
  { name: 'Atlantic', file: 'atlantic', w: 718, h: 724 },
  { name: 'Groupe Antilles-Glaces', file: 'antilles-glaces', w: 700, h: 462 },
  { name: 'Associated Brands Industries Limited', file: 'associated-brands', w: 815, h: 343 },
  { name: 'Banks DIH', file: 'banks-dih', w: 755, h: 538 },
  { name: 'LargeUp', file: 'largeup', w: 802, h: 801 },
];

/** Equal optical area: wide wordmarks get less height than square marks. */
export const logoHeight = (c: Client, base = 3.5) => {
  const ratio = c.w / c.h;
  return Math.min(base * 1.25, base / Math.sqrt(ratio) * 1.15);
};
