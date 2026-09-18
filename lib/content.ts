export type Fact = { k: string; v: string };

export type WorkFile = {
  k: string;
  v: string;
  role: string;
  org: string;
  period: string;
  file: string;
  img: string;
  detail: string;
  tags: string[];
};

export type Hobby = { k: string; v: string; note: string };

export type Movie = {
  k: string;
  v: string;
  type: string;
  note: string;
  poster: string;
  voice: string;
};

export type Channel = {
  k: string;
  icon: "mail" | "in" | "ig" | "blog";
  v: string;
  href: string;
  hint: string;
};

type Base = {
  key: string;
  label: string;
  num: string;
  img: string;
  pos?: string;
  title: string;
  body: string;
};

export type Section = Base &
  (
    | { layout: "about"; items: Fact[] }
    | { layout: "work"; items: WorkFile[] }
    | { layout: "hobby"; items: Hobby[] }
    | { layout: "movie"; items: Movie[] }
    | { layout: "contact"; items: Channel[] }
  );

export const email = "gunadharma201@gmail.com";
export const blogUrl = "https://medium.com/@gunadharma201";

export const sections: Section[] = [
  {
    key: "about",
    label: "About Me",
    num: "01",
    img: "/media/about.jpg",
    pos: "center 25%",
    title: "About Me",
    layout: "about",
    body: "Cybersecurity engineer and software developer with 2+ years of hands-on experience delivering enterprise-grade solutions in high-stakes financial and security environments. Off the clock I design things, shoot photographs, and watch far too many films.",
    items: [
      { k: "Role", v: "Cybersecurity Engineer / Tech Nerd" },
      { k: "Base", v: "Jakarta, ID" },
      { k: "Focus", v: "Security · Software · Design" },
      { k: "Now", v: "Open for collaboration" },
    ],
  },
  {
    key: "work",
    label: "Work Experience",
    num: "02",
    img: "/media/work.jpg",
    title: "Work Experience",
    layout: "work",
    body: "Where I have worked, most recent first. Click a role for details.",
    items: [
      {
        k: "2024 — Present",
        v: "Cybersecurity Engineer — ALTO Network",
        role: "Cybersecurity Engineer",
        org: "ALTO Network",
        period: "2024 — Present",
        file: "CASE 01",
        img: "/media/work-detail.jpg",
        detail:
          "Placeholder — describe your responsibilities: securing payment infrastructure, threat detection & response, vulnerability management, compliance (PCI-DSS).",
        tags: ["Threat detection", "Vulnerability mgmt", "PCI-DSS", "Incident response"],
      },
      {
        k: "2023 — 2024",
        v: "Software Engineer Intern — PT Perkebunan Nusantara III",
        role: "Software Engineer Intern",
        org: "PT Perkebunan Nusantara III",
        period: "2023 — 2024",
        file: "CASE 02",
        img: "/media/work-detail.jpg",
        detail:
          "Placeholder — built internal tools, backend services and automation for plantation operations; stack and impact.",
        tags: ["Backend", "Internal tools", "Automation"],
      },
      {
        k: "2022 — Present",
        v: "Freelancer",
        role: "Freelancer",
        org: "Independent",
        period: "2022 — Present",
        file: "CASE 03",
        img: "/media/work-detail.jpg",
        detail:
          "Placeholder — web development, security audits and design work for clients; notable projects.",
        tags: ["Web dev", "Security audit", "Design"],
      },
    ],
  },
  {
    key: "hobby",
    label: "Hobby",
    num: "03",
    img: "/media/hobby.jpg",
    title: "Hobby",
    layout: "hobby",
    body: "What I do when the screen is off.",
    items: [
      { k: "01", v: "Fishing", note: "Patience training, disguised as a weekend." },
      { k: "02", v: "Reading", note: "Mostly non-fiction, security and sci-fi." },
      { k: "03", v: "Gaming", note: "Story-driven, the slower the better." },
      { k: "04", v: "Watching movies", note: "See section 04." },
      { k: "05", v: "Doing fun stuff", note: "Anything that ends with a good story." },
    ],
  },
  {
    key: "movie",
    label: "Movie",
    num: "04",
    img: "/media/movie.jpg",
    pos: "center 30%",
    title: "My Favorite Movie",
    layout: "movie",
    body: "The stories I keep coming back to — slow burns, big ideas, and a bit of science.",
    items: [
      {
        k: "01",
        v: "Peaky Blinders",
        type: "Series · 2013",
        note: "By order of the Peaky Blinders.",
        poster: "/media/poster-peaky.jpg",
        voice: "/media/voice-peaky.mp3",
      },
      {
        k: "02",
        v: "Dune",
        type: "Film · 2021",
        note: "Fear is the mind-killer.",
        poster: "/media/poster-dune.jpg",
        voice: "/media/voice-dune.mp3",
      },
      {
        k: "03",
        v: "Dr. Stone",
        type: "Anime · 2019",
        note: "Ten billion percent.",
        poster: "/media/poster-drstone.jpg",
        voice: "/media/voice-drstone.mp3",
      },
      {
        k: "04",
        v: "Interstellar",
        type: "Film · 2014",
        note: "Do not go gentle into that good night.",
        poster: "/media/poster-interstellar.jpg",
        voice: "/media/voice-interstellar.mp3",
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    num: "05",
    img: "/media/contact.jpg",
    pos: "center 22%",
    title: "Contact",
    layout: "contact",
    body: "Send a signal. I usually answer within a day.",
    items: [
      { k: "Mail", icon: "mail", v: email, href: `mailto:${email}`, hint: "Best for work" },
      {
        k: "LinkedIn",
        icon: "in",
        v: "in/gunadharma0408",
        href: "https://linkedin.com/in/gunadharma0408",
        hint: "Professional",
      },
      {
        k: "Instagram",
        icon: "ig",
        v: "@gunaaax",
        href: "https://instagram.com/gunaaax",
        hint: "Photos & fun stuff",
      },
      {
        k: "Blog",
        icon: "blog",
        v: "medium.com/@gunadharma201",
        href: blogUrl,
        hint: "Writing on security & tech",
      },
    ],
  },
];
