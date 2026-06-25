export interface Lesson {
  session: number
  title: string
  /** The "why" — what they'll be able to do after this session. */
  objective: string
  /** The concrete thing the student creates in Canva this session. */
  build: string
  /** The Canva skills introduced (kept to a small set per session). */
  skills: string[]
  /** A design/marketing idea, framed for grades 4–7. */
  concept: { term: string; framing: string }
  /** Optional starting point in Canva. */
  canvaSearch: string
}

/**
 * Digital Design & Marketing — a 6-session arc for grades 4–7 using Canva.
 * The golden thread: each student invents ONE pretend business in Session 1
 * and designs for that same business every session, building a full brand.
 */
export const DIGITAL_DESIGN_LESSONS: Lesson[] = [
  {
    session: 1,
    title: "What Makes Design Work?",
    objective: "Get comfortable in Canva and learn what makes a design grab your eye.",
    build: "An \"All About Me\" poster — a low-stakes first project to learn the tools.",
    skills: ["Canva tour", "Templates", "Adding & editing text", "Elements & stickers", "Saving your work"],
    concept: { term: "Contrast", framing: "Can you read it from across the room? Big + bold beats tiny + faint." },
    canvaSearch: "poster",
  },
  {
    session: 2,
    title: "Color & Font = Personality",
    objective: "Pick colors and fonts that give your business its own personality.",
    build: "A brand board for your invented business: its name, 3 colors, and 2 fonts.",
    skills: ["Color palettes", "Font pairing", "The Brand Kit", "Eyedropper tool"],
    concept: { term: "Mood", framing: "Colors have feelings — red = exciting, blue = calm. Match them to your business." },
    canvaSearch: "brand board",
  },
  {
    session: 3,
    title: "Designing a Logo",
    objective: "Create a simple, memorable logo using shapes and icons.",
    build: "Your business's logo.",
    skills: ["Shapes", "Icons & graphics", "Grouping elements", "Alignment & spacing"],
    concept: { term: "Simplicity", framing: "The best logos are simple enough to draw from memory. Less is more." },
    canvaSearch: "logo",
  },
  {
    session: 4,
    title: "Selling the Message",
    objective: "Make an ad that tells people exactly what to do.",
    build: "A poster or social media post advertising your product.",
    skills: ["Layout & hierarchy", "Headlines", "Call-to-action buttons", "Using your brand colors"],
    concept: { term: "Call to Action", framing: "Every ad tells you to DO something: \"Buy now!\", \"Follow us!\", \"Try it!\"" },
    canvaSearch: "instagram post",
  },
  {
    session: 5,
    title: "Telling a Story",
    objective: "Design a set of pieces that look like they belong together.",
    build: "A 3-slide Instagram-style carousel (or matching flyer set) for your business.",
    skills: ["Multi-page designs", "Duplicating pages", "Visual consistency", "Copy & paste styles"],
    concept: { term: "Consistency", framing: "Same colors, same fonts, every time — that's how people recognize a brand." },
    canvaSearch: "instagram carousel",
  },
  {
    session: 6,
    title: "Make It Move",
    objective: "Bring your brand to life with a short animated promo.",
    build: "A short promo video or animated ad for your product — the grand finale.",
    skills: ["Animation & transitions", "Canva video timeline", "Adding music", "Exporting as video"],
    concept: { term: "Attention", framing: "Movement catches the eye. A few seconds of motion can stop someone scrolling." },
    canvaSearch: "video",
  },
]

export const TRACK_LESSONS: Record<string, Lesson[]> = {
  "digital-design": DIGITAL_DESIGN_LESSONS,
}
