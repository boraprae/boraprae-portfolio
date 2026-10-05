/**
 * CV content lives here. Unknown career details are deliberately empty.
 * Add real roles, projects, education, and links without changing the scene code.
 */
export const profile = {
  name: "Yainezu",
  role: "Software engineer",
  introduction: "A frontend developer with a curious mind and a soft spot for pixel art, retro design, and thoughtful digital experiences.",
  email: "",
  github: "",
  linkedin: "",
};

export type Experience = { role: string; company: string; period: string; summary: string; highlights: string[] };
export type Project = { name: string; category: string; summary: string; stack: string[]; url?: string };
export type Education = { title: string; institution: string; period: string; summary: string };

export const experience: Experience[] = [];
export const education: Education[] = [];
export const projects: Project[] = [
  {
    name: "A little world of my own",
    category: "Personal portfolio · In progress",
    summary: "An interactive workspace that tells a story through a moving camera. Built around a woman at her laptop, a warm palette, and small details that unfold as you scroll.",
    stack: ["Next.js", "React", "TypeScript", "Three.js"],
  },
];

export const chapters = [
  { id: "welcome", label: "Welcome", at: 0, range: [0, 0, .067, .105], side: "left", eyebrow: "A PERSONAL PORTFOLIO / YAINEZU", title: "A little code.", accent: "A world of possibilities.", body: "Software engineer, curious human, and the person at this desk. Come in — there’s a story to explore.", object: "THE STUDIO", note: "Every story starts somewhere." },
  { id: "about", label: "About me", at: .155, range: [.105, .125, .185, .222], side: "right", eyebrow: "01 / THE PERSON BEHIND THE SCREEN", title: "Hello there.", accent: "I’m Yainezu.", body: profile.introduction, object: "THE PERSON", note: "A little curiosity goes a long way." },
  { id: "toolkit", label: "Toolkit", at: .278, range: [.225, .25, .315, .345], side: "left", eyebrow: "02 / IDEAS INTO INTERFACES", title: "Thoughtfully made.", accent: "Line by line.", body: "I’m drawn to the place where code meets visual storytelling. This portfolio is a small exploration of that space.", object: "THE LAPTOP", note: "A thought becomes something you can use." },
  { id: "experience", label: "Experience", at: .412, range: [.35, .38, .442, .472], side: "right", eyebrow: "03 / THE JOURNEY SO FAR", title: "Every chapter", accent: "leaves a mark.", body: "The roles, teams, and lessons that shape the way I work. A place for the story behind the résumé.", object: "THE NOTEBOOK", note: "Room for the work, and what it taught me." },
  { id: "work", label: "Selected work", at: .542, range: [.477, .505, .575, .604], side: "right", eyebrow: "04 / FROM AN IDEA TO SOMETHING REAL", title: "Small beginnings.", accent: "Meaningful things.", body: "A closer look at what I’m building — the ideas, the decisions, and the details that make each project its own.", object: "THE PROJECT", note: "Watch an idea take shape." },
  { id: "approach", label: "My approach", at: .675, range: [.61, .637, .708, .74], side: "left", eyebrow: "05 / UNDER THE SURFACE", title: "Good work", accent: "has layers.", body: "The interface you see. The interactions you feel. The engineering holding it together. I care about how those pieces connect.", object: "THE LAYERS", note: "The details make the difference." },
  { id: "learning", label: "Always learning", at: .807, range: [.744, .773, .84, .876], side: "right", eyebrow: "06 / KEEP A LITTLE ROOM FOR CURIOSITY", title: "Still curious.", accent: "Still becoming.", body: "New ideas, old notebooks, and things I haven’t figured out yet. Learning is part of the process, not a chapter that ends.", object: "THE BOOKSHELF", note: "There’s always another page." },
  { id: "next", label: "What’s next", at: .965, range: [.88, .91, 1, 1], side: "left", eyebrow: "07 / THE NEXT CHAPTER", title: "A different angle.", accent: "A new possibility.", body: "That’s a little glimpse into my world. Thanks for taking the time to look around — this story is still being written.", object: "A NEW PERSPECTIVE", note: "The end is another beginning." },
] as const;
