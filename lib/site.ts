export const siteConfig = {
  name: "The AI Rishi",
  tagline: "Ancient Wisdom · Modern Intelligence",
  description:
    "A continuous, first-principles technology learning and content platform spanning Artificial Intelligence, Large Language Models, Cloud Architecture, and DevOps Engineering.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://theairishi.com",
  author: {
    name: "The AI Rishi",
    role: "AI & Platform Engineer",
    bio: "Exploring the intersection of human curiosity, ancient contemplative discipline, and modern computational systems.",
  },
  social: {
    github: "https://github.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    email: "contact@theairishi.com",
  },
  navigation: {
    main: [
      { name: "Learning Hub", href: "/learn" },
      { name: "Guides", href: "/guides" },
      { name: "Projects", href: "/projects" },
      { name: "YouTube", href: "/youtube" },
      { name: "Instagram", href: "/instagram" },
      { name: "About", href: "/about" },
    ],
    footer: [
      { name: "Home", href: "/" },
      { name: "Learning Hub", href: "/learn" },
      { name: "Guides", href: "/guides" },
      { name: "Projects", href: "/projects" },
      { name: "YouTube", href: "/youtube" },
      { name: "Instagram", href: "/instagram" },
      { name: "About", href: "/about" },
    ],
  },
};
