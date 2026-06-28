export const ZONE_DEFS = [
  {
    id: 'PLAZA',
    name: 'TOWN PLAZA',
    sub: 'contact & intro',
    color: '#DD4400',
    bg: '#1A0A00',
    ids: ['contact-zach', 'contact-linkedin', 'contact-github', 'intro-career', 'intro-currently'],
  },
  {
    id: 'OFFICE',
    name: 'DESIGN OFFICE',
    sub: 'design systems',
    color: '#1565C0',
    bg: '#0A1624',
    ids: ['motif-overview', 'motif-speed', 'motif-ai', 'motif-tech', 'motif-leadership'],
  },
  {
    id: 'WORKSHOP',
    name: 'S.G.W. WORKSHOP',
    sub: 'maker & builder',
    color: '#DD4400',
    bg: '#111111',
    ids: ['intro-origin', 'intro-sgw', 'project-rv-build', 'project-sgw-plans'],
  },
  {
    id: 'STUDIO',
    name: 'PODCAST STUDIO',
    sub: 'pixel broccoli',
    color: '#08D7A9',
    bg: '#06102B',
    ids: ['podcast-pixel-broccoli', 'sgw-youtube', 'film-imdb', 'community-sww'],
  },
  {
    id: 'PROJECTS',
    name: 'PROJECTS LAB',
    sub: 'code & tools',
    color: '#546E7A',
    bg: '#0E1416',
    ids: ['project-portfolio-game', 'project-brocc'],
  },
  {
    id: 'CHURCH',
    name: 'WOODSTOCK CITY',
    sub: 'serve & community',
    color: '#4A90D9',
    bg: '#080E1A',
    ids: ['church-td'],
  },
] as const;

export type ZoneDef = typeof ZONE_DEFS[number];

export function getItemZone(id: string): ZoneDef {
  return (ZONE_DEFS.find(z => (z.ids as readonly string[]).includes(id)) ?? ZONE_DEFS[0]) as ZoneDef;
}

export function getAdjacentZone(currentZoneId: string, direction: 'next' | 'prev'): ZoneDef {
  const idx = ZONE_DEFS.findIndex(z => z.id === currentZoneId);
  if (direction === 'next') {
    return ZONE_DEFS[(idx + 1) % ZONE_DEFS.length] as ZoneDef;
  }
  return ZONE_DEFS[(idx - 1 + ZONE_DEFS.length) % ZONE_DEFS.length] as ZoneDef;
}
