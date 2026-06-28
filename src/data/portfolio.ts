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
}

// ── Easter Egg ────────────────────────────────────────────────────────────────
export const easterEggData: PortfolioItem[] = [
  {
    id: 'easter-egg-wife',
    levelId: 1,
    type: 'info',
    title: '¡Hola! Soy la Esposa 💁‍♀️',
    shortDesc: 'La mujer detrás del hombre... y honestamente, la más inteligente de los dos.',
    longDesc: `¡Me encontraste! Felicitaciones, eres muy curioso/a. 🎉

Soy la esposa de Zach — colombiana, orgullosa, y la razón por la que este hombre tiene buen gusto.

Datos importantes que Zach no te va a decir:
→ Yo le digo cuándo algo se ve mal
→ Yo le digo cuándo algo se ve bien
→ Sin mí, probablemente viviría en el taller

Si este portafolio te impresionó, en parte es mérito mío. El otro parte fue él, supongo. 😄

¡Gracias por jugar!`,
    tags: ['easter egg', '🇨🇴', 'familia'],
  },
];

// ── Level 1: Introduction ──────────────────────────────────────────────────
export const level1Data: PortfolioItem[] = [
  {
    id: 'intro-origin',
    levelId: 1,
    type: 'info',
    title: 'Country Boy, Coder, Maker',
    shortDesc: 'Grew up watching dad and grandpa build. Never stopped.',
    longDesc: `I grew up watching my father and grandfather weld and woodwork in their shops. That instinct — to make things with your hands — never left me.

At 18 I bit off my first major project: converting the attic in my mom's garage into a loft apartment. Then I pursued a career in web development and worked my way up to senior level.

The two worlds never fully separated. Today I run a basement workshop in Metro Atlanta and build design systems for enterprise software. Different materials, same mindset.

The name? Southern Ginger Workshop — because I'm a ginger from the south, and the shop is where it all comes together.`,
    tags: ['background', 'maker', 'Atlanta'],
    link: 'https://southerngingerworkshop.com',
    linkLabel: 'Visit the workshop →',
  },
  {
    id: 'intro-career',
    levelId: 1,
    type: 'info',
    title: '25+ Years in the Craft',
    shortDesc: 'From front-end engineer to design systems architect — full stack depth throughout.',
    longDesc: `I've been building for the web since Flash was a career move and jQuery was cutting-edge.

Over 25+ years I moved from front-end engineering into design systems architecture — leading teams, shaping product strategy, and shipping things that millions of people use.

My flagship work: a global design system at enterprise scale, adopted by 550+ design teams and 680+ product teams across 2,000+ repositories.

I've worked across agency, startup, and enterprise. Each one taught me something the others couldn't.

The throughline: I care about quality, craft, and the person on the other side of the screen.`,
    tags: ['career', 'experience', 'engineering'],
    link: 'https://linkedin.com/in/zachmanring',
    linkLabel: 'View LinkedIn →',
  },
  {
    id: 'intro-sgw',
    levelId: 1,
    type: 'project',
    title: 'Southern Ginger Workshop',
    shortDesc: 'Custom woodworking, CNC, metalworking — built out of a basement in Atlanta.',
    longDesc: `Southern Ginger Workshop is my creative outlet and small business. Out of my basement workshop I build:

→ Light-up wooden signs
→ Custom benches and furniture
→ Teardrop trailers (full builds)
→ Aluminum badges and CNC work
→ RV restorations and modifications

I also create weekly YouTube videos documenting the design and build process — because showing the work matters as much as doing it.

Nothing is as rewarding as solving a customer's problem with something you built with your own hands.`,
    tags: ['maker', 'CNC', 'YouTube'],
    link: 'https://southerngingerworkshop.com',
    linkLabel: 'Visit SGW →',
  },
  {
    id: 'church-td',
    levelId: 1,
    type: 'info',
    title: 'Technical Director — Woodstock City Church',
    shortDesc: 'Volunteer TD running audio, video, and lighting for Sunday services in Woodstock, GA.',
    longDesc: `I volunteer as the Technical Director at Woodstock City Church — managing audio, video, and lighting for Sunday morning services.

It's one of those things that found me. I had the skills from years of AV and production work, the church had the need, and it turns out there's something really meaningful about using technical craft in service of community.

Every Sunday: mixing live audio from the stage, running ProPresenter for lyrics and sermon graphics, directing camera operators for the livestream, and keeping the whole production invisible — so people can focus on worship, not the tech.

→ Live mixing for full band worship sets
→ ProPresenter / graphics for lyrics and speaker support
→ Multi-camera livestream direction
→ Lighting design and console operation

Woodstock City is part of the North Point Ministries family, serving thousands in the Woodstock, GA area.`,
    link: 'https://woodstockcity.org/',
    linkLabel: 'Visit Woodstock City Church →',
    tags: ['volunteer', 'live production', 'AV'],
  },
  {
    id: 'intro-currently',
    levelId: 1,
    type: 'info',
    title: 'What I\'m Up To',
    shortDesc: 'Design systems, a basement workshop, a podcast, and this game.',
    longDesc: `Right now I'm focused on:

→ Design systems — maintaining and evolving an enterprise design system at scale
→ Southern Ginger Workshop — building things in the basement shop
→ Pixel Broccoli — a podcast about tech, creativity, and the future of work
→ AI experiments — exploring how generative tools change what's possible
→ This portfolio — because a game is more interesting than a PDF

I'm open to conversations about design systems leadership, front-end architecture, AI tooling, and creative collaboration.`,
    tags: ['current', 'open to work'],
    link: 'https://linkedin.com/in/zachmanring',
    linkLabel: 'Connect on LinkedIn →',
  },
];

// ── Level 2: Design Systems ────────────────────────────────────────────────
export const level2Data: PortfolioItem[] = [
  {
    id: 'motif-overview',
    levelId: 2,
    type: 'case-study',
    title: 'Enterprise Design System',
    shortDesc: 'Enterprise-scale design system. 550+ design teams. 680+ product teams. 2,000+ repos.',
    longDesc: `I architected and led a global design system — the single source of truth for UI components, design tokens, and front-end patterns across one of the world's largest digital platforms.

It spans React, Angular, and Web Components, consumed by teams in over 2,000 repositories.

The challenge wasn't building components — it was building a system that teams would actually adopt, contribute to, and trust over time.`,
    tags: ['design systems', 'enterprise', 'react'],
  },
  {
    id: 'motif-speed',
    levelId: 2,
    type: 'info',
    title: '5 Days → 1.5 Days',
    shortDesc: 'Automated scaffolding cut component creation time by 70%.',
    longDesc: `One of my highest-impact contributions: reducing the time to scaffold a new design-system-compliant component from 5 days to 1.5 days.

I identified the repetitive work (boilerplate, test setup, Storybook config, token wiring) and built tooling to automate it.

Result: faster contribution, lower barrier to entry, more consistent output, and engineers spending time on interesting problems instead of setup.

Same principle as the workshop: the right jig makes every cut faster and more accurate.`,
    tags: ['automation', 'tooling', 'DX'],
  },
  {
    id: 'motif-ai',
    levelId: 2,
    type: 'info',
    title: 'GitHub Copilot + AI Tooling',
    shortDesc: 'AI-assisted component generation. 30% productivity improvement measured.',
    longDesc: `I led the integration of GitHub Copilot into the design system workflow — not just enabling it, but building the context and tooling that makes it actually useful.

Custom prompts, component-aware code completion, and AI-assisted documentation generation helped teams move faster with higher consistency.

Measured result: 30% productivity improvement in component development cycles.

Beyond the day job — AI is also how I run Pixel Broccoli: episode research, social copy generation, even the co-host. I've been leaning into the AI moment across every part of the work.

This isn't about replacing engineers — it's about removing friction between idea and implementation. The frontier is where I want to work.`,
    tags: ['AI', 'GitHub Copilot', 'tooling'],
  },
  {
    id: 'motif-tech',
    levelId: 2,
    type: 'info',
    title: 'Multi-Framework Architecture',
    shortDesc: 'React, Angular, and Web Components — one system, no chaos.',
    longDesc: `Supporting multiple frameworks in a shared design system is architecturally complex. The system handles this through a token-first approach and a Web Components core that React and Angular wrappers sit on top of.

Teams don't have to choose a framework to use it — and the system doesn't fracture into parallel implementations.

I designed the abstraction layer that makes this work, and the contribution model that keeps it consistent as hundreds of teams add to it.`,
    tags: ['react', 'angular', 'architecture'],
  },
  {
    id: 'motif-leadership',
    levelId: 2,
    type: 'info',
    title: 'Leading at Scale',
    shortDesc: 'Aligning 550+ design teams and 680+ product teams on shared standards.',
    longDesc: `At this scale, the technical problems are almost easier than the organizational ones.

I've led the team through migrations, adoption campaigns, and platform rewrites. I've aligned stakeholders across design, engineering, and product on shared standards — without mandating them.

The approach: make the right way the easy way. If your system is easier to use than not, adoption follows.

I believe in giving engineers meaningful ownership, building feedback loops that improve the system over time, and making infrastructure work feel worth doing.`,
    tags: ['leadership', 'strategy', 'enterprise'],
  },
];

// ── Level 3: Podcast & Creative ────────────────────────────────────────────
export const level3Data: PortfolioItem[] = [
  {
    id: 'podcast-pixel-broccoli',
    levelId: 3,
    type: 'podcast',
    title: 'Pixel Broccoli',
    shortDesc: 'AI is changing everything — so we gave it a microphone.',
    longDesc: `Pixel Broccoli is my podcast, co-hosted with Evan and Brocc — an AI co-host who's very much part of the conversation.

Each episode unpacks what AI is actually doing to the world: the hype, the reality, and the stuff nobody's saying out loud yet.

Recent episodes:
→ #004 — Build Because You Love It: why we build, when it's expression vs. avoidance, and Gen Z rejecting AI slop
→ #003 — Who Gets the 2AM Call? What happens when AI-generated code breaks in prod?
→ #002 — Do We Even Need This? Tech we've built and quietly stopped using
→ #001 — Meet the Hosts. Yes, One Is an AI

Brocc has opinions on broccoli, George H.W. Bush, and lawn care. He's thorough.`,
    tags: ['podcast', 'AI', 'tech'],
    link: 'https://open.spotify.com/show/033gFTqCwsukpXM8B1ruUm',
    linkLabel: 'Listen on Spotify →',
  },
  {
    id: 'sgw-youtube',
    levelId: 3,
    type: 'project',
    title: 'Southern Ginger on YouTube',
    shortDesc: 'Weekly build videos — woodworking, CNC, metalworking, trailers, and more.',
    longDesc: `The Southern Ginger Workshop YouTube channel is where I document the build process.

Weekly videos: custom woodworking, CNC projects, metalworking, teardrop trailer builds, RV restorations, and shop tips.

I created it because I wanted to share the process — not just the finished product. The "how" is where the real story is.

Come for the builds. Stay for the occasional disaster.`,
    tags: ['YouTube', 'maker', 'DIY'],
    link: 'https://youtube.com/@southernginger',
    linkLabel: 'Watch on YouTube →',
  },
  {
    id: 'film-imdb',
    levelId: 3,
    type: 'project',
    title: '1st Assistant Director',
    shortDesc: 'Short film productions — on set as 1st AD, keeping the day on schedule.',
    longDesc: `Outside of software and workshops, I've crewed on short film productions as 1st Assistant Director.

The 1st AD runs the set. You own the schedule, call the shots (literally), and make sure the director gets what they need before the sun goes down. It's logistics, communication, and controlled chaos — all things I enjoy.

Short films move fast with lean crews. Every decision matters.

→ Managed on-set logistics and shot scheduling
→ Coordinated cast, crew, and department heads
→ Kept productions on time and under control

Different medium, same instinct: know the system, run it well, ship the thing.`,
    tags: ['film', '1st AD', 'production'],
    link: 'https://www.imdb.com/name/nm13852660/',
    linkLabel: 'View on IMDb →',
  },
  {
    id: 'community-sww',
    levelId: 3,
    type: 'info',
    title: 'Southern Woodworkers',
    shortDesc: 'A Facebook community for southern makers — camaraderie, education, and good vibes.',
    longDesc: `I run Southern Woodworkers, a Facebook group for makers who call the South home.

The goal was simple: build a place where woodworkers, makers, and craftspeople could share their work, ask questions, get feedback, and feel like they belong to something.

No gatekeeping. No elitism. Just people who love building things and want to get better at it together.

→ Community-first: camaraderie over competition
→ Education-focused: tips, techniques, project walkthroughs
→ Open to all skill levels — beginner builds welcome
→ Southern made, but the door is open to everyone

If you make things with your hands and call the South home, come find us.`,
    tags: ['community', 'woodworking', 'maker'],
    link: 'https://www.facebook.com/groups/southernwoodworkers',
    linkLabel: 'Join the group →',
  },
];

// ── Level 4: Projects & Code ───────────────────────────────────────────────
export const level4Data: PortfolioItem[] = [
  {
    id: 'project-portfolio-game',
    levelId: 4,
    type: 'project',
    title: 'This Game',
    shortDesc: 'A Phaser 3 + React portfolio. You\'re playing it right now.',
    longDesc: `Meta moment: you found the card about the game, inside the game.

Built with Phaser 3, React 18, Vite, and TypeScript. All graphics are procedurally generated — no external assets at launch. Architecture separates game logic from React UI via a custom window event bus.

The wood plank platforms are an intentional nod to Southern Ginger Workshop. The orange is SGW brand color #DD4400.

I built this because I wanted my portfolio to be something people actually want to explore — not another PDF that nobody reads.`,
    tags: ['phaser', 'react', 'game dev'],
    link: 'https://github.com/zmanring',
    linkLabel: 'View GitHub →',
  },
  {
    id: 'project-brocc',
    levelId: 4,
    type: 'project',
    title: 'Pixel Broccoli Brocc',
    shortDesc: 'Open-source repo for the Pixel Broccoli podcast — ideas, episodes, tooling.',
    longDesc: `Brocc is the behind-the-scenes GitHub repo for the Pixel Broccoli podcast.

Episode ideas, production tracking, and custom tooling all live here. It's also an experiment in working in public — the process is visible, the tools are open source.

Some of the tooling built on top of it: AI-assisted episode briefs, social media copy generation, and automated GIF creation for promo clips.

Everything I build eventually becomes a system. Even a podcast.`,
    tags: ['open source', 'AI', 'tooling'],
    link: 'https://github.com/zmanring/brocc',
    linkLabel: 'View on GitHub →',
  },
  {
    id: 'project-rv-build',
    levelId: 4,
    type: 'project',
    title: 'RV Rebuild + Custom Wrap',
    shortDesc: 'Rebuilt a Class A motorhome from the frame up. Then designed the wrap myself.',
    longDesc: `My Papa left me his Class A motorhome when he passed away. Restoring it felt like the right way to honor him — and to keep it in the family for a long time.

The rebuild covered everything: electrical, plumbing, interior renovation, mechanical work. The kind of project where every system teaches you something new.

Then I designed the wrap — the full-body graphic kit on the outside. Custom color scheme, swoosh layout, geometry. Designed it myself and had it professionally installed.

The whole build is documented on the Southern Ginger Workshop YouTube channel. Now we take it to the North Georgia mountains — and when we want something gnarlier, we hit the trails at Windrock Park in Tennessee with the SxS rigs and the Jeep Rubicon.

→ Full mechanical and interior rebuild
→ Custom wrap design (concept through install)
→ Documented on YouTube from start to finish
→ Regular trips to the North Georgia mountains and Windrock Park

It's one of my favorite projects. Not just because of the build — because of who it came from.`,
    tags: ['RV', 'maker', 'off-road'],
    link: 'https://youtube.com/@southernginger',
    linkLabel: 'Watch the build →',
  },
  {
    id: 'project-sgw-plans',
    levelId: 4,
    type: 'project',
    title: 'SGW Digital Products',
    shortDesc: 'CNC plans, woodworking templates, and DIY project files.',
    longDesc: `Beyond physical builds, Southern Ginger Workshop sells digital products — plans and templates for other makers:

→ CNC cornhole board files (VCarve + SVG + DXF)
→ Kreg Jig K4 pocket hole station plans
→ Shop organization and workbench plans
→ RV modification guides and templates

The goal: make it easier for other makers to skip the design phase and get to the build.

Good documentation is good engineering, whether it's a design system or a set of woodworking plans.`,
    tags: ['woodworking', 'CNC', 'maker'],
    link: 'https://southerngingerworkshop.com/products',
    linkLabel: 'Browse products →',
  },
];

// ── Level 5: Contact ────────────────────────────────────────────────────────
export const level5Data: PortfolioItem[] = [
  {
    id: 'contact-zach',
    levelId: 5,
    type: 'info',
    title: 'Zach Manring',
    shortDesc: 'Design Systems Architect · Front-End Engineer · Atlanta, GA',
    longDesc: `Hey, I'm Zach.

25+ years building for the web — from front-end engineering to design systems architecture. I led a global enterprise design system adopted by 550+ design teams across 2,000+ repositories.

I also run a basement workshop, co-host a podcast, and apparently build portfolio games.

I'm open to conversations about:
→ Design systems leadership roles
→ Front-end architecture and platform work
→ AI-augmented development tooling
→ Creative technical projects

Whether it's enterprise software or a teardrop trailer — let's find out if there's a fit.`,
    link: 'https://linkedin.com/in/zachmanring',
    linkLabel: 'Connect on LinkedIn →',
    tags: ['contact', 'professional'],
    image: '/assets/zach.jpg',
  },
  {
    id: 'contact-linkedin',
    levelId: 5,
    type: 'info',
    title: 'LinkedIn',
    shortDesc: 'Full career history, endorsements, and recommendations.',
    longDesc: `The formal version of everything you just played through.

Career history, endorsements, and the professional record of 25+ years in web development and design systems.`,
    link: 'https://linkedin.com/in/zachmanring',
    linkLabel: 'View profile →',
    tags: ['contact', 'professional'],
  },
  {
    id: 'contact-github',
    levelId: 5,
    type: 'info',
    title: 'GitHub',
    shortDesc: 'Open source work, experiments, and the code behind this game.',
    longDesc: `Where the code lives. Open source contributions, experiments, and side projects — including the source for this portfolio game.`,
    link: 'https://github.com/zmanring',
    linkLabel: 'View profile →',
    tags: ['contact', 'code'],
  },
];

export const allPortfolioData: PortfolioItem[] = [
  ...easterEggData,
  ...level1Data,
  ...level2Data,
  ...level3Data,
  ...level4Data,
  ...level5Data,
];
