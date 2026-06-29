export interface PortfolioItem {
  id: string;
  levelId: number;
  type: 'info' | 'case-study' | 'project' | 'podcast' | 'article';
  title: string;
  shortDesc: string;
  longDesc: string;
  link?: string;
  linkLabel?: string;
  tags?: string[];
  image?: string;
  outfit?: string;
}

/** Minimal YAML frontmatter parser -- no Node.js dependencies, works in the browser. */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (!key) continue;

    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
    } else if (val !== '' && !isNaN(Number(val))) {
      data[key] = Number(val);
    } else if (val === 'true' || val === 'false') {
      data[key] = val === 'true';
    } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      data[key] = val.slice(1, -1);
    } else {
      data[key] = val;
    }
  }

  return { data, content: match[2].trim() };
}

// Load all NPC markdown files at build time via Vite's import.meta.glob
const rawFiles = import.meta.glob('../content/npcs/*.md', { eager: true, query: '?raw', import: 'default' });

export const allPortfolioData: PortfolioItem[] = Object.values(rawFiles).map((raw) => {
  const { data, content } = parseFrontmatter(raw as string);
  return { ...data, longDesc: content } as PortfolioItem;
});
